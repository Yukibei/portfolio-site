"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  createAnimatable,
  createDraggable,
  createTimer,
  utils,
} from "animejs";

/**
 * 个人历程照片带 — 双行无限流动
 * 行为：缓速自动流动（两行反向）+ 页面滚动联动加速 + 鼠标/手指可抓住拖拽甩动。
 * 等高混排：行高固定，每张照片按原始比例完整显示（横图宽、竖图窄），不裁切。
 * 照片在 public/journey/，行内按时间线排序；增删照片改下方数组即可。
 */
const ROW1 = [
  { src: "/journey/j01-new-start.jpg", alt: "新的起点" },
  { src: "/journey/j03-project-sketch.jpg", alt: "项目草图" },
  { src: "/journey/j05-icpc-16.jpg", alt: "第 16 届 ICPC" },
  { src: "/journey/j06-icpc-17.jpg", alt: "第 17 届 ICPC" },
];

const ROW2 = [
  { src: "/journey/j02-qidian-studio.jpg", alt: "起点工作室" },
  { src: "/journey/j04-workbench.jpg", alt: "工作台" },
  { src: "/journey/j07-ict-cert.jpg", alt: "ICT 证书" },
  { src: "/journey/j08-national-first.jpg", alt: "程序设计大赛国一" },
  { src: "/journey/j09-bronze.jpg", alt: "ICPC 铜奖" },
  { src: "/journey/j10-iflytek.jpg", alt: "讯飞实习" },
];

// 渲染份数：保证 track 总宽 ≥ 视口 + 单份宽，超宽屏循环也无缝
const COPIES = 3;

function MarqueeRow({
  items,
  direction,
}: {
  items: { src: string; alt: string }[];
  direction: 1 | -1;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const $viewport = viewportRef.current;
    const $track = trackRef.current;
    if (!$viewport || !$track) return;

    // speed 单位 px/s，按帧间隔补偿，掉帧/节流时流速恒定
    const state = { speed: 30 * direction, width: $track.scrollWidth / COPIES };

    const animatable = createAnimatable($track, {
      x: 0,
      modifier: (v: number) => utils.wrap(v, -state.width, 0),
    });
    const x = animatable.x as unknown as (v?: number) => number;

    const draggable = createDraggable(state, {
      trigger: $viewport,
      y: false,
      onGrab: () => animate(state, { speed: 0, duration: 350 }),
      onRelease: () =>
        animate(state, { speed: 30 * direction, duration: 700 }),
      releaseStiffness: 26,
      velocityMultiplier: 1.3,
    });

    // 页面滚动联动：滚动增量直接推进照片带（两行因 direction 反向）
    let lastY = window.scrollY;
    const onScroll = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      x(x() - dy * 0.55 * direction);
    };
    const onResize = () => {
      state.width = $track.scrollWidth / COPIES;
    };

    const timer = createTimer({
      onUpdate: (self) => {
        const dt = Math.min(self.deltaTime, 100) / 1000;
        x(x() - state.speed * dt + draggable.deltaX);
      },
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      timer.revert();
      draggable.revert();
      animatable.revert();
    };
  }, [direction]);

  const copies = Array.from({ length: COPIES }, () => items).flat();

  return (
    <div
      ref={viewportRef}
      className="cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
    >
      <div ref={trackRef} className="flex w-max gap-3 will-change-transform">
        {copies.map((it, i) => (
          <figure
            key={i}
            className="h-[180px] shrink-0 overflow-hidden rounded-2xl border border-white/10 sm:h-[218px] lg:h-[270px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- 流动带内大量小图，免 next/image 包装开销 */}
            <img
              src={it.src}
              alt={it.alt}
              className="h-full w-auto object-cover"
              draggable={false}
              loading="lazy"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}

export default function JourneyMarquee() {
  return (
    <section
      aria-label="个人历程照片"
      className="overflow-hidden pb-6 pt-16 sm:pt-20 lg:pb-10 lg:pt-24"
    >
      <div className="mb-8 flex items-baseline justify-between px-6 sm:px-10 lg:mb-10 lg:px-16">
        <div className="flex items-baseline gap-4">
          <span className="font-podium text-xl uppercase tracking-tight text-white/90 sm:text-2xl">
            Journey
          </span>
          <span className="font-inter text-xs tracking-[0.4em] text-white/40">
            一路走来
          </span>
        </div>
        <span className="font-inter text-[10px] uppercase tracking-[0.3em] text-white/30">
          Drag · 拖拽
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <MarqueeRow items={ROW1} direction={1} />
        <MarqueeRow items={ROW2} direction={-1} />
      </div>
    </section>
  );
}
