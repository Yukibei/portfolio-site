import Link from "next/link";
import { NOTE_CATEGORIES, type NoteCategory } from "@/content/notes/types";
import styles from "./chrome.module.css";

/** 首页顶栏的分类筛选，通过 ?category= 走服务端过滤 */
export default function CategoryTabs({ active }: { active: NoteCategory | null }) {
  return (
    <div className={styles.tabs}>
      <Link href="/notes" className={`${styles.tab} ${active === null ? styles.tabActive : ""}`}>
        全部
      </Link>
      {NOTE_CATEGORIES.map((category) => (
        <Link
          key={category}
          href={{ pathname: "/notes", query: { category } }}
          className={`${styles.tab} ${active === category ? styles.tabActive : ""}`}
        >
          {category}
        </Link>
      ))}
    </div>
  );
}
