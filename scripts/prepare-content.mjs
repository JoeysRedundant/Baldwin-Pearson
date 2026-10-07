import fs from 'node:fs/promises';
import { load } from 'cheerio';
const records = JSON.parse(await fs.readFile('source/listings.json', 'utf8'));
const map = JSON.parse(await fs.readFile('source/images.json', 'utf8'));
const read = async (path) => load(await fs.readFile('source/' + path, 'utf8'));
const home = await read('_.html'),
  sale = await read('_listings-active_.html'),
  lease = await read('_listings-lease_.html'),
  closed = await read('_listings-sold_.html');
const has = ($, url) =>
  $('a')
    .toArray()
    .some((e) => $(e).attr('href') === url);
const seed = [];
for (const r of records) {
  const $ = await read('_listing_' + r.slug + '_.html');
  $('script,style').remove();
  const text = $('body').text().replace(/\s+/g, ' ').trim();
  const hs = r.headings.filter((h) => !h.startsWith('PRICE:'));
  const description =
    text.split('PROPERTY DESCRIPTION')[1]?.split('Baldwin Pearson & Company, Inc.')[0]?.trim() ||
    'Contact our team for property details.';
  const sf = text.match(/APPROX\. SF\s+(.+?)\s+PRICE \/ SF/)?.[1] || '';
  const units = text.match(/NO\. UNITS\s+(.+?)\s+APPROX\. SF/)?.[1] || '';
  let status = has(closed, r.url) ? 'Closed' : has(lease, r.url) ? 'For lease' : 'For sale';
  for (const list of [sale, home]) {
    const a = list('a')
      .toArray()
      .find((e) => list(e).attr('href') === r.url);
    if (a && list(a).closest('.e-parent').text().includes('UNDER CONTRACT'))
      status = 'Under contract';
  }
  let type = /mixed.use/i.test(description)
    ? 'Mixed use'
    : /multifamily|multi.family|apartment building/i.test(description)
      ? 'Multifamily'
      : /industrial|warehouse/i.test(description)
        ? 'Industrial'
        : /office|professional building/i.test(description)
          ? 'Office'
          : /retail/i.test(description)
            ? 'Retail'
            : 'Commercial';
  const paragraphs = $('.elementor-widget-text-editor')
    .toArray()
    .map((e) => $(e).text().trim())
    .find((t) => t.length > 400 && !t.includes('Baldwin Pearson & Company, Inc.55'));
  const cleanDescription = paragraphs
    ? paragraphs.replace(/\n\s*\n/g, '\n\n').replace(/workford/g, 'workforce')
    : description;
  seed.push({
    id: r.slug,
    slug: r.slug,
    title: hs[0],
    city: hs[1].replace(', CT', ''),
    status,
    type,
    price:
      r.headings.find((h) => h.startsWith('PRICE:'))?.replace('PRICE: ', '') ||
      text.match(/PRICE\s+(\$[\d,.]+)/)?.[1] ||
      'Contact for details',
    sqft: sf,
    units,
    description: cleanDescription,
    images: [
      ...new Set(
        r.images
          .filter((x) => !/(?:Shawah|Shawh|Realtor)/i.test(x.url))
          .map((x) => map[x.url])
          .filter(Boolean),
      ),
    ],
    broker: text.includes('CONTACT Daniel') ? 'Daniel Shawah' : 'George Shawah',
    featured: seed.length < 4,
    published: true,
    sourceUrl: r.url,
  });
}
// The homepage provides the more recent status for this listing.
seed.find((x) => x.slug === '57-whiting-street').status = 'Under contract';
await fs.writeFile('src/data/listings.json', JSON.stringify(seed, null, 2));
const find = (s) => Object.entries(map).find(([url]) => url.includes(s))?.[1];
const assets = {
  logo: find('Logo-White-Green-Script-1024'),
  team: find('Team-Baldwin'),
  george: find('George'),
  daniel: find('Dan'),
};
await fs.writeFile('src/data/assets.json', JSON.stringify(assets, null, 2));
console.log(
  JSON.stringify(
    {
      assets,
      listings: seed.map((x) => ({
        title: x.title,
        type: x.type,
        status: x.status,
        sqft: x.sqft,
        images: x.images.length,
      })),
      backgrounds: home('[data-settings]')
        .map((i, e) => home(e).attr('data-settings'))
        .get()
        .filter((x) => x.includes('background')),
    },
    null,
    2,
  ),
);
