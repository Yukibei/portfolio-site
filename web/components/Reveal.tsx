"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** 滚动进入视口时统一的上浮入场动画 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/** 统一的 section 标题：PODIUM 英文大字 + 中文小标 */
export function SectionTitle({
  en,
  zh,
  index,
}: {
  en: string;
  zh: string;
  index: string;
}) {
  return (
    <Reveal>
      <div className="mb-12 flex flex-wrap items-baseline gap-x-5 gap-y-2 lg:mb-16">
        <span className="font-inter text-xs tracking-widest text-white/30">
          ({index})
        </span>
        <h2 className="font-podium text-[clamp(2.4rem,6vw,4.8rem)] uppercase leading-none tracking-tight text-white">
          {en}
        </h2>
        <span className="font-inter text-sm tracking-[0.4em] text-white/40">
          {zh}
        </span>
      </div>
    </Reveal>
  );
}
