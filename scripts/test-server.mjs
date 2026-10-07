import { spawn } from 'node:child_process';
import { scryptSync } from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
const root = path.resolve('data/test');
fs.mkdirSync(root, { recursive: true });
const salt = 'baldwin-local-test-only';
const env = {
  ...process.env,
  SITE_URL: 'http://localhost:3101',
  DATABASE_PATH: path.join(root, 'test.sqlite'),
  UPLOAD_DIR: path.join(root, 'uploads'),
  ADMIN_PASSWORD_HASH: salt + ':' + scryptSync('Local-test-only-2026!', salt, 64).toString('hex'),
  COOKIE_SECURE: 'false',
  SMTP_HOST: '',
  INQUIRY_TO: '',
  NEXT_TELEMETRY_DISABLED: '1',
};
const server = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3101'],
  { env, stdio: 'inherit', windowsHide: true },
);
process.on('SIGINT', () => server.kill());
process.on('SIGTERM', () => server.kill());
server.on('exit', (code) => process.exit(code || 0));
