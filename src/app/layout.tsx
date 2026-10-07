import type { Metadata } from 'next';
import { DM_Sans, Manrope } from 'next/font/google';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import './globals.css';
const body = DM_Sans({ subsets: ['latin'], variable: '--font-body' });
const display = Manrope({ subsets: ['latin'], variable: '--font-display' });
export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3100'),
  title: {
    default: 'Baldwin Pearson | Connecticut Commercial Real Estate',
    template: '%s | Baldwin Pearson',
  },
  description:
    'Independent commercial real estate expertise in Connecticut since 1953. Explore properties for sale and lease, investment sales, and certified appraisals.',
  openGraph: {
    type: 'website',
    siteName: 'Baldwin Pearson',
    images: [{ url: '/images/architecture.webp', width: 2000, height: 1262 }],
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
