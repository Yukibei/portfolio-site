"use client";

import { useState } from "react";
import { Bug, Check, ChevronDown } from "lucide-react";
import type { DebugCase } from "./debugCases";

/**
 * 项目工程浮层里的 Debug 复盘折叠段。
 * 首页不再独立陈列复盘（对普通访问者太晦涩），
 * 下沉到这里供面试官深挖——点开项目细节的人才是它的读者。
 */
export default function DebugStoryFold({ story }: { story: DebugCase }) {
  const [open, setOpen] = useState(false);
  const chosen = story.options.find((o) => o.verdict === "chosen");

  return (
    <div className="overflow-hidden rounded-2xl border border-white/12">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.03]"
        aria-expanded={open}
      >
        <Bug className="h-3.5 w-3.5 shrink-0 text-emerald-400/80" />
        <span className="flex-1 font-inter text-xs text-white/75">
          Debug 复盘：{story.title}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-white/40 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="space-y-4 border-t border-white/[0.08] px-4 py-4">
          <p className="font-inter text-xs leading-relaxed text-white/55">
            {story.symptom}
          </p>

          <div className="space-y-2.5">
            {story.rootCauses.map((r) => (
              <div key={r.badge} className="flex gap-3">
                <span className="mt-0.5 shrink-0 font-mono text-[9px] uppercase tracking-wider text-emerald-300/70">
                  {r.badge}
                </span>
                <div className="min-w-0">
                  <div className="font-inter text-xs font-medium text-white/85">
                    {r.name}
                  </div>
                  <p className="mt-0.5 font-inter text-[11px] leading-relaxed text-white/45">
                    {r.explain}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {chosen && (
            <div className="flex items-start gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2.5">
              <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400/90" />
              <p className="font-inter text-[11px] leading-relaxed text-white/60">
                <span className="text-white/85">{chosen.name}</span>
                <span className="text-white/40"> — {chosen.reason}</span>
              </p>
            </div>
          )}

          <div className="space-y-1">
            {story.verification.map((v) => (
              <p key={v.method} className="font-inter text-[11px] leading-relaxed text-white/40">
                验证 · <span className="text-white/60">{v.method}</span>：{v.evidence}
              </p>
            ))}
          </div>

          <p className="border-l-2 border-emerald-400/40 pl-3 font-inter text-[11px] font-medium leading-relaxed text-white/65">
            {story.takeaway}
          </p>
        </div>
      )}
    </div>
  );
}
