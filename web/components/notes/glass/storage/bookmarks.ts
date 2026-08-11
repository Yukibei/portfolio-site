import { createMapStore, type MapStore } from "./localStore";

export type BookmarkEntry = {
  addedAt: number;
};

function isBookmarkEntry(value: unknown): value is BookmarkEntry {
  if (typeof value !== "object" || value === null) return false;
  return typeof (value as Record<string, unknown>).addedAt === "number";
}

/** 收藏：长期喜欢，手动管理 */
export const favoritesStore = createMapStore<BookmarkEntry>("notes:favorites", isBookmarkEntry);

/** 稍后读：待消费队列，读完后从队列移出 */
export const queueStore = createMapStore<BookmarkEntry>("notes:queue", isBookmarkEntry);

export function toggleBookmark(store: MapStore<BookmarkEntry>, slug: string): void {
  if (store.read()[slug]) {
    store.remove(slug);
    return;
  }
  store.set(slug, { addedAt: Date.now() });
}

/** 按加入时间倒序的 slug 列表 */
export function orderedSlugs(entries: Readonly<Record<string, BookmarkEntry>>): string[] {
  return Object.entries(entries)
    .sort(([, a], [, b]) => b.addedAt - a.addedAt)
    .map(([slug]) => slug);
}
