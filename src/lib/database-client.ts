import { neon } from '@neondatabase/serverless';
import type { SQLInputValue } from 'node:sqlite';

export type Row = Record<string, unknown>;
export function hostedDatabase() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const sql = neon(url);
  return {
    prepare(statement: string) {
      let position = 0;
      const query = statement.replace(/\?/g, () => `$${++position}`);
      const all = async (...args: SQLInputValue[]): Promise<Row[]> =>
        sql.query(query, args) as Promise<Row[]>;
      return {
        all,
        get: async (...args: SQLInputValue[]) => (await all(...args))[0],
        run: async (...args: SQLInputValue[]) => {
          await all(...args);
        },
      };
    },
  };
}
