"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import Reveal, { SectionTitle } from "./Reveal";

// three.js 体积大且依赖浏览器 API，懒加载 + 关 SSR
const Lanyard = dynamic(() => import("./Lanyard"), { ssr: false });

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
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  // 滚到实习经历区时工卡从顶部掉落；离开后卸载，下次进入重新掉落
  const inView = useInView(sectionRef, { amount: 0.25 });

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative scroll-mt-24 px-6 py-20 sm:px-10 lg:px-16 lg:py-28"
    >
      <SectionTitle index="03" en="Experience." zh="实习经历" />

      <div className="space-y-0 border-t border-white/10 lg:max-w-[62%]">
        {EXPERIENCES.map((exp, i) => (
          <Reveal key={exp.company} delay={i * 0.08}>
            <div className="grid gap-4 border-b border-white/10 py-10 lg:grid-cols-[220px_1fr] lg:gap-12">
              <div className="font-inter text-sm tracking-widest text-white/40">
                {exp.period}
              </div>
              <div>
                <h3 className="font-inter text-xl font-bold text-white sm:text-2xl">
                  {exp.company}
                </h3>
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
              </div>
            </div>
          </Reveal>
        ))}
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
