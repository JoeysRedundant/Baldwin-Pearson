'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowTopRightIcon, HamburgerMenuIcon, Cross1Icon } from '@radix-ui/react-icons';
import assets from '@/data/assets.json';
export function Header() {
  const [open, setOpen] = useState(false),
    pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          setOpen(false);
          toggleRef.current?.focus();
        }
      }}
    >
      <div className="header-bar shell flex items-center justify-between gap-6">
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
          ref={toggleRef}
          type="button"
          className="mobile-toggle"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((wasOpen) => !wasOpen)}
        >
          {open ? <Cross1Icon aria-hidden="true" /> : <HamburgerMenuIcon aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <nav id="mobile-navigation" className="mobile-nav shell" aria-label="Mobile navigation">
          {[
            ['Properties', '/properties'],
            ['Our expertise', '/services'],
            ['Our firm', '/about'],
            ['Let’s talk', '/contact'],
          ].map(([label, url]) => (
            <Link
              key={url}
              href={url}
              aria-current={pathname === url || pathname.startsWith(url + '/') ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
              <ArrowTopRightIcon aria-hidden="true" />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
