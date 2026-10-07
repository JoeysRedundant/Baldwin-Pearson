import { spawn } from 'node:child_process';
import { scryptSync, randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('data', 'test-runs', randomUUID());
fs.mkdirSync(root, { recursive: true });
const salt = 'baldwin-local-test-only',
  base = 'http://localhost:3102';
const hosted = process.env.TEST_HOSTED === 'true';
if (hosted && !process.env.DATABASE_URL) throw new Error('Hosted tests require DATABASE_URL.');
const env = {
  ...process.env,
  VERCEL: '',
  DATABASE_URL: hosted ? process.env.DATABASE_URL : '',
  BLOB_STORE_ID: hosted ? process.env.BLOB_STORE_ID : '',
  BLOB_READ_WRITE_TOKEN: hosted ? process.env.BLOB_READ_WRITE_TOKEN : '',
  TRUST_PROXY: 'false',
  SITE_URL: base,
  DATABASE_PATH: path.join(root, 'test.sqlite'),
  UPLOAD_DIR: path.join(root, 'uploads'),
  ADMIN_PASSWORD_HASH: salt + ':' + scryptSync('Local-test-only-2026!', salt, 64).toString('hex'),
  COOKIE_SECURE: 'false',
  SMTP_HOST: '',
  INQUIRY_TO: '',
  NEXT_TELEMETRY_DISABLED: '1',
};
const log = fs.openSync(path.join(root, 'server.log'), 'a');
const server = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3102'],
  { env, stdio: ['ignore', log, log], windowsHide: true },
);
let exitCode = 1;
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null)
      throw new Error('Test server exited. Read ' + path.join(root, 'server.log'));
    try {
      const response = await fetch(base);
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  if (!ready) throw new Error('Test server did not become ready.');
  const child = spawn(process.execPath, ['--test', 'tests/integration.test.mjs'], {
    env: {
      ...env,
      TEST_BASE_URL: base,
      TEST_DATABASE_PATH: env.DATABASE_PATH,
      TEST_DATABASE_URL: hosted ? env.DATABASE_URL : '',
    },
    stdio: 'inherit',
    windowsHide: true,
  });
  exitCode = await new Promise((resolve) => child.on('exit', (code) => resolve(code ?? 1)));
} finally {
  server.kill();
  fs.closeSync(log);
}
process.exitCode = exitCode;
