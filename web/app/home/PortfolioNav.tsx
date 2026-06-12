"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { CONTACT_MAILTO, NAV_LINKS } from "./constants";

function MobileMenu({
  menuOpen,
  closeMenu,
}: {
  menuOpen: boolean;
  closeMenu: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-sm transition-all duration-500 md:hidden ${
        menuOpen ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="font-podium text-2xl font-bold uppercase tracking-wider text-white sm:text-3xl">
          YILING LI
        </span>
        <button
          type="button"
          onClick={closeMenu}
          aria-label="Close menu"
          className="cursor-pointer text-white"
        >
          <X className="h-7 w-7" />
        </button>
      </div>

      <nav className="flex h-[calc(100%-5.5rem)] flex-col items-center justify-center gap-8">
        {NAV_LINKS.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noreferrer" : undefined}
            onClick={closeMenu}
            className="font-podium text-4xl uppercase text-white sm:text-5xl"
            style={{
              transitionProperty: "opacity, transform",
              transitionDuration: "500ms",
              transitionDelay: `${i * 80 + 100}ms`,
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
            }}
          >
            {link.label}
          </a>
        ))}
        <a
          href={CONTACT_MAILTO}
          onClick={closeMenu}
          className="mt-6 flex items-center gap-2 border border-white/30 px-6 py-3 font-inter text-xs uppercase tracking-widest text-white transition-colors hover:border-white/60 hover:bg-white/10"
          style={{
            transitionProperty: "opacity, transform",
            transitionDuration: "500ms",
            transitionDelay: `${NAV_LINKS.length * 80 + 100}ms`,
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? "translateY(0)" : "translateY(20px)",
          }}
        >
          GET IN TOUCH
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </nav>
    </div>
  );
}

export default function PortfolioNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <MobileMenu menuOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />
      <header
        className={`fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 transition-colors duration-300 sm:px-10 lg:px-16 lg:py-7 ${
          scrolled ? "bg-black/70 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <a
          href="#"
          className="font-podium text-2xl font-bold uppercase tracking-wider text-white sm:text-3xl"
        >
          YILING LI
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="font-inter text-sm uppercase tracking-widest text-white/80 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={CONTACT_MAILTO}
          className="hidden items-center gap-2 border border-white/30 px-6 py-3 font-inter text-xs uppercase tracking-widest text-white transition-all hover:border-white/60 hover:bg-white/10 md:flex"
        >
          GET IN TOUCH
          <ArrowUpRight className="h-4 w-4" />
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="cursor-pointer space-y-1.5 md:hidden"
        >
          <div className="h-0.5 w-6 bg-white" />
          <div className="h-0.5 w-6 bg-white" />
          <div className="h-0.5 w-4 bg-white" />
        </button>
      </header>
    </>
  );
}
