import type Lenis from "lenis";

/**
 * Lenis 单例访问点：浮层（CaseStudyPanel 等）需要锁定背景滚动时，
 * 必须同时停掉 Lenis（仅设 body overflow 在 Lenis 下无效）。
 */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function lockScroll() {
  lenis?.stop();
  document.body.style.overflow = "hidden";
}

export function unlockScroll() {
  document.body.style.overflow = "";
  lenis?.start();
}
