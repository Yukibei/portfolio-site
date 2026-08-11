"use client";

import { useEffect, useRef } from "react";
import Reveal, { SectionTitle } from "../Reveal";
import { AI_PRACTICES, type AiPractice } from "../evidence/aiPractices";

/**
 * 项目展示：真实录屏是主角，文字只做面试式解释。
 * 视频进入视口才播放，避免三个项目同时解码造成滚动卡顿。
 */

/** ReID 检测框四角标：hover 时浮现，题材原生的视觉语言 */
function CornerMarks() {
  const base = "absolute h-5 w-5 border-emerald-400 opacity-0 transition-all duration-300 group-hover:opacity-100";
  return (
    <>
      <span className={`${base} left-3 top-3 border-l-2 border-t-2 group-hover:left-2 group-hover:top-2`} />
      <span className={`${base} right-3 top-3 border-r-2 border-t-2 group-hover:right-2 group-hover:top-2`} />
      <span className={`${base} bottom-3 left-3 border-b-2 border-l-2 group-hover:bottom-2 group-hover:left-2`} />
      <span className={`${base} bottom-3 right-3 border-b-2 border-r-2 group-hover:bottom-2 group-hover:right-2`} />
    </>
  );
}

function DemoFrame({ video, title }: { video: AiPractice["video"]; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void node.play().catch(() => undefined);
        } else {
          node.pause();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-[28px] border border-white/12 bg-[#0c0c0c] shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:rounded-[32px]">
      <CornerMarks />
      <video
        ref={videoRef}
        src={video.src}
        poster={video.poster}
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full bg-black object-contain"
        aria-label={title}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-gradient-to-t from-black/75 to-transparent px-5 pb-4 pt-12">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
          {video.caption}
        </span>
        <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.75)]" />
      </div>
    </div>
  );
}

function PracticeRow({ p, index }: { p: AiPractice; index: number }) {
  const flip = index % 2 === 1;
  return (
    <Reveal>
      <div
        className={`grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12 ${
          flip ? "" : ""
        }`}
      >
        <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
          <DemoFrame video={p.video} title={p.title} />
        </div>

        <div className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
          {/* 贴纸标签：橙底黑字，微旋转（GSAP 语言） */}
          <span
            className={`inline-block rounded-lg bg-emerald-400 px-3.5 py-1.5 font-inter text-[11px] font-bold uppercase tracking-wider text-black shadow-[0_4px_16px_rgba(52,211,153,0.25)] ${
              flip ? "rotate-[1.5deg]" : "rotate-[-1.5deg]"
            }`}
          >
            {p.sticker}
          </span>

          <h3 className="mt-5 font-inter text-2xl font-semibold leading-snug text-white sm:text-3xl">
            {p.title}
          </h3>
          <p className="mt-4 max-w-xl font-inter text-sm leading-relaxed text-white/60 sm:text-[15px]">
            {p.desc}
          </p>
          <div className="mt-5 font-mono text-[11px] uppercase tracking-wider text-white/35">
            {p.stat}
          </div>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-wider text-white/25">
            {p.stack}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function AiActionSection() {
  return (
    <section
      id="ai-action"
      className="scroll-mt-24 px-6 pt-24 sm:px-10 lg:px-16 lg:pt-32"
    >
      <SectionTitle index="03" en="Projects in Motion." zh="项目展示" />
      <Reveal>
        <p className="-mt-6 mb-16 max-w-2xl font-inter text-sm leading-relaxed text-white/50 lg:-mt-10">
          这里不再放占位框。三段录屏分别对应精选项目里的真实系统：
          ReID 平台、移动端 AI 管家、多智能体学习闭环。看的是产品怎么跑起来，而不是静态截图。
        </p>
      </Reveal>

      <div className="space-y-20 lg:space-y-28">
        {AI_PRACTICES.map((p, i) => (
          <PracticeRow key={p.id} p={p} index={i} />
        ))}
      </div>
    </section>
  );
}
