"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { lockScroll, unlockScroll } from "./scrollControl";

/**
 * 进站加载层：只承担资源缓冲和首屏过渡，不阻断用户进入网站。
 * 资源就绪 + 最短展示时间后自动退出；若 load 迟迟不到，用最大等待兜底。
 */
export default function LoadingGate() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const raf = useRef(0);
  const hasUnlocked = useRef(false);

  useEffect(() => {
    const minDuration = 1100;
    const maxDuration = 2800;

    lockScroll();
    const start = performance.now();
    let loaded = document.readyState === "complete";
    const onLoad = () => (loaded = true);
    const finish = () => {
      hasUnlocked.current = true;
      setOpen(true);
      unlockScroll();
    };

    window.addEventListener("load", onLoad);

    const tick = () => {
      const elapsed = performance.now() - start;
      const isLoaded = loaded || document.readyState === "complete";
      const done = (isLoaded && elapsed >= minDuration) || elapsed >= maxDuration;

      if (done) {
        window.setTimeout(finish, 160);
        return;
      }

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("load", onLoad);
      if (!hasUnlocked.current) unlockScroll();
    };
  }, []);

  return (
    <AnimatePresence>
      {!open && (
        <motion.div
          data-loading-gate
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#070707]"
          initial={false}
          exit={reduce ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: reduce ? 0.3 : 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="px-8 text-center">
            <span className="font-inter text-[10px] uppercase tracking-[0.5em] text-white/40">
              Portfolio
            </span>
            <h1 className="mt-4 font-podium text-5xl uppercase leading-none tracking-tight text-white sm:text-7xl">
              Yiling Li
            </h1>
            <p className="mt-3 font-inter text-xs tracking-[0.3em] text-white/45">
              李怡霖 · AI 应用与全栈开发
            </p>
          </div>

          <div className="mt-12 w-[min(86vw,600px)]">
            <div className="dino-loader" aria-label="Loading portfolio">
              <div className="dino-runner" />
              <div className="dino-obstacle" />
              <div className="dino-ground" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
