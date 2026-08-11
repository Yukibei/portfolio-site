"use client";

import type { MouseEvent } from "react";
import { favoritesStore, queueStore, toggleBookmark, type BookmarkEntry } from "../storage/bookmarks";
import { useStoreMap } from "../storage/useStore";
import type { MapStore } from "../storage/localStore";
import { BookmarkIcon, HeartIcon } from "./icons";
import styles from "./controls.module.css";

export type BookmarkKind = "favorite" | "queue";

const STORES: Record<BookmarkKind, MapStore<BookmarkEntry>> = {
  favorite: favoritesStore,
  queue: queueStore,
};

const LABELS: Record<BookmarkKind, { on: string; off: string }> = {
  favorite: { on: "已收藏", off: "收藏" },
  queue: { on: "已加入稍后读", off: "稍后读" },
};

type BookmarkToggleProps = {
  slug: string;
  kind: BookmarkKind;
  /** 外部样式；不传则用 bare 图标形态 */
  className?: string;
  /** 显示文字标签，用于 hero 等大按钮 */
  showLabel?: boolean;
  iconSize?: number;
};

export default function BookmarkToggle({
  slug,
  kind,
  className,
  showLabel = false,
  iconSize = 14,
}: BookmarkToggleProps) {
  const store = STORES[kind];
  const entries = useStoreMap(store);
  const active = entries[slug] !== undefined;
  const label = active ? LABELS[kind].on : LABELS[kind].off;

  // 卡片整体是 stretched link，按钮必须自己吞掉冒泡，否则点收藏会触发跳转
  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    toggleBookmark(store, slug);
  };

  const Icon = kind === "favorite" ? HeartIcon : BookmarkIcon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`${styles.toggle} ${active ? styles.active : ""} ${className ?? ""}`}
    >
      <Icon size={iconSize} filled={active} />
      {showLabel && <span>{label}</span>}
    </button>
  );
}
