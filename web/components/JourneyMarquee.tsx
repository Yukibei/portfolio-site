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
 * 照片清单：public/journey/，真实照片到位后同名替换并按需改下方数组。
 */
const JOURNEY = [
  { src: "/journey/01.png", year: "2022", zh: "入学", en: "ENROLLMENT" },
  { src: "/journey/02.png", year: "2022", zh: "起点工作室", en: "QIDIAN STUDIO" },
  { src: "/journey/03.png", year: "2023", zh: "第一个完整项目", en: "FIRST PROJECT" },
  { src: "/journey/04.png", year: "2023", zh: "深夜代码", en: "LATE NIGHT BUILD" },
  { src: "/journey/05.png", year: "2024", zh: "ICPC 区域赛", en: "ICPC REGIONAL" },
  { src: "/journey/06.png", year: "2024", zh: "国家级奖项", en: "NATIONAL AWARD" },
  { src: "/journey/07.png", year: "2025", zh: "讯飞实习", en: "IFLYTEK INTERN" },
  { src: "/journey/08.png", year: "2025", zh: "交控科技", en: "TCT PROJECT" },
  { src: "/journey/09.png", year: "2026", zh: "Hoop Pupil 上线", en: "SHIP IT" },
  { src: "/journey/10.png", year: "2026", zh: "下一站", en: "NEXT CHAPTER" },
];

const ROW1 = JOURNEY.slice(0, 5);
const ROW2 = JOURNEY.slice(5);

function MarqueeRow({
  items,
  direction,
}: {
  items: typeof JOURNEY;
  direction: 1 | -1;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const $viewport = viewportRef.current;
    const $track = trackRef.current;
    if (!$viewport || !$track) return;

    // speed 单位 px/s，按帧间隔补偿，掉帧/节流时流速恒定
    const state = { speed: 30 * direction, width: $track.scrollWidth / 2 };

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
      state.width = $track.scrollWidth / 2;
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

  return (
    <div
      ref={viewportRef}
      className="cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
    >
      <div ref={trackRef} className="flex w-max gap-3 will-change-transform">
        {[...items, ...items].map((it, i) => (
          <figure
            key={i}
            className="relative h-[180px] w-[280px] shrink-0 overflow-hidden rounded-2xl border border-white/10 sm:h-[218px] sm:w-[340px] lg:h-[270px] lg:w-[420px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- 流动带内大量小图，免 next/image 包装开销 */}
            <img
              src={it.src}
              alt={`${it.year} ${it.zh}`}
              className="h-full w-full object-cover"
              draggable={false}
              loading="lazy"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-baseline gap-2.5 bg-gradient-to-t from-black/75 to-transparent px-4 pb-2.5 pt-9">
              <span className="font-inter text-[10px] tracking-[0.25em] text-white/55">
                {it.year}
              </span>
              <span className="font-inter text-xs font-semibold tracking-wider text-white/90">
                {it.zh}
              </span>
              <span className="ml-auto font-inter text-[9px] uppercase tracking-[0.2em] text-white/35">
                {it.en}
              </span>
            </figcaption>
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
