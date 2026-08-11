"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/content/notes/types";

type NoteTocProps = {
  items: TocItem[];
};

export default function NoteToc({ items }: NoteTocProps) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (items.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = items.find((item) => visible.has(item.id));
        if (current) setActiveId(current.id);
      },
      { rootMargin: "-100px 0px -66% 0px" },
    );

    for (const item of items) {
      const heading = document.getElementById(item.id);
      if (heading) observer.observe(heading);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="本页大纲" className="font-body">
      <p className="text-[10px] uppercase tracking-[0.24em] text-white/34">On this page</p>
      <ul className="mt-4 space-y-px border-l border-white/12">
        {items.map((item) => {
          const active = activeId === item.id;

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? "location" : undefined}
                className={`-ml-px block border-l py-1.5 text-[12px] leading-6 transition-colors ${
                  item.depth === 3 ? "pl-7" : "pl-4"
                } ${
                  active
                    ? "border-white text-white"
                    : "border-transparent text-white/38 hover:border-white/40 hover:text-white/75"
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
