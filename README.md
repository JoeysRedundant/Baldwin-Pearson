# Baldwin Pearson — Codex architectural redesign

An independent, complete Next.js website with the original Baldwin Pearson logo, 30 imported properties, local optimized photography, searchable listings, property galleries, a database-backed inquiry form, and a protected listing editor/inbox.

## Run locally

Requires Node.js 24 and npm. On Windows PowerShell use `npm.cmd` if script execution policy blocks `npm`.

```sh
npm ci
npm run setup
npm run dev
```

Open **http://localhost:3100**. The administrator workspace is **http://localhost:3100/admin**. `npm run setup` creates `.env.local` and stores the randomly generated local password in `data/admin-credentials.txt`. Both are ignored by Git. Setup never overwrites existing credentials.

The worktree is `E:\claude\baldwin-pearson-codex`, branch `codex/architectural-redesign`. Claude's independent alternative is in a different worktree and branch. Do not merge either alternative into the other.

## What works

- Home, firm/team, expertise, sales/lease/closed collections, 30 property detail pages, contact/appraisals, privacy, and custom 404.
- Address/city/keyword search, location and property-type filters, sorting, and shareable query parameters.
- Inquiry submissions stored in Neon Postgres in production (SQLite locally) and viewable in the protected team inbox. Property inquiry links prefill the listing and service.
- Create and edit listings, upload real photos, reorder the cover image, update prices/statuses, feature on the homepage, publish, and archive. Unpublishing preserves the record.
- Hashed administrator password, random expiring sessions stored as hashes, HTTP-only same-site cookies, origin checks, schema validation, rate limits, and a honeypot field.
- Legacy page redirects, metadata, sitemap, responsive imagery, keyboard focus styles, and reduced-motion support.

## Production and email

Production runs on **Vercel with Neon Postgres and private Vercel Blob storage**. Listings, inquiries, sessions, and rate limits persist in Postgres; uploaded photos persist in Blob and are served through the media route. Vercel runtime code refuses to fall back to its ephemeral filesystem. Local development uses SQLite and the local upload directory by default.

- Website: https://baldwin-pearson.vercel.app
- Repository: https://github.com/JoeysRedundant/Baldwin-Pearson
- Administrator workspace: https://baldwin-pearson.vercel.app/admin

1. Configure the variables in `.env.example`. Set `SITE_URL` to the exact public HTTPS origin and set `COOKIE_SECURE=true`.
2. Supply a private `ADMIN_PASSWORD_HASH` generated with the same scrypt format as `scripts/setup.mjs`; keep the plaintext password out of the deployment environment and source control.
3. Connect a Neon database and private Blob store to the Vercel production environment. With `DATABASE_URL` set, run `npm run db:migrate` once to initialize tables and import seed listings; existing listing edits are preserved. Vercel supplies Blob credentials through its store integration. Photo uploads accept up to 4 MB per file. Set `TRUST_PROXY=true` on Vercel, which supplies forwarded client IP headers.
4. To receive email alerts, set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, and `INQUIRY_TO`. Without SMTP, submissions still reach the working administrator inbox. Failed email delivery never discards a saved inquiry and is indicated in the inbox.
5. Set `SITE_URL` during the production build as well as at runtime so prerendered metadata uses the public domain. No analytics or advertising scripts are installed.

The original baldwinpearson.com domain has **not** been replaced. SMTP is optional and is not configured; contact requests are available in the protected inbox. A standalone server can still use SQLite by omitting `DATABASE_URL` and persisting `/app/data`, including uploaded images. The Docker deployment path is supplied but has not been container-tested in this Windows session.

## Verification

```sh
npm run build
npm run typecheck
npm test
npm run format:check
```

`npm test` starts an isolated production instance on loopback port 3102, uses a separate database and upload directory under `data/test-runs`, and shuts down the test server afterward. It never modifies the normal preview database. Build before running tests. Port 3102 must be free.

Set `TEST_HOSTED=true` and supply cloud database/Blob credentials to run the same checks against those services through the local test server. The suite removes its own inquiry, listing, and uploaded-photo fixtures afterward. Cloud tests have verified persistence, photo uploads, publication, and authentication against the provisioned production services.

Tests cover every public property page and image, legacy redirects, missing-property 404s, sitemap, unauthenticated access rejection, inquiry validation and persistence, origin checks, sign-in, image upload/invalid-image rejection, draft/publication/edit/archive transitions, duplicate slugs, unsafe image paths, inquiry read state, and session revocation.

Browser checks additionally exercised mobile navigation, leasing/location filters, gallery controls, property-specific inquiry prefilling, and successful inquiry submission against the separate local QA instance.

## Source content

Content and imagery were imported from https://baldwinpearson.com/ on October 6, 2026. This is an editable snapshot, not a live feed. The original logo files are preserved. Existing site photographs were optimized into WebP; no fabricated property imagery or transaction metrics are used. Property categories are derived from the source descriptions.

The source has discrepancies: the contact body lists 10 Middle Street, Bridgeport, while the shared footer lists 55 Walls Drive, Suite 304, Fairfield. This version consistently uses the shared footer address. Some property descriptions differ from their headings (for example 1794/1795 North Avenue); the imported heading is preserved. The original homepage and sales collection disagree on some statuses; the more recent homepage status for 57 Whiting Street is retained. The owner should verify current contact and listing facts before publishing.

`scripts/import-site.mjs` and `scripts/prepare-content.mjs` reproduce the import. They write source captures into ignored `source/` and seed data into `src/data/`. They do not overwrite an existing database: ongoing changes belong in the listing editor.
