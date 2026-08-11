"use client";

import { useSyncExternalStore } from "react";
import type { MapStore } from "./localStore";

/**
 * 订阅本地状态。服务端与首帧返回 store 的稳定空快照，
 * 客户端挂载后 useSyncExternalStore 自动补上真实数据，不会 hydration 不匹配。
 */
export function useStoreMap<T>(store: MapStore<T>): Readonly<Record<string, T>> {
  return useSyncExternalStore(store.subscribe, store.read, store.readServer);
}
