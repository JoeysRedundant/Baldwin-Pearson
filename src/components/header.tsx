'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowTopRightIcon, HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons';
import assets from '@/data/assets.json';
export function Header() {
  const [open, setOpen] = useState(false),
    pathname = usePathname();
  return (
    <header className="site-header">
      <div className="shell flex items-center justify-between gap-6">
        <Link
          href="/"
          aria-label="Baldwin Pearson home"
          onClick={() => setOpen(false)}
          className="logo"
        >
          <Image
            src={assets.logo}
            width={230}
            height={66}
            alt="Baldwin Pearson & Company"
            priority
          />
        </Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          <Link
            href="/properties"
            aria-current={pathname.startsWith('/properties') ? 'page' : undefined}
          >
            Properties
          </Link>
          <Link href="/services" aria-current={pathname === '/services' ? 'page' : undefined}>
            Our expertise
          </Link>
          <Link href="/about" aria-current={pathname === '/about' ? 'page' : undefined}>
            Our firm
          </Link>
          <Link href="/contact" className="nav-contact">
            Let’s talk <ArrowTopRightIcon />
          </Link>
        </nav>
        <button
          type="button"
          className="mobile-toggle"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <Cross1Icon /> : <HamburgerMenuIcon />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav shell"
          aria-label="Mobile navigation"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false);
          }}
        >
          {[
            ['Properties', '/properties'],
            ['Our expertise', '/services'],
            ['Our firm', '/about'],
            ['Let’s talk', '/contact'],
          ].map(([label, url]) => (
            <Link key={url} href={url} onClick={() => setOpen(false)}>
              {label}
              <ArrowTopRightIcon />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
