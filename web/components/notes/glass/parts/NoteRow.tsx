import Link from "next/link";
import type { ReactNode } from "react";
import type { NoteMeta } from "@/content/notes/types";
import { coverArtStyle } from "../coverArt";
import styles from "./NoteRow.module.css";

type NoteRowProps = {
  note: NoteMeta;
  /** 副行；缺省显示「日期 · 阅读时长」 */
  sub?: ReactNode;
  /** 行尾插槽：书签按钮、百分比等 */
  trailing?: ReactNode;
};

export default function NoteRow({ note, sub, trailing }: NoteRowProps) {
  return (
    <div className={styles.rowWrap}>
      <Link href={`/notes/${note.slug}`} className={styles.row}>
        <span className={styles.cover} style={coverArtStyle(note.slug, note.cover)} aria-hidden />
        <span className={styles.text}>
          <span className={styles.title}>{note.title}</span>
          {sub ?? (
            <span className={styles.meta}>
              {note.displayDate} · {note.readTime}
            </span>
          )}
        </span>
      </Link>
      {trailing !== undefined && <span className={styles.trailing}>{trailing}</span>}
    </div>
  );
}

export function ProgressBar({ percent }: { percent: number }) {
  return (
    <span className={styles.track}>
      <span className={styles.fill} style={{ width: `${percent}%` }} />
    </span>
  );
}

export function RowPercent({ percent }: { percent: number }) {
  return <span className={styles.pct}>{percent}%</span>;
}

export { styles as rowStyles };
