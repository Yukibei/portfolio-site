/**
 * 玻璃系统的本地状态统一走这里：阅读进度、收藏、稍后读都是 Record<slug, T> 形态。
 *
 * 快照必须缓存 —— useSyncExternalStore 要求 getSnapshot 返回稳定引用，
 * 每次 JSON.parse 出新对象会导致无限重渲染。写入和跨标签页变更时才让缓存失效。
 */

const CHANGE_EVENT = "notes:store-change";

export type MapStore<T> = {
  read: () => Readonly<Record<string, T>>;
  /** 服务端与 hydration 首帧专用：恒为空，保证两端渲染结果一致 */
  readServer: () => Readonly<Record<string, T>>;
  set: (key: string, value: T) => void;
  remove: (key: string) => void;
  clear: () => void;
  subscribe: (listener: () => void) => () => void;
};

export function createMapStore<T>(
  storageKey: string,
  isValid: (value: unknown) => value is T,
): MapStore<T> {
  /** 稳定的空快照：SSR 和读取失败都返回它，避免每次产生新对象 */
  const EMPTY = Object.freeze({}) as Readonly<Record<string, T>>;

  let cache: Readonly<Record<string, T>> | null = null;

  function parse(): Readonly<Record<string, T>> {
    if (typeof window === "undefined") return EMPTY;

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return EMPTY;

      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed !== "object" || parsed === null) return EMPTY;

      const result: Record<string, T> = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (isValid(value)) result[key] = value;
      }
      return result;
    } catch {
      return EMPTY;
    }
  }

  function persist(next: Record<string, T>): void {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // 隐私模式或配额耗尽：本地状态属于增强功能，静默降级。
      // 不写内存快照，localStorage 始终是唯一真相源，避免 UI 显示出实际没存下的状态。
    }

    cache = null;
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: storageKey }));
  }

  function read(): Readonly<Record<string, T>> {
    cache ??= parse();
    return cache;
  }

  return {
    read,
    readServer: () => EMPTY,
    set(key, value) {
      if (typeof window === "undefined") return;
      persist({ ...read(), [key]: value });
    },

    remove(key) {
      if (typeof window === "undefined") return;
      const next = { ...read() };
      delete next[key];
      persist(next);
    },

    clear() {
      if (typeof window === "undefined") return;
      persist({});
    },

    subscribe(listener) {
      if (typeof window === "undefined") return () => {};

      const invalidate = (event: Event) => {
        if (event instanceof CustomEvent && event.detail !== storageKey) return;
        if (event instanceof StorageEvent && event.key !== storageKey) return;
        cache = null;
        listener();
      };

      window.addEventListener(CHANGE_EVENT, invalidate);
      window.addEventListener("storage", invalidate);

      return () => {
        window.removeEventListener(CHANGE_EVENT, invalidate);
        window.removeEventListener("storage", invalidate);
      };
    },
  };
}
