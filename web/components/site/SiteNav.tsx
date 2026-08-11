"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import {
  isSiteNavImmersive,
  SITE_NAV_IMMERSIVE_EVENT,
} from "./immersiveNavigation";
import { CONTACT_MAILTO, SITE_NAV_LINKS } from "./navigation";

function NavLink({
  href,
  label,
  closeMenu,
  mobile = false,
}: {
  href: string;
  label: string;
  closeMenu?: () => void;
  mobile?: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={closeMenu}
      aria-current={active ? "page" : undefined}
      className={`relative tracking-wide transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
        mobile ? "font-heading text-5xl italic" : "font-body text-sm"
      } ${
        active ? "text-white" : "text-white/58 hover:text-white"
      }`}
    >
      {label}
      <span
        className={`absolute -bottom-2 left-0 h-px bg-white transition-[width] duration-300 ${
          active ? "w-full" : "w-0"
        }`}
      />
    </Link>
  );
}

function MobileMenu({ open, close }: { open: boolean; close: () => void }) {
  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 bg-[#050505]/98 backdrop-blur-xl transition-all duration-500 md:hidden ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-5">
        <Link href="/" onClick={close} className="font-podium text-2xl uppercase text-white">
          Yiling Li
        </Link>
        <button
          type="button"
          onClick={close}
          aria-label="关闭导航"
          className="rounded-full p-2 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex h-[calc(100%-5rem)] flex-col items-center justify-center gap-7">
        {SITE_NAV_LINKS.map((link, index) => (
          <div
            key={link.href}
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(18px)",
              transition: `opacity 420ms ${index * 55 + 80}ms, transform 420ms ${index * 55 + 80}ms`,
            }}
          >
            <NavLink {...link} closeMenu={close} mobile />
          </div>
        ))}
        <a
          href="/resume.pdf"
          target="_blank"
          onClick={close}
          className="liquid-glass-strong mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm text-white"
        >
          Resume
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </nav>
    </div>
  );
}

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [immersiveHidden, setImmersiveHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onImmersiveChange = (event: Event) => {
      const active = (event as CustomEvent<boolean>).detail;
      setImmersiveHidden(active);
      if (active) setOpen(false);
    };

    setImmersiveHidden(isSiteNavImmersive());
    window.addEventListener(SITE_NAV_IMMERSIVE_EVENT, onImmersiveChange);
    return () => window.removeEventListener(SITE_NAV_IMMERSIVE_EVENT, onImmersiveChange);
  }, []);

  const solid = pathname !== "/" || scrolled;

  return (
    <>
      <MobileMenu open={open} close={() => setOpen(false)} />
      <header
        aria-hidden={immersiveHidden}
        inert={immersiveHidden}
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,opacity,transform] duration-300 ${
          solid ? "bg-[#050505]/82 backdrop-blur-xl" : "bg-transparent"
        } ${
          immersiveHidden
            ? "pointer-events-none -translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-10 lg:px-16 lg:py-6">
          <Link
            href="/"
            className="font-podium text-2xl uppercase tracking-wide text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            Yiling Li
          </Link>
          <nav className="hidden items-center gap-7 lg:gap-9 md:flex">
            {SITE_NAV_LINKS.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>
          <div className="hidden items-center gap-5 md:flex">
            <a
              href="/resume.pdf"
              target="_blank"
              className="font-body text-sm text-white/58 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Resume
            </a>
            <a
              href={CONTACT_MAILTO}
              className="liquid-glass-strong inline-flex items-center gap-2 rounded-full px-4 py-2 font-body text-sm text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              Contact
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="打开导航"
            className="space-y-1.5 rounded-md p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:hidden"
          >
            <span className="block h-px w-6 bg-white" />
            <span className="block h-px w-6 bg-white" />
            <span className="block h-px w-4 bg-white" />
          </button>
        </div>
      </header>
    </>
  );
}
