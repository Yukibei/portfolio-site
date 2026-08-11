import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  BellIcon,
  DownloadIcon,
  GearIcon,
  HeartIcon,
  HomeIcon,
  LockIcon,
  PersonIcon,
} from "../controls/icons";
import SearchBox from "../SearchBox";
import styles from "./GlassShell.module.css";
import chrome from "./chrome.module.css";

export type RailKey = "home" | "favorites" | "queue" | "profile" | "settings";

/** 非首页时顶栏中部显示的页面标题 */
export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className={chrome.pageTitle}>{children}</h1>;
}

/** 五个入口全部落在玻璃系统内部，不再跳出到个人站其他页面 */
const RAIL_ITEMS = [
  { key: "home", href: "/notes", label: "首页", Icon: HomeIcon },
  { key: "favorites", href: "/notes/favorites", label: "收藏", Icon: HeartIcon },
  { key: "queue", href: "/notes/queue", label: "稍后读", Icon: DownloadIcon },
  { key: "profile", href: "/notes/profile", label: "个人主页", Icon: PersonIcon },
  { key: "settings", href: "/notes/settings", label: "设置", Icon: GearIcon },
] as const satisfies ReadonlyArray<{ key: RailKey; href: string; label: string; Icon: typeof HomeIcon }>;

/** 侧栏与主区的行布局：split 为原版的 1.15fr / 1fr 双块，single 为整块 */
type SlotLayout = "split" | "single";

type GlassShellProps = {
  active: RailKey;
  /** 地址栏显示的路径，如 /notes/favorites */
  path: string;
  /** 顶栏中部：首页放分类 tabs，其余页面放标题 */
  headCenter?: ReactNode;
  side: ReactNode;
  main: ReactNode;
  sideLayout?: SlotLayout;
  mainLayout?: SlotLayout;
  /** 提醒中心有未读时点亮铃铛绿点 */
  hasUnread?: boolean;
};

export default function GlassShell({
  active,
  path,
  headCenter,
  side,
  main,
  sideLayout = "split",
  mainLayout = "split",
  hasUnread = false,
}: GlassShellProps) {
  return (
    <div className={styles.page}>
      <div className={styles.bg} aria-hidden />

      <div className={styles.grid}>
        <header className={chrome.chrome}>
          <div className={chrome.lights} aria-hidden>
            <span className={`${chrome.light} ${chrome.lightClose}`} />
            <span className={`${chrome.light} ${chrome.lightMin}`} />
            <span className={`${chrome.light} ${chrome.lightMax}`} />
          </div>

          <div className={chrome.addressBar}>
            <LockIcon size={11} />
            <span>liyilin.xyz{path}</span>
          </div>

          <Link href="/" className={chrome.backHome}>
            返回桌面
          </Link>
        </header>

        <nav className={styles.rail} aria-label="笔记系统导航">
          {RAIL_ITEMS.map(({ key, href, label, Icon }) => (
            <Link
              key={key}
              href={href}
              className={`${styles.railButton} ${key === active ? styles.railActive : ""}`}
              aria-label={label}
              title={label}
              aria-current={key === active ? "page" : undefined}
            >
              <Icon size={18} />
            </Link>
          ))}
        </nav>

        <section className={styles.window}>
          <header className={chrome.winhead}>
            <SearchBox />

            <div className={chrome.headRight}>
              {headCenter}

              <Link href="/notes/notifications" className={chrome.bell} aria-label="提醒中心">
                <BellIcon size={16} />
                {hasUnread && <i className={chrome.bellDot} />}
              </Link>

              <Link href="/notes/profile" className={chrome.profile}>
                <Image
                  src="/profile-desktop/avatar-yiling.png"
                  alt="李怡霖"
                  width={36}
                  height={36}
                  className={chrome.avatar}
                />
                <span>
                  <span className={chrome.profileName}>李怡霖</span>
                  <span className={chrome.profileHandle}>liyilin.xyz</span>
                </span>
              </Link>
            </div>
          </header>

          <div className={styles.winbody}>
            <div className={`${styles.side} ${styles[sideLayout]}`}>{side}</div>
            <div className={`${styles.main} ${styles[mainLayout]}`}>{main}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
