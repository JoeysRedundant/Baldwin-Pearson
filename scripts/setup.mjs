import { randomBytes, scryptSync } from 'node:crypto';
import fs from 'node:fs';
if (fs.existsSync('.env.local')) {
  console.log('.env.local already exists; no credentials changed.');
  process.exit(0);
}
const password = randomBytes(18).toString('base64url'),
  salt = randomBytes(16).toString('hex');
const hash = salt + ':' + scryptSync(password, salt, 64).toString('hex');
fs.mkdirSync('data', { recursive: true });
fs.writeFileSync(
  '.env.local',
  `SITE_URL=http://localhost:3100\nADMIN_PASSWORD_HASH=${hash}\nCOOKIE_SECURE=false\n`,
  { mode: 0o600 },
);
fs.writeFileSync(
  'data/admin-credentials.txt',
  `Baldwin Pearson local editor\nURL: http://localhost:3100/admin\nPassword: ${password}\n\nKeep this file private. It is ignored by Git.\n`,
  { mode: 0o600 },
);
console.log(
  'Local configuration created. Administrator password saved privately in data/admin-credentials.txt.',
);
