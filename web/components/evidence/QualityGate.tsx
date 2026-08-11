import report from "../../public/quality.json";

/**
 * Quality Gate：一条终端式状态线收尾全站。
 * 数据来自构建时自动执行的检查（prebuild 真实跑 eslint+tsc 写入 quality.json），
 * 状态不可手填——懂的人会心一笑，不懂的人不碍眼。
 */
export default function QualityGate() {
  const allPass = report.checks.every((c) => c.status === "pass");

  return (
    <div className="border-t border-white/10 pt-10">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-white/12 bg-black/60 px-5 py-3.5 font-mono text-xs">
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${
                allPass ? "bg-emerald-400" : "bg-red-400"
              }`}
            />
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${
                allPass ? "bg-emerald-400" : "bg-red-400"
              }`}
            />
          </span>
          <span className="uppercase tracking-[0.25em] text-white/60">
            Quality Gate
          </span>
        </span>
        {report.checks.map((c) => (
          <span key={c.name} className="flex items-center gap-1.5 text-white/70">
            {c.name}
            <span className={c.status === "pass" ? "text-emerald-400" : "text-red-400"}>
              {c.status === "pass" ? "✓" : "✗"}
            </span>
          </span>
        ))}
        <span className="text-white/40">build {report.commit}</span>
        <span className="ml-auto text-white/30">{report.generatedAtLocal}</span>
      </div>
      <p className="mt-2.5 px-1 font-inter text-[11px] text-white/30">
        构建时真实执行 eslint 与 tsc 后自动写入——检查不过则站点无法部署，状态不可手填。
      </p>
    </div>
  );
}
