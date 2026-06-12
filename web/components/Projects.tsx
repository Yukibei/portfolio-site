"use client";

import { useRef } from "react";
import { ArrowUpRight, Clock } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { SectionTitle } from "./Reveal";

// href 为 null 表示部署入口预留：服务器购置后填入正式地址即可
// images 为项目截图（public/projects/），当前为占位图，真实截图/录屏帧到位后同名替换
const PROJECTS = [
  {
    no: "01",
    name: "Hoop Pupil",
    zh: "智瞳篮途",
    desc: "篮球持球人重识别（ReID）平台 — 从算法服务化到前后端交付的完整闭环，已上线运行。",
    metrics: "mAP 91.6% · Rank-1 94.4% · 12 个业务模块",
    stack: "Vue 3 · Spring Boot · FastAPI · PyTorch · MySQL · Redis",
    href: "https://admin.hooppupil.me",
    linkLabel: "Live Demo",
    images: {
      a: "/projects/hp-a.png",
      b: "/projects/hp-b.png",
      tall: "/projects/hp-tall.png",
    },
  },
  {
    no: "02",
    name: "ReflexLearn",
    zh: "反思学习",
    desc: "基于 LangGraph 的多智能体个性化学习系统 — 规划、生成、评价与反思记忆的闭环，SSE 流式输出。",
    metrics: "多智能体编排 · 向量召回 · 知识图谱",
    stack: "Python · LangGraph · LiteLLM · Qdrant · Neo4j · PostgreSQL",
    href: null,
    linkLabel: "Coming Soon",
    images: {
      a: "/projects/rl-a.png",
      b: "/projects/rl-b.png",
      tall: "/projects/rl-tall.png",
    },
  },
  {
    no: "03",
    name: "OpenClaw",
    zh: "AI 管家",
    desc: "跨 Web 与 App 的 AI 管家体系 — 一句话驱动页面操作与跨页流水线，按风险分级执行。",
    metrics: "Manifest 适配 · Pipeline Chain · 移动端受控自动化",
    stack: "TypeScript · uni-app · Agent Runner · 风险分级",
    href: null,
    linkLabel: "Coming Soon",
    images: {
      a: "/projects/oc-a.png",
      b: "/projects/oc-b.png",
      tall: "/projects/oc-tall.png",
    },
  },
];

type Project = (typeof PROJECTS)[number];

function StackCard({
  p,
  index,
  total,
  progress,
}: {
  p: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // 滚动越过本卡后逐渐缩小，被下一张盖住时形成层叠收纳感
  const targetScale = 1 - (total - 1 - index) * 0.05;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div className="sticky top-0 flex h-screen items-center justify-center">
      <motion.article
        style={{ scale, top: `calc(-4vh + ${index * 26}px)` }}
        className="relative flex max-h-[82vh] w-full max-w-5xl origin-top flex-col gap-5 overflow-hidden rounded-[28px] border border-white/15 bg-[#101010] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.6)] sm:gap-6 sm:rounded-[36px] sm:p-7 lg:rounded-[44px] lg:p-9"
      >
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-baseline gap-4 sm:gap-6">
            <span className="font-inter text-sm tracking-widest text-white/30">
              ({p.no})
            </span>
            <div>
              <h3 className="font-podium text-3xl uppercase tracking-tight text-white sm:text-4xl lg:text-5xl">
                {p.name}
              </h3>
              <span className="mt-1 block font-inter text-xs tracking-[0.35em] text-white/40">
                {p.zh}
              </span>
            </div>
          </div>

          {p.href ? (
            <a
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 font-inter text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black sm:px-6 sm:py-3"
            >
              {p.linkLabel}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          ) : (
            <span className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 font-inter text-[11px] uppercase tracking-widest text-white/40 sm:px-6 sm:py-3">
              <Clock className="h-3.5 w-3.5" />
              {p.linkLabel}
            </span>
          )}
        </header>

        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
          <p className="max-w-xl font-inter text-sm leading-relaxed text-white/70 sm:text-base">
            {p.desc}
          </p>
          <div className="font-inter text-xs leading-relaxed tracking-wider text-white/40">
            <div className="text-white/65">{p.metrics}</div>
            <div className="mt-1">{p.stack}</div>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-[2fr_3fr]">
          <div className="grid grid-rows-2 gap-3">
            {/* eslint-disable @next/next/no-img-element -- 卡内多图，占位图阶段保持原生 img */}
            <img
              src={p.images.a}
              alt={`${p.name} 截图 1`}
              className="h-full min-h-0 w-full rounded-2xl border border-white/10 object-cover sm:rounded-3xl"
              loading="lazy"
            />
            <img
              src={p.images.b}
              alt={`${p.name} 截图 2`}
              className="h-full min-h-0 w-full rounded-2xl border border-white/10 object-cover sm:rounded-3xl"
              loading="lazy"
            />
          </div>
          <img
            src={p.images.tall}
            alt={`${p.name} 主视图`}
            className="hidden h-full min-h-0 w-full rounded-2xl border border-white/10 object-cover sm:block sm:rounded-3xl"
            loading="lazy"
          />
          {/* eslint-enable @next/next/no-img-element */}
        </div>
      </motion.article>
    </div>
  );
}

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="projects"
      className="scroll-mt-24 px-6 pt-20 sm:px-10 lg:px-16 lg:pt-28"
    >
      <SectionTitle index="02" en="Selected Works." zh="精选项目" />

      <div ref={containerRef} className="relative -mt-6">
        {PROJECTS.map((p, i) => (
          <StackCard
            key={p.name}
            p={p}
            index={i}
            total={PROJECTS.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}
