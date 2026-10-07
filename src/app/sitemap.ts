import type { MetadataRoute } from 'next';
import { getListings } from '@/lib/db';
export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const root = process.env.SITE_URL || 'http://localhost:3100';
  return [
    '',
    '/properties',
    '/services',
    '/about',
    '/contact',
    '/privacy',
    ...(await getListings()).map((p) => '/properties/' + p.slug),
  ].map((path) => ({
    url: root + path,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));
}
