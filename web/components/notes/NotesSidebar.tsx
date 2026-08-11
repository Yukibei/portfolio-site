"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NoteGroup } from "@/content/notes/types";

type NotesSidebarProps = {
  groups: NoteGroup[];
};

export default function NotesSidebar({ groups }: NotesSidebarProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="笔记目录" className="font-body">
      <Link
        href="/notes"
        className={`block text-[10px] uppercase tracking-[0.24em] transition-colors ${
          pathname === "/notes" ? "text-white" : "text-white/34 hover:text-white/70"
        }`}
      >
        All notes
      </Link>

      <div className="mt-8 space-y-8">
        {groups.map((group) => (
          <section key={group.category}>
            <h2 className="text-[11px] font-semibold tracking-[0.08em] text-white/45">
              {group.category}
            </h2>
            <ul className="mt-3 space-y-px border-l border-white/12">
              {group.notes.map((note) => {
                const href = `/notes/${note.slug}`;
                const active = pathname === href;

                return (
                  <li key={note.slug}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`-ml-px block border-l py-1.5 pl-4 text-[13px] leading-6 transition-colors ${
                        active
                          ? "border-white text-white"
                          : "border-transparent text-white/42 hover:border-white/40 hover:text-white/80"
                      }`}
                    >
                      {note.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </nav>
  );
}
