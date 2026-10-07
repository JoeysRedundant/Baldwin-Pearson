import { load } from 'cheerio';
import fs from 'node:fs/promises';
import sharp from 'sharp';
const base = 'https://baldwinpearson.com';
await fs.mkdir('source', { recursive: true });
await fs.mkdir('public/images', { recursive: true });
await fs.mkdir('src/data', { recursive: true });
async function page(path) {
  const response = await fetch(base + path);
  if (!response.ok) throw new Error(path + ': ' + response.status);
  const html = await response.text();
  await fs.writeFile('source/' + (path.replaceAll('/', '_') || 'home') + '.html', html);
  return load(html);
}
const paths = [
  '/',
  '/about-baldwinpearson/',
  '/contact/',
  '/listings-active/',
  '/listings-lease/',
  '/listings-sold/',
];
const pages = await Promise.all(paths.map(page));
const urls = [
  ...new Set(
    pages.flatMap(($) =>
      $('a[href*="/listing/"]')
        .map((i, e) => $(e).attr('href'))
        .get(),
    ),
  ),
];
console.log('Found', urls.length, 'properties');
const records = [];
let count = 0;
for (const url of urls) {
  try {
    const $ = await page(new URL(url).pathname);
    const body = $('body').text().replace(/\s+/g, ' ').trim();
    const imgs = $('img')
      .map((i, e) => ({ url: $(e).attr('src'), alt: $(e).attr('alt') }))
      .get()
      .filter((x) => x.url?.includes('/uploads/') && !x.url.includes('Logo'));
    const links = $('a[href$=".pdf"]')
      .map((i, e) => $(e).attr('href'))
      .get();
    records.push({
      url,
      slug: new URL(url).pathname.split('/').filter(Boolean).at(-1),
      headings: $('h1,h2,h3,h4')
        .map((i, e) => $(e).text().trim())
        .get(),
      body,
      images: imgs,
      pdfs: links,
    });
    console.log(++count, new URL(url).pathname, imgs.length);
  } catch (e) {
    console.log('FAILED', url, e.message);
  }
}
await fs.writeFile('source/listings.json', JSON.stringify(records, null, 2));
const images = [
  ...new Set(
    [
      ...pages.flatMap(($) =>
        $('img')
          .map((i, e) => $(e).attr('src'))
          .get(),
      ),
      ...records.flatMap((r) => r.images.map((i) => i.url)),
    ].filter((u) => u?.includes('/uploads/')),
  ),
];
const mapping = {};
for (const [i, url] of images.entries()) {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(r.status);
    const buf = Buffer.from(await r.arrayBuffer());
    const name = url.includes('Logo') ? 'logo-' + i + '.png' : 'photo-' + i + '.webp';
    await sharp(buf)
      .rotate()
      .resize({ width: 1800, withoutEnlargement: true })
      .toFormat(name.endsWith('png') ? 'png' : 'webp', { quality: 85 })
      .toFile('public/images/' + name);
    mapping[url] = '/images/' + name;
  } catch (e) {
    console.log('Image failed', url, e.message);
  }
}
await fs.writeFile('source/images.json', JSON.stringify(mapping, null, 2));
console.log('Saved', Object.keys(mapping).length, 'images');
