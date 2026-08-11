export type ProgressEntry = {
  percent: number;
  updatedAt: number;
};

export type ProgressMap = Record<string, ProgressEntry>;

const STORAGE_KEY = "notes:reading-progress";

/** 低于该比例视为刚打开，高于该比例视为已读完，都不进入「继续阅读」 */
export const MIN_TRACKED_PERCENT = 3;
export const DONE_PERCENT = 97;

function isEntry(value: unknown): value is ProgressEntry {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Record<string, unknown>;
  return typeof entry.percent === "number" && typeof entry.updatedAt === "number";
}

export function readProgressMap(): ProgressMap {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};

    const result: ProgressMap = {};
    for (const [slug, entry] of Object.entries(parsed)) {
      if (isEntry(entry)) result[slug] = entry;
    }
    return result;
  } catch {
    return {};
  }
}

export function writeProgress(slug: string, percent: number): void {
  if (typeof window === "undefined") return;

  const clamped = Math.min(100, Math.max(0, Math.round(percent)));
  const next: ProgressMap = { ...readProgressMap(), [slug]: { percent: clamped, updatedAt: Date.now() } };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 隐私模式或配额耗尽：阅读进度属于增强功能，静默降级
  }
}

export function clearProgress(slug: string): void {
  if (typeof window === "undefined") return;

  const map = readProgressMap();
  delete map[slug];

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // 同上
  }
}
