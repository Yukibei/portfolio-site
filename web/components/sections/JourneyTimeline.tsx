"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Journey 横向时光轴（landonorris.com on-track 同款效果，本站架构实现）：
 * 纵向滚动距离换算成轨道横向位移——"一屏纵向 = 多屏横向"，滚完自然释放。
 *
 * 实现选型：用 framer-motion useScroll + 原生 sticky（与 Projects 区同款），
 * 而非 GSAP ScrollTrigger.pin —— 后者的 pin-spacer 测量与本站"sticky 盖层 hero"
 * 滑动上下文冲突，会导致 pin 不生效被整段跳过。Lenis 平滑滚动在外层全局生效。
 */

type Photo = { src: string; alt: string; size: "lg" | "md" | "sm"; align: "start" | "center" | "end" };
type Chapter = { key: string; zh: string; line: string; photos: Photo[] };

const CHAPTERS: Chapter[] = [
  {
    key: "START",
    zh: "起点",
    line: "从工作室的第一行 C++ 开始",
    photos: [
      { src: "/journey/j01-new-start.jpg", alt: "新的起点", size: "lg", align: "center" },
      { src: "/journey/j02-qidian-studio.jpg", alt: "起点工作室", size: "sm", align: "start" },
      { src: "/journey/j14-first-tetris.jpg", alt: "第一个完整项目 · C++ 俄罗斯方块", size: "md", align: "end" },
      { src: "/journey/j04-workbench.jpg", alt: "深夜的工作台", size: "sm", align: "center" },
    ],
  },
  {
    key: "COMPETE",
    zh: "竞赛",
    line: "ICPC 两届 · 程序设计大赛国一",
    photos: [
      { src: "/journey/j05-icpc-16.jpg", alt: "第 16 届 ICPC 赛场", size: "md", align: "start" },
      { src: "/journey/j06-icpc-17.jpg", alt: "第 17 届 ICPC", size: "lg", align: "center" },
      { src: "/journey/j09-bronze.jpg", alt: "解题数达铜奖线", size: "sm", align: "end" },
      { src: "/journey/j08-national-first.jpg", alt: "程序设计大赛 · 国家级一等奖", size: "md", align: "start" },
      { src: "/journey/j07-ict-cert.jpg", alt: "华为 ICT 大赛", size: "sm", align: "center" },
    ],
  },
  {
    key: "BUILD",
    zh: "工程",
    line: "从草图画到联调现场",
    photos: [
      { src: "/journey/j03-project-sketch.jpg", alt: "项目草图", size: "sm", align: "end" },
      { src: "/journey/j13-lab.jpg", alt: "机房", size: "md", align: "center" },
      { src: "/journey/j11-team-photo.jpg", alt: "团队合照", size: "lg", align: "start" },
      { src: "/journey/j15-tct-bench.jpg", alt: "交控项目实验台", size: "sm", align: "center" },
      { src: "/journey/j16-tct-building.jpg", alt: "交控项目现场", size: "md", align: "end" },
      { src: "/journey/j17-tct-device-desk.jpg", alt: "设备联调桌面", size: "sm", align: "start" },
    ],
  },
  {
    key: "SHIP",
    zh: "交付",
    line: "讯飞智学云 · 真实生产环境",
    photos: [
      { src: "/journey/j18-zhixueyun-team.jpg", alt: "智学云团队会议", size: "md", align: "start" },
      { src: "/journey/j19-iflytek-desk.jpg", alt: "讯飞工位", size: "lg", align: "center" },
      { src: "/journey/j20-iflytek-open-office.jpg", alt: "讯飞开放办公区", size: "md", align: "end" },
      { src: "/journey/j12-team-dinner.jpg", alt: "团队聚餐", size: "sm", align: "start" },
      { src: "/journey/j10-iflytek.jpg", alt: "讯飞实习", size: "md", align: "center" },
    ],
  },
];

const SIZE_CLS: Record<Photo["size"], string> = {
  lg: "h-[44vh] sm:h-[52vh]",
  md: "h-[32vh] sm:h-[38vh]",
  sm: "h-[23vh] sm:h-[27vh]",
};
const ALIGN_CLS: Record<Photo["align"], string> = {
  start: "self-start mt-[6vh]",
  center: "self-center",
  end: "self-end mb-[5vh]",
};

export default function JourneyTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxX, setMaxX] = useState(0);

  // 测量轨道超出视口的横向距离（图片懒加载后会变，故监听 load + resize）
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setMaxX(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    const imgs = Array.from(track.querySelectorAll("img"));
    imgs.forEach((img) => img.addEventListener("load", measure));
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      imgs.forEach((img) => img.removeEventListener("load", measure));
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  // 纵向进度 → 轨道横向位移；尾段 0.92→1 不再横移，留一点"到底"缓冲
  const x = useTransform(scrollYProgress, [0, 0.92], [0, -maxX]);

  return (
    // 高度 = 视口 + 横向距离，保证横向走完时纵向 pin 刚好结束
    <section
      ref={sectionRef}
      aria-label="个人历程时间轴"
      style={{ height: `calc(100vh + ${maxX}px)` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mb-6 flex items-baseline justify-between px-6 sm:px-10 lg:px-16">
          <div className="flex items-baseline gap-4">
            <span className="font-podium text-xl uppercase tracking-tight text-white/90 sm:text-2xl">
              Journey
            </span>
            <span className="font-inter text-xs tracking-[0.4em] text-white/40">
              一路走来
            </span>
          </div>
          <span className="font-inter text-[10px] uppercase tracking-[0.3em] text-white/30">
            Scroll · 滚动推进
          </span>
        </div>

        <motion.div ref={trackRef} style={{ x }} className="flex w-max items-stretch">
          {CHAPTERS.map((ch, ci) => (
            <div key={ch.key} className="relative flex h-[72vh] items-stretch gap-5 pr-[8vw] sm:gap-7">
              {/* 章节背景超大字（衬底层） */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-[3vw] top-1/2 z-0 -translate-y-1/2 select-none whitespace-nowrap font-podium text-[24vh] uppercase leading-none text-white/[0.05]"
              >
                {ch.key}
              </span>

              {/* 章节头卡 */}
              <div className="z-10 flex w-[58vw] shrink-0 flex-col justify-center pl-[6vw] sm:w-[24vw]">
                <span className="font-inter text-[10px] uppercase tracking-[0.35em] text-emerald-400/90">
                  {String(ci + 1).padStart(2, "0")} · {ch.key}
                </span>
                <span className="mt-2 font-podium text-4xl uppercase tracking-tight text-white sm:text-5xl">
                  {ch.zh}
                </span>
                <span className="mt-3 max-w-[24ch] font-inter text-xs leading-relaxed text-white/50">
                  {ch.line}
                </span>
              </div>

              {/* 照片组：大小错落 */}
              {ch.photos.map((p) => (
                <figure key={p.src} className={`z-10 shrink-0 ${ALIGN_CLS[p.align]}`}>
                  <div className={`overflow-hidden rounded-2xl border border-white/10 ${SIZE_CLS[p.size]}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- 轨道内多图，免 next/image 包装 */}
                    <img
                      src={p.src}
                      alt={p.alt}
                      className="h-full w-auto object-cover"
                      draggable={false}
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="mt-2.5 font-inter text-[11px] tracking-wide text-white/45">
                    {p.alt}
                  </figcaption>
                </figure>
              ))}
            </div>
          ))}

          {/* 收束卡：把时间轴交回纵向叙事 */}
          <div className="z-10 flex w-[80vw] shrink-0 flex-col justify-center pr-[8vw] sm:w-[44vw]">
            <span className="font-podium text-5xl uppercase leading-none tracking-tight text-white sm:text-6xl">
              Now.
            </span>
            <span className="mt-4 max-w-[26ch] font-inter text-sm leading-relaxed text-white/55">
              现在——把 AI 能力做成可上线的产品。继续往下。
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
