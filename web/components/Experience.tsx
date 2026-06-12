"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import Reveal, { SectionTitle } from "./Reveal";

const preloadLanyard = () => import("./Lanyard");
const Lanyard = dynamic(preloadLanyard, {
  ssr: false,
  loading: () => <BadgeFallback />,
});

// photos 为实习现场照片（public/experience/），当前为占位图，真实照片到位后同名替换
const EXPERIENCES = [
  {
    period: "2025.05 — 2025.08",
    company: "iFLYTEK 讯飞教育 BG",
    role: "AI 应用开发实习生 · 智学云 AI Agent 学习平台",
    points: [
      "RAG 课程文档问答链路：文档解析、切分与向量索引，支持多轮问答与原文引用定位",
      "长耗时生成任务异步化与队列限流，配合多模型路由、超时重试与熔断降级",
      "核心接口链路追踪与耗时埋点，支撑高并发场景的问题定位与容量评估",
    ],
    photos: [
      { src: "/experience/iflytek-1.png", cap: "讯飞工位" },
      { src: "/experience/iflytek-2.png", cap: "智学云团队" },
    ],
  },
  {
    period: "2025.09 — 2026.01",
    company: "交控科技 TCT",
    role: "软件工程师（外包项目制） · 城轨综合决策平台",
    points: [
      "独立编写系统需求说明书、技术规格书、接口文档及 10 个业务场景文档",
      "参与 Spring Cloud 微服务架构设计：服务拆分、实例库设计与并发容量规划",
      "Redis / Kafka / ClickHouse 选型与容量估算，支撑线网级实时数据接入",
    ],
    photos: [
      { src: "/experience/tct-1.png", cap: "交控项目室" },
      { src: "/experience/tct-2.png", cap: "联调现场" },
    ],
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  // 滚到实习经历区时工卡从顶部掉落；离开后卸载，下次进入重新掉落
  const inView = useInView(sectionRef, { amount: 0.25 });
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    const preload = () => {
      void preloadLanyard();
      ["/lanyard/card.glb", "/lanyard/front.png", "/lanyard/back.png"].forEach(
        (href) => {
          const link = document.createElement("link");
          link.rel = "prefetch";
          link.as = href.endsWith(".glb") ? "fetch" : "image";
          link.href = href;
          if (href.endsWith(".glb")) link.crossOrigin = "anonymous";
          document.head.appendChild(link);
        }
      );
    };
    const win = window as Window &
      typeof globalThis & {
        requestIdleCallback?: (
          callback: IdleRequestCallback,
          options?: IdleRequestOptions
        ) => number;
        cancelIdleCallback?: (handle: number) => void;
      };
    if (win.requestIdleCallback && win.cancelIdleCallback) {
      const id = win.requestIdleCallback(preload, { timeout: 2500 });
      return () => win.cancelIdleCallback?.(id);
    }
    const id = globalThis.setTimeout(preload, 1200);
    return () => globalThis.clearTimeout(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative scroll-mt-24 px-6 py-20 sm:px-10 lg:px-16 lg:py-28"
    >
      <SectionTitle index="03" en="Experience." zh="实习经历" />

      <div className="space-y-0 border-t border-white/10 lg:max-w-[62%]">
        {EXPERIENCES.map((exp, i) => {
          const open = openIdx === i;
          return (
            <Reveal key={exp.company} delay={i * 0.08}>
              <div
                role="button"
                tabIndex={0}
                aria-expanded={open}
                onClick={() => setOpenIdx(open ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenIdx(open ? null : i);
                  }
                }}
                className="group cursor-pointer border-b border-white/10 py-10 outline-none transition-colors hover:bg-white/[0.03] focus-visible:bg-white/[0.04]"
              >
                <div className="grid gap-4 lg:grid-cols-[220px_1fr] lg:gap-12">
                  <div className="font-inter text-sm tracking-widest text-white/40">
                    {exp.period}
                  </div>
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-inter text-xl font-bold text-white sm:text-2xl">
                        {exp.company}
                      </h3>
                      <span
                        className={`flex shrink-0 items-center gap-2 font-inter text-[10px] uppercase tracking-[0.25em] transition-colors ${
                          open
                            ? "text-white"
                            : "text-white/35 group-hover:text-white/70"
                        }`}
                      >
                        Photos · 现场
                        <Plus
                          className={`h-3.5 w-3.5 transition-transform duration-300 ${
                            open ? "rotate-45" : ""
                          }`}
                        />
                      </span>
                    </div>
                    <p className="mt-1 font-inter text-sm tracking-wider text-white/50">
                      {exp.role}
                    </p>
                    <ul className="mt-5 space-y-2.5">
                      {exp.points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-3 font-inter text-sm leading-relaxed text-white/70 sm:text-base"
                        >
                          <span className="mt-[0.6em] h-px w-4 shrink-0 bg-white/40" />
                          {point}
                        </li>
                      ))}
                    </ul>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          key="photos"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.45,
                            ease: [0.32, 0.72, 0, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="flex gap-3 overflow-x-auto pb-1 pt-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {exp.photos.map((photo, pi) => (
                              <motion.figure
                                key={photo.src}
                                initial={{ opacity: 0, y: 18 }}
                                animate={{
                                  opacity: 1,
                                  y: 0,
                                  transition: { delay: 0.12 + pi * 0.08 },
                                }}
                                className="relative shrink-0"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element -- 占位图阶段保持原生 img */}
                                <img
                                  src={photo.src}
                                  alt={photo.cap}
                                  className="h-[150px] w-[225px] rounded-xl border border-white/10 object-cover sm:h-[180px] sm:w-[270px]"
                                  loading="lazy"
                                  draggable={false}
                                />
                                <figcaption className="mt-2 font-inter text-[10px] tracking-[0.25em] text-white/40">
                                  {photo.cap}
                                </figcaption>
                              </motion.figure>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* 3D 工作证：滚入本区时从页面顶部（header 后方）垂落，可拖拽甩动；
          离开时整体向上抽回（exit 动画），不做生硬消失。
          fixed 定位让挂绳真正从视口顶端垂下；z-30 低于 navbar(z-40)。
          桌面端专属（移动端性能与空间不适合物理画布）。 */}
      <AnimatePresence>
        {inView && (
          <motion.div
            key="lanyard-badge"
            className="pointer-events-none fixed bottom-8 right-10 top-12 z-30 hidden w-[40vw] min-w-[430px] max-w-[620px] lg:block"
            initial={{ opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.3 } }}
            exit={{
              y: "-105%",
              transition: { duration: 0.65, ease: [0.55, 0, 0.85, 0.36] },
            }}
            aria-hidden="true"
          >
            <div className="pointer-events-auto h-full w-full">
              <Lanyard
                key="experience-lanyard-react-bits"
                position={[0, 0, 20]}
                gravity={[0, -40, 0]}
                fov={20}
                cardScale={2.95}
                frontImage="/lanyard/front.png"
                backImage="/lanyard/back.png"
                lanyardImage="/lanyard/band.png"
                lanyardWidth={1.05}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function BadgeFallback() {
  return (
    <div className="flex h-full w-full items-start justify-center pt-24">
      <Image
        src="/lanyard/front.png"
        alt=""
        width={280}
        height={422}
        priority={false}
        className="w-[280px] rounded-[22px] opacity-95 shadow-2xl"
      />
    </div>
  );
}
