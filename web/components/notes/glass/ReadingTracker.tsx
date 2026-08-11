"use client";

import { useEffect } from "react";
import { writeProgress } from "./readingProgress";

type ReadingTrackerProps = {
  slug: string;
};

/** 挂在文章页，把整页滚动位置持续写入 localStorage，供「继续阅读」读取 */
export default function ReadingTracker({ slug }: ReadingTrackerProps) {
  useEffect(() => {
    let ticking = false;
    let lastWrite = 0;

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

    flush(true);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      flush(true);
    };
  }, [slug]);

  return null;
}
