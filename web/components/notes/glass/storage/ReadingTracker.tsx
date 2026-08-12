"use client";

import { useEffect } from "react";
import {
  isInProgress,
  progressStore,
  writeProgress,
} from "./readingProgress";

type ReadingTrackerProps = {
  slug: string;
  resume?: boolean;
};

/** 挂在文章页，把整页滚动位置持续写入 localStorage，供「继续阅读」读取 */
export default function ReadingTracker({ slug, resume = false }: ReadingTrackerProps) {
  useEffect(() => {
    let ticking = false;
    let lastWrite = 0;
    let restoreFrame = 0;

    const computePercent = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 8) return 100;
      return (window.scrollY / scrollable) * 100;
    };

    const flush = (force: boolean) => {
      const now = Date.now();
      if (!force && now - lastWrite < 500) return;
      lastWrite = now;
      writeProgress(slug, computePercent());
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        flush(false);
      });
    };

    const saved = resume ? progressStore.read()[slug] : undefined;
    if (isInProgress(saved)) {
      restoreFrame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, scrollable * (saved.percent / 100));
      });
    } else {
      flush(true);
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(restoreFrame);
      window.removeEventListener("scroll", onScroll);
      flush(true);
    };
  }, [resume, slug]);

  return null;
}
