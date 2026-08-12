"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import Reveal, { SectionTitle } from "./Reveal";

const Lanyard = dynamic(() => import("./Lanyard"), {
  ssr: false,
  loading: () => <BadgeFallback />,
});

// photos 为实习现场照片（public/experience/），当前为占位图，真实照片到位后同名替换
const EXPERIENCES = [
  {
    period: "2026.04 — 2026.06",
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
    period: "2026.06 — 2026.08",
    company: "东联智通",
    role: "AI Agent 全栈应用工程师 · AIPPT / Word / CAD",
    points: [
      "参与 AIPPT 商业化平台研发，打通账号、免费生成、在线预览、下载扣积分、作品及订单售后主链路",
      "设计若依任务创建、AI 引擎异步执行、回调与作品聚合链路，统一多类 AI 任务的幂等和失败状态",
      "开发 DocPilot Word 编辑 Agent 与 CAD 语义审查工作台，将模型规划与确定性执行链路结合",
    ],
    photos: [],
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  // 滚到实习经历区时工卡从顶部掉落
  const inView = useInView(sectionRef, { amount: 0.25 });
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // 工作证常驻挂载：首次进入挂载一次永不卸载（避免每次重建 WebGL+物理世界导致首帧卡顿）；
  // active 控制可见性与画布渲染开关，replay 每次重新进入自增以「重新触发掉落」而非重建。
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [replay, setReplay] = useState(0);
  const everEntered = useRef(false);
  const canRender3D = useRef(false);

  useEffect(() => {
    // 工作证仅桌面端渲染（CSS 隐藏移动端，这里再挡住挂载，避免移动端创建画布）
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches
    ) {
      canRender3D.current = true;
    }
  }, []);

  useEffect(() => {
    if (!canRender3D.current) return;
    if (inView) {
      if (everEntered.current) {
        setReplay((r) => r + 1); // 再次进入：仅重新触发掉落，画布物理不重建
      } else {
        everEntered.current = true;
        setMounted(true); // 首次进入：挂载一次，之后常驻
      }
      setActive(true);
    } else {
      setActive(false);
    }
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative scroll-mt-24 px-6 py-20 sm:px-10 lg:px-16 lg:py-28"
    >
      <SectionTitle index="01" en="Experience." zh="实习经历" />

      <div className="experience-list space-y-0 border-t border-white/10">
        {EXPERIENCES.map((exp, i) => {
          const hasPhotos = exp.photos.length > 0;
          const open = hasPhotos && openIdx === i;
          return (
            <Reveal key={exp.company} delay={i * 0.08}>
              <div
                role={hasPhotos ? "button" : undefined}
                tabIndex={hasPhotos ? 0 : undefined}
                aria-expanded={hasPhotos ? open : undefined}
                onClick={() => hasPhotos && setOpenIdx(open ? null : i)}
                onKeyDown={(e) => {
                  if (hasPhotos && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    setOpenIdx(open ? null : i);
                  }
                }}
                className={`group border-b border-white/10 py-10 outline-none ${
                  hasPhotos ? "cursor-pointer" : ""
                }`}
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
                      {hasPhotos ? (
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
                      ) : null}
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

      {/* 3D 工作证：首次滚入本区时挂载一次并从顶部垂落，可拖拽甩动；
          离开时画布暂停渲染并向上淡出抽回（CSS 过渡），不卸载、不重建；
          再次进入只重置刚体到顶部重新掉落（replay 自增），消除重建首帧卡顿。
          fixed 定位让挂绳真正从视口顶端垂下；z-50。桌面端专属。 */}
      {mounted && (
        <div
          className="experience-lanyard pointer-events-none fixed inset-0 z-50"
          data-active={active ? "true" : "false"}
          aria-hidden="true"
        >
          <div className="experience-lanyard-safe-zone" />
          <div className="experience-lanyard-frame pointer-events-auto h-full">
            <Lanyard
              key="experience-lanyard-react-bits"
              active={active}
              replay={replay}
              position={[0, 0, 20]}
              gravity={[0, -40, 0]}
              fov={20}
              sceneOffsetX={4.0}
              cardScale={2.95}
              frontImage="/lanyard/front.png"
              backImage="/lanyard/back.png"
              lanyardImage="/lanyard/band.png"
              lanyardWidth={0.72}
            />
          </div>
        </div>
      )}
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
