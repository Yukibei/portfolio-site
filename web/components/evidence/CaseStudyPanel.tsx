"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, X } from "lucide-react";
import { lockScroll, unlockScroll } from "../common/scrollControl";
import type { CaseStudy, EvidenceAsset } from "./caseStudies";
import { DEBUG_CASES } from "./debugCases";
import DebugStoryFold from "./DebugStoryFold";
import TracePlayer from "./TracePlayer";
import { TRACES } from "./traces";

/** 项目 → Debug 复盘的关联（在工程浮层内折叠呈现，首页不独立陈列） */
const DEBUG_BY_CASE: Record<string, string> = {
  "hoop-pupil": "court-homography",
  openclaw: "agent-task-memory",
};

/**
 * 案例研究的工程细节浮层（Engineer 层）。
 * 卡片正面给 HR 的 30 秒浏览，这里给面试官的 5 分钟追问：
 * 角色 / 问题 / 方案 / 技术取舍 / 指标与验证方式 / 证据素材。
 *
 * 用浮层而非卡内展开：项目卡在 sticky+h-screen 层叠布局里，
 * 原地撑开会破坏滚动编排；浮层零布局冲突，移动端近全屏。
 */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-inter text-[10px] uppercase tracking-[0.3em] text-white/40">
      {children}
    </div>
  );
}

function EvidenceRow({ asset }: { asset: EvidenceAsset }) {
  if (asset.kind === "trace" && asset.status === "ready" && asset.traceId && TRACES[asset.traceId]) {
    return <TracePlayer trace={TRACES[asset.traceId]} />;
  }
  if (asset.kind === "video" && asset.status === "ready" && asset.src) {
    return (
      <figure className="overflow-hidden rounded-xl border border-white/15">
        <video
          src={asset.src}
          poster={asset.poster}
          controls
          playsInline
          preload="metadata"
          className="aspect-video w-full bg-black"
        />
        <figcaption className="px-4 py-2.5 font-inter text-xs text-white/60">
          {asset.caption}
        </figcaption>
      </figure>
    );
  }
  if (asset.kind === "screenshot" && asset.status === "ready" && asset.src) {
    return (
      <a
        href={asset.src}
        target="_blank"
        rel="noreferrer"
        className="group block overflow-hidden rounded-lg border border-white/15 transition-colors hover:border-white/35"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- 保留真实截图原始比例 */}
        <img
          src={asset.src}
          alt={asset.caption}
          loading="lazy"
          className="h-auto w-full bg-black object-contain"
        />
        <span className="flex items-center justify-between gap-3 px-4 py-2.5 font-inter text-xs text-white/60">
          {asset.caption}
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </a>
    );
  }
  if (asset.status === "placeholder") {
    return null;
  }
  if (asset.kind === "link" && asset.src) {
    return (
      <a
        href={asset.src}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center justify-between gap-3 rounded-xl border border-white/15 px-4 py-3 transition-colors hover:border-white/40"
      >
        <span className="font-inter text-xs text-white/75">{asset.caption}</span>
        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-white/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    );
  }
  return (
    <div className="rounded-xl border border-white/15 px-4 py-3 font-inter text-xs text-white/75">
      {asset.caption}
    </div>
  );
}

export default function CaseStudyPanel({
  study,
  onClose,
}: {
  study: CaseStudy | null;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const open = study !== null;
  const debugStory = study
    ? DEBUG_CASES.find((d) => d.id === DEBUG_BY_CASE[study.id]) ?? null
    : null;

  // 浮层打开期间锁定背景滚动（Lenis 协同）+ Esc 关闭
  useEffect(() => {
    if (!open) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {study && (
        <motion.div
          key="case-panel"
          className="fixed inset-0 z-[120] flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
        >
          <button
            aria-label="关闭工程细节"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label={`${study.name} 工程细节`}
            className="relative flex h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[28px] border border-b-0 border-white/15 bg-[#0c0c0c] sm:rounded-t-[36px]"
            initial={reduceMotion ? { opacity: 0 } : { y: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
            transition={{ type: "tween", duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
          >
            <header className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5 sm:px-9">
              <div className="flex items-baseline gap-4">
                <span className="font-inter text-sm tracking-widest text-white/30">
                  ({study.no})
                </span>
                <div>
                  <h3 className="font-podium text-2xl uppercase tracking-tight text-white sm:text-3xl">
                    {study.name}
                  </h3>
                  <span className="mt-0.5 block font-inter text-[10px] tracking-[0.35em] text-white/40">
                    {study.zh} · 工程细节
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="关闭"
                className="rounded-full border border-white/20 p-2.5 text-white/70 transition-colors hover:bg-white hover:text-black"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 space-y-9 overflow-y-auto px-6 py-7 sm:px-9">
              <div className="space-y-2">
                <SectionLabel>我的角色</SectionLabel>
                <p className="font-inter text-sm leading-relaxed text-white/80">
                  {study.role}
                </p>
              </div>

              <div className="space-y-2">
                <SectionLabel>问题</SectionLabel>
                <p className="font-inter text-sm leading-relaxed text-white/70">
                  {study.problem}
                </p>
              </div>

              <div className="space-y-2">
                <SectionLabel>方案路径</SectionLabel>
                <p className="font-inter text-sm leading-relaxed text-white/70">
                  {study.approach}
                </p>
              </div>

              <div className="space-y-3">
                <SectionLabel>关键技术决策</SectionLabel>
                {study.decisions.map((d, i) => (
                  <div
                    key={d.title}
                    className="rounded-2xl border border-white/12 bg-white/[0.03] p-5"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-inter text-[10px] tracking-widest text-white/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-inter text-xs uppercase tracking-widest text-white/55">
                        {d.title}
                      </span>
                    </div>
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-start gap-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/80" />
                        <span className="font-inter text-sm text-white/90">{d.choice}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/30" />
                        <span className="font-inter text-sm text-white/40">{d.insteadOf}</span>
                      </div>
                    </div>
                    <p className="mt-3 font-inter text-[13px] leading-relaxed text-white/60">
                      {d.why}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <SectionLabel>指标与验证方式</SectionLabel>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {study.metrics.map((m) => (
                    <div key={m.label} className="rounded-2xl border border-white/12 p-4">
                      <div className="font-podium text-xl text-white">{m.value}</div>
                      <div className="mt-0.5 font-inter text-[11px] uppercase tracking-widest text-white/50">
                        {m.label}
                      </div>
                      <div className="mt-2 font-inter text-[11px] leading-relaxed text-white/35">
                        验证：{m.verify}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pb-2">
                <SectionLabel>证据素材</SectionLabel>
                <div className="space-y-2">
                  {study.evidence.map((a) => (
                    <EvidenceRow key={a.caption} asset={a} />
                  ))}
                </div>
              </div>

              {debugStory && (
                <div className="space-y-3 pb-2">
                  <SectionLabel>工程复盘</SectionLabel>
                  <DebugStoryFold story={debugStory} />
                </div>
              )}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
