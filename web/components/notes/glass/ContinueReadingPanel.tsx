"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NoteMeta } from "@/content/notes/types";
import { DONE_PERCENT, MIN_TRACKED_PERCENT, readProgressMap } from "./readingProgress";
import { coverStyle } from "./coverArt";
import styles from "./GlassDashboard.module.css";

type ContinueReadingPanelProps = {
  notes: NoteMeta[];
};

type ContinueItem = {
  note: NoteMeta;
  percent: number;
  updatedAt: number;
};

/** 从 localStorage 读取真实滚动进度，按最近阅读排序渲染「继续阅读」 */
export default function ContinueReadingPanel({ notes }: ContinueReadingPanelProps) {
  const [items, setItems] = useState<ContinueItem[]>([]);

  useEffect(() => {
    const map = readProgressMap();
    const tracked: ContinueItem[] = [];

    for (const note of notes) {
      const entry = map[note.slug];
      if (!entry) continue;
      if (entry.percent < MIN_TRACKED_PERCENT || entry.percent > DONE_PERCENT) continue;
      tracked.push({ note, percent: entry.percent, updatedAt: entry.updatedAt });
    }

    tracked.sort((a, b) => b.updatedAt - a.updatedAt);
    setItems(tracked);
  }, [notes]);

  return (
    <section className={styles.panel}>
      <div className={styles.panelHead}>
        <h2 className={styles.panelTitle}>继续阅读</h2>
        {items.length > 0 && <span className={styles.panelHint}>按最近阅读</span>}
      </div>

      {items.length === 0 ? (
        <p className={styles.empty}>
          打开任意一篇笔记，
          <br />
          这里会记住你读到的位置。
        </p>
      ) : (
        <div className={styles.list}>
          {items.map(({ note, percent }) => (
            <Link key={note.slug} href={`/notes/${note.slug}`} className={styles.row}>
              <span className={styles.cover} style={coverStyle(note.category)} aria-hidden>
                {note.category.slice(0, 1)}
              </span>
              <span className={styles.rowText}>
                <span className={styles.rowTitle}>{note.title}</span>
                <span className={styles.progressTrack}>
                  <span className={styles.progressFill} style={{ width: `${percent}%` }} />
                </span>
              </span>
              <span className={styles.pct}>{percent}%</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
