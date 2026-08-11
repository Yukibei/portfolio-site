"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "./scrollControl";

/**
 * 全站滚动基建（landonorris.com 同款架构）：
 * Lenis 提供惯性平滑滚动，GSAP ScrollTrigger 以它为时钟源——
 * 之后所有 scrub 滚动叙事（横向时光轴 / sticky-hero）都建立在这条管线上。
 *
 * - prefers-reduced-motion: 不启用 Lenis，页面回到原生滚动
 * - 锚点链接接管: a[href^="#"] 走 lenis.scrollTo 平滑滚动（offset 对齐 scroll-mt-24）
 * - 浮层滚动锁: 通过 scrollControl 的 lockScroll/unlockScroll 协同（lenis.stop/start）
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    setLenis(lenis);
    // 暴露实例：便于浮层滚动锁外的调试与自动化测试可靠驱动滚动管线
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // 站内锚点平滑滚动（-96px 对齐各 section 的 scroll-mt-24）
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest?.('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href");
      if (!hash || hash === "#" || hash.startsWith("#case-")) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -96 });
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
