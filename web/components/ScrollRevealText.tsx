"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

export type RevealSegment = {
  text: string;
  className?: string;
};

function Char({
  ch,
  cls,
  progress,
  range,
}: {
  ch: string;
  cls?: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className={`relative inline-block ${cls ?? ""}`}>
      {/* 占位字符固定排版，动画层叠加点亮 */}
      <span aria-hidden="true" className="opacity-15">
        {ch}
      </span>
      <motion.span style={{ opacity }} className="absolute inset-0">
        {ch}
      </motion.span>
    </span>
  );
}

/**
 * 滚动逐字点亮文本：随页面滚动，字符从 15% 透明度逐个点亮到全亮。
 * segments 支持分段样式（加粗/变色 span），'\n' 渲染为换行。
 */
export default function ScrollRevealText({
  segments,
  className,
}: {
  segments: RevealSegment[];
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.4"],
  });

  const chars: { ch: string; cls?: string }[] = [];
  for (const seg of segments) {
    for (const ch of Array.from(seg.text)) {
      chars.push({ ch, cls: seg.className });
    }
  }
  const total = chars.length;

  return (
    <p ref={ref} className={className}>
      {chars.map((c, i) => {
        if (c.ch === "\n") return <br key={i} />;
        // 每字符点亮窗口向后重叠数个字符，亮起更柔和
        const start = i / total;
        const end = Math.min((i + 8) / total, 1);
        return (
          <Char
            key={i}
            ch={c.ch === " " ? " " : c.ch}
            cls={c.cls}
            progress={scrollYProgress}
            range={[start, end]}
          />
        );
      })}
    </p>
  );
}
