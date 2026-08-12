import { createMapStore } from "./localStore";
import { queueStore } from "./bookmarks";

export type ProgressEntry = {
  percent: number;
  updatedAt: number;
};

/** 低于该比例视为刚打开，高于该比例视为已读完，都不进入「继续阅读」 */
export const MIN_TRACKED_PERCENT = 3;
export const DONE_PERCENT = 97;

function isProgressEntry(value: unknown): value is ProgressEntry {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Record<string, unknown>;
  return typeof entry.percent === "number" && typeof entry.updatedAt === "number";
}

export const progressStore = createMapStore<ProgressEntry>(
  "notes:reading-progress",
  isProgressEntry,
);

export function writeProgress(slug: string, percent: number): void {
  const clamped = Math.min(100, Math.max(0, Math.round(percent)));
  progressStore.set(slug, { percent: clamped, updatedAt: Date.now() });
  if (clamped > DONE_PERCENT) queueStore.remove(slug);
}

export function isInProgress(entry: ProgressEntry | undefined): entry is ProgressEntry {
  if (!entry) return false;
  return entry.percent >= MIN_TRACKED_PERCENT && entry.percent <= DONE_PERCENT;
}

export function isFinished(entry: ProgressEntry | undefined): boolean {
  return entry !== undefined && entry.percent > DONE_PERCENT;
}
