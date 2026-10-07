import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { load } from 'cheerio';
const base = process.env.TEST_BASE_URL || 'http://localhost:3101';
const headers = { 'Content-Type': 'application/json', Origin: base };
const post = (path, data, extra = {}) =>
  fetch(base + path, {
    method: 'POST',
    headers: { ...headers, ...extra },
    body: JSON.stringify(data),
  });
const database = new DatabaseSync(process.env.TEST_DATABASE_PATH || 'data/test/test.sqlite');
test('public pages, all property details, assets, legacy redirects, sitemap, and protected workspace', async () => {
  const listings = JSON.parse(fs.readFileSync('src/data/listings.json'));
  for (const url of [
    '/',
    '/about',
    '/services',
    '/contact',
    '/privacy',
    '/properties',
    ...listings.map((p) => '/properties/' + p.slug),
  ]) {
    const r = await fetch(base + url);
    assert.equal(r.status, 200, url);
    const $ = load(await r.text());
    assert.equal($('h1').length, 1, url + ' has one h1');
    assert.ok($('title').text().includes('Baldwin Pearson'));
    assert.ok($('#main').length);
    assert.equal($('img:not([alt])').length, 0, 'all images have alt');
  }
  for (const image of new Set(listings.flatMap((p) => p.images))) {
    assert.equal((await fetch(base + image, { method: 'HEAD' })).status, 200, image);
  }
  for (const [from, to] of [
    ['/about-baldwinpearson', '/about'],
    ['/listings-active', '/properties?status=sale'],
    ['/listings-lease', '/properties?status=lease'],
    ['/listings-sold', '/properties?status=closed'],
    ['/listing/57-whiting-street', '/properties/57-whiting-street'],
  ]) {
    const r = await fetch(base + from, { redirect: 'manual' });
    assert.equal(r.status, 308);
    assert.ok(r.headers.get('location').endsWith(to));
  }
  const admin = await fetch(base + '/admin');
  const html = await admin.text();
  assert.ok(html.includes('Administrator password'));
  assert.ok(!html.includes('Manage availability'));
  const sitemap = await (await fetch(base + '/sitemap.xml')).text();
  for (const p of listings) assert.ok(sitemap.includes('/properties/' + p.slug));
  assert.equal((await fetch(base + '/properties/nonexistent-property')).status, 404);
});
test('inquiries validate, persist, reject cross-origin and honeypot submissions', async () => {
  const data = {
    name: 'Local QA Inquiry',
    email: 'qa@example.test',
    phone: '',
    interest: 'Appraisal',
    property: 'QA property',
    message: 'Local automated test: appraisal inquiry persistence.',
    website: '',
    consent: true,
  };
  assert.equal(
    (await post('/api/inquiries', data, { Origin: 'https://untrusted.example' })).status,
    403,
  );
  assert.equal((await post('/api/inquiries', { ...data, email: 'invalid' })).status, 400);
  assert.equal((await post('/api/inquiries', { ...data, consent: false })).status, 400);
  assert.equal((await post('/api/inquiries', { ...data, website: 'spam' })).status, 400);
  const r = await post('/api/inquiries', data);
  assert.equal(r.status, 201);
  const { id } = await r.json();
  const record = database.prepare('SELECT * FROM inquiries WHERE id=?').get(id);
  assert.equal(record.email, data.email);
  assert.equal(record.interest, 'Appraisal');
  assert.equal(record.read, 0);
  const unauth = await fetch(base + '/api/admin/inquiries', {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ id, read: true }),
  });
  assert.equal(unauth.status, 401);
});
test('admin login, photo upload, draft / publish / update / archive, read state and logout revocation', async () => {
  assert.equal((await post('/api/admin/listings', {})).status, 401);
  assert.equal((await post('/api/auth', { password: 'wrong-password' })).status, 401);
  const login = await post('/api/auth', { password: 'Local-test-only-2026!' });
  assert.equal(login.status, 200);
  const setCookie = login.headers.get('set-cookie');
  assert.match(setCookie, /HttpOnly/i);
  assert.match(setCookie, /SameSite=strict/i);
  const cookie = setCookie.split(';')[0];
  const loggedIn = await fetch(base + '/admin', { headers: { Cookie: cookie } });
  assert.ok((await loggedIn.text()).includes('Property management'));
  const form = new FormData();
  form.append(
    'file',
    new Blob([fs.readFileSync('public/images/photo-5.webp')], { type: 'image/webp' }),
    'qa.webp',
  );
  const upload = await fetch(base + '/api/admin/upload', {
    method: 'POST',
    headers: { Origin: base, Cookie: cookie },
    body: form,
  });
  assert.equal(upload.status, 200);
  const { url } = await upload.json();
  assert.equal((await fetch(base + url)).status, 200);
  const badForm = new FormData();
  badForm.append('file', new Blob(['not an image'], { type: 'image/webp' }), 'bad.webp');
  assert.equal(
    (
      await fetch(base + '/api/admin/upload', {
        method: 'POST',
        headers: { Origin: base, Cookie: cookie },
        body: badForm,
      })
    ).status,
    400,
  );
  const id = 'qa-property-' + Date.now();
  const listing = {
    id,
    slug: id,
    title: 'QA Test Property',
    city: 'Fairfield',
    status: 'For sale',
    type: 'Office',
    price: '$1,250,000',
    sqft: '5,000',
    units: '1',
    description: 'A local test property used to verify the full listing publication lifecycle.',
    images: [url],
    broker: 'Daniel Shawah',
    featured: false,
    published: false,
  };
  let r = await post('/api/admin/listings', listing, { Cookie: cookie });
  assert.equal(r.status, 200, await r.text());
  assert.equal((await fetch(base + '/properties/' + id)).status, 404);
  r = await post('/api/admin/listings', { ...listing, published: true }, { Cookie: cookie });
  assert.equal(r.status, 200);
  assert.equal((await fetch(base + '/properties/' + id)).status, 200);
  r = await post(
    '/api/admin/listings',
    { ...listing, published: true, price: '$1,350,000' },
    { Cookie: cookie },
  );
  assert.equal(r.status, 200);
  assert.ok((await (await fetch(base + '/properties/' + id)).text()).includes('$1,350,000'));
  assert.equal(
    (await post('/api/admin/listings', { ...listing, id: id + '-duplicate' }, { Cookie: cookie }))
      .status,
    409,
  );
  assert.equal(
    (
      await post(
        '/api/admin/listings',
        { ...listing, images: ['javascript:alert(1)'] },
        { Cookie: cookie },
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await post('/api/admin/listings', listing, {
        Cookie: cookie,
        Origin: 'https://untrusted.example',
      })
    ).status,
    401,
  );
  assert.equal(
    (await post('/api/admin/listings', { ...listing, published: false }, { Cookie: cookie }))
      .status,
    200,
  );
  assert.equal((await fetch(base + '/properties/' + id)).status, 404);
  const inquiry = database.prepare('SELECT id FROM inquiries LIMIT 1').get();
  const read = await fetch(base + '/api/admin/inquiries', {
    method: 'PATCH',
    headers: { ...headers, Cookie: cookie },
    body: JSON.stringify({ id: inquiry.id, read: true }),
  });
  assert.equal(read.status, 200);
  assert.equal(database.prepare('SELECT read FROM inquiries WHERE id=?').get(inquiry.id).read, 1);
  assert.equal(
    (
      await fetch(base + '/api/auth', {
        method: 'DELETE',
        headers: { Origin: base, Cookie: cookie },
      })
    ).status,
    200,
  );
  assert.equal((await post('/api/admin/listings', listing, { Cookie: cookie })).status, 401);
  database.prepare('DELETE FROM listings WHERE id=?').run(id);
});
