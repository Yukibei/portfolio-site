"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  Hand,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  StepForward,
} from "lucide-react";
import type { AgentTrace, TraceStep } from "./traces";

/**
 * Agent 执行轨迹回放器。
 * 不是聊天窗口，也不是装饰动画：按真实步骤序列回放一次执行，
 * 可播放/暂停/单步/调速，每步可展开看取自真实日志的细节。
 * fallback / confirm 步骤完成后保留状态色——降级和确认是设计特性，不是失败。
 */

type StepVisual = "pending" | "running" | "done" | "fallback" | "confirm";

function visualOf(step: TraceStep, index: number, cursor: number, playing: boolean): StepVisual {
  if (index < cursor) return step.status; // 已完成：保留 done/fallback/confirm 语义色
  if (index === cursor && playing) return "running";
  return "pending";
}

function StatusIcon({ visual }: { visual: StepVisual }) {
  switch (visual) {
    case "running":
      return <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />;
    case "done":
      return <Check className="h-3.5 w-3.5 text-emerald-400/90" />;
    case "fallback":
      return <AlertTriangle className="h-3.5 w-3.5 text-red-400/90" />;
    case "confirm":
      return <Hand className="h-3.5 w-3.5 text-sky-300/90" />;
    default:
      return <span className="block h-1.5 w-1.5 rounded-full bg-white/20" />;
  }
}

export default function TracePlayer({ trace }: { trace: AgentTrace }) {
  const reduceMotion = useReducedMotion();
  const total = trace.steps.length;
  // cursor = 已完成的步数；reduced-motion 用户直接看到完整结果
  const [cursor, setCursor] = useState(() => (reduceMotion ? total : 0));
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2>(1);
  const [expanded, setExpanded] = useState<number | null>(null);

  const finished = cursor >= total;

  useEffect(() => {
    if (!playing) return;
    if (cursor >= total) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(
      () => setCursor((c) => c + 1),
      trace.steps[cursor].durMs / speed,
    );
    return () => clearTimeout(timer);
  }, [playing, cursor, speed, total, trace.steps]);

  const controls = useMemo(
    () => ({
      toggle: () => {
        if (finished) {
          setCursor(0);
          setPlaying(true);
        } else {
          setPlaying((p) => !p);
        }
      },
      stepOnce: () => {
        setPlaying(false);
        setCursor((c) => Math.min(c + 1, total));
      },
      replay: () => {
        setExpanded(null);
        setCursor(0);
        setPlaying(true);
      },
    }),
    [finished, total],
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-white/12 bg-black/50">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <span className="font-inter text-[11px] uppercase tracking-widest text-white/60">
          {trace.title}
        </span>
        <span className="rounded-full border border-emerald-400/30 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-emerald-300/80">
          from real run · 脱敏转写
        </span>
      </header>

      <div className="border-b border-white/10 px-4 py-3 font-mono text-xs text-white/75">
        <span className="select-none text-white/30">$ </span>
        {trace.task}
      </div>

      <ul>
        {trace.steps.map((s, i) => {
          const visual = visualOf(s, i, cursor, playing);
          const reached = i < cursor;
          const isExpanded = expanded === i;
          return (
            <li key={`${s.step}-${i}`} className="border-b border-white/[0.06]">
              <button
                onClick={() => s.detail && setExpanded(isExpanded ? null : i)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  visual === "running" ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"
                } ${s.detail ? "cursor-pointer" : "cursor-default"}`}
              >
                <span className="flex w-4 shrink-0 justify-center">
                  <StatusIcon visual={visual} />
                </span>
                <span
                  className={`w-32 shrink-0 truncate font-mono text-[11px] sm:w-40 ${
                    reached || visual === "running" ? "text-white/85" : "text-white/30"
                  }`}
                >
                  {s.step}
                </span>
                <span
                  className={`hidden flex-1 truncate font-inter text-xs sm:block ${
                    reached ? "text-white/55" : "text-white/25"
                  }`}
                >
                  {s.summary}
                </span>
                <span className="ml-auto shrink-0 font-mono text-[10px] text-white/25">
                  {(s.durMs / 1000).toFixed(1)}s
                </span>
              </button>
              {/* 移动端摘要换行显示 */}
              {reached && (
                <p className="px-11 pb-2 font-inter text-[11px] leading-relaxed text-white/45 sm:hidden">
                  {s.summary}
                </p>
              )}
              {isExpanded && s.detail && (
                <div className="mx-4 mb-3 rounded-lg border-l-2 border-white/20 bg-white/[0.03] px-3 py-2 font-mono text-[11px] leading-relaxed text-white/55">
                  {s.detail}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {finished && (
        <div className="border-b border-white/10 px-4 py-3">
          <div className="font-inter text-[10px] uppercase tracking-[0.3em] text-white/35">
            Output
          </div>
          <p className="mt-1.5 font-inter text-xs leading-relaxed text-white/70">
            {trace.output}
          </p>
        </div>
      )}

      <footer className="flex flex-wrap items-center gap-2 px-4 py-3">
        <button
          onClick={controls.toggle}
          aria-label={playing ? "暂停" : "播放"}
          className="flex items-center gap-1.5 rounded-full border border-white/25 px-3.5 py-1.5 font-inter text-[10px] uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
        >
          {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          {playing ? "Pause" : finished ? "Replay" : "Play"}
        </button>
        <button
          onClick={controls.stepOnce}
          disabled={finished}
          aria-label="单步执行"
          className="flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 font-inter text-[10px] uppercase tracking-widest text-white/60 transition-colors hover:border-white/40 hover:text-white disabled:opacity-30"
        >
          <StepForward className="h-3 w-3" />
          Step
        </button>
        <button
          onClick={controls.replay}
          aria-label="重新播放"
          className="flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 font-inter text-[10px] uppercase tracking-widest text-white/60 transition-colors hover:border-white/40 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
        </button>
        <button
          onClick={() => setSpeed((v) => (v === 1 ? 2 : 1))}
          aria-label="切换速度"
          className="rounded-full border border-white/15 px-3.5 py-1.5 font-mono text-[10px] text-white/60 transition-colors hover:border-white/40 hover:text-white"
        >
          {speed}x
        </button>
        <span className="ml-auto font-mono text-[10px] text-white/30">
          {Math.min(cursor, total)}/{total}
        </span>
      </footer>

      <div className="border-t border-white/[0.06] px-4 py-2.5 font-inter text-[10px] leading-relaxed text-white/30">
        {trace.sourceNote}
      </div>
    </div>
  );
}
