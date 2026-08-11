import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { NOTE_CATEGORIES } from "@/content/notes/types";
import styles from "./GlassShell.module.css";

type GlassShellProps = {
  activeCategory: string | null;
  side: ReactNode;
  main: ReactNode;
};

const RAIL_LINKS = [
  {
    href: "/",
    label: "桌面",
    icon: <path d="M3 10.5L12 3l9 7.5M5 9.5V20h14V9.5" />,
  },
  {
    href: "/work",
    label: "项目",
    icon: <path d="M4 7h16v13H4zM9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M4 13h16" />,
  },
  {
    href: "/notes",
    label: "笔记",
    icon: <path d="M4 5h6a2 2 0 012 2v13a2 2 0 00-2-2H4zM20 5h-6a2 2 0 00-2 2v13a2 2 0 012-2h6z" />,
  },
  {
    href: "/lab",
    label: "实验室",
    icon: <path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3" />,
  },
  {
    href: "/about",
    label: "关于",
    icon: <path d="M20 21a8 8 0 10-16 0M12 13a4 4 0 100-8 4 4 0 000 8z" />,
  },
] as const;

function RailIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export default function GlassShell({ activeCategory, side, main }: GlassShellProps) {
  return (
    <div className={styles.page}>
      <div className={styles.bg} aria-hidden />

      <div className={styles.grid}>
        <header className={styles.chrome}>
          <div className={styles.lights} aria-hidden>
            <span className={`${styles.light} ${styles.lightClose}`} />
            <span className={`${styles.light} ${styles.lightMin}`} />
            <span className={`${styles.light} ${styles.lightMax}`} />
          </div>

          <div className={styles.addressBar}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 018 0v4" />
            </svg>
            <span>liyilin.xyz/notes</span>
          </div>

          <Link href="/" className={styles.backHome}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            返回桌面
          </Link>
        </header>

        <nav className={styles.rail} aria-label="站内导航">
          {RAIL_LINKS.map(({ href, label, icon }) => {
            const isNotes = href === "/notes";
            return (
              <Link
                key={href}
                href={href}
                className={`${styles.railButton} ${isNotes ? styles.railActive : ""}`}
                aria-label={label}
                aria-current={isNotes ? "page" : undefined}
              >
                <RailIcon>{icon}</RailIcon>
              </Link>
            );
          })}
        </nav>

        <section className={styles.window}>
          <header className={styles.winhead}>
            <div className={styles.search}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <span>Search notes</span>
            </div>

            <div className={styles.headRight}>
              <div className={styles.tabs}>
                <Link
                  href="/notes"
                  className={`${styles.tab} ${activeCategory === null ? styles.tabActive : ""}`}
                >
                  全部
                </Link>
                {NOTE_CATEGORIES.map((category) => (
                  <Link
                    key={category}
                    href={{ pathname: "/notes", query: { category } }}
                    className={`${styles.tab} ${activeCategory === category ? styles.tabActive : ""}`}
                  >
                    {category}
                  </Link>
                ))}
              </div>

              <div className={styles.profile}>
                <Image
                  src="/profile-desktop/avatar-yiling.png"
                  alt="李怡霖"
                  width={36}
                  height={36}
                  className={styles.avatar}
                />
                <span>
                  <div className={styles.profileName}>李怡霖</div>
                  <div className={styles.profileHandle}>liyilin.xyz</div>
                </span>
              </div>
            </div>
          </header>

          <div className={styles.winbody}>
            <div className={styles.side}>{side}</div>
            <div className={styles.main}>{main}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
