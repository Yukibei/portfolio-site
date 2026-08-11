/**
 * 构建时生成质量门禁报告 → public/quality.json
 *
 * 设计约束（discuss/portfolio-evidence-dev-plan.md §1）：
 * - 状态必须来自真实执行的检查命令，禁止手填；
 * - 本脚本永远 exit 0：JSON 如实记录 pass/fail，
 *   挡部署的职责属于 next build 自身的 lint/type 检查——
 *   build 挂了就部署不出去，这个机制本身就是"不可伪造"的一环。
 *
 * 由 package.json 的 prebuild 钩子自动执行，也可手动：node scripts/generate-quality.mjs
 */
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";

const webRoot = process.cwd();

function runCheck(name, binJs, args) {
  const startedAt = Date.now();
  // 直接用当前 node 调本地 bin 的 JS 入口：绕开 npx/shell，Windows 下行为稳定
  const r = spawnSync(process.execPath, [path.join(webRoot, binJs), ...args], {
    cwd: webRoot,
    encoding: "utf8",
    timeout: 300_000,
  });
  if (r.status !== 0) {
    console.error(`[quality] ${name} output:\n${r.stdout || ""}${r.stderr || ""}`);
  }
  return {
    name,
    status: r.status === 0 ? "pass" : "fail",
    durationMs: Date.now() - startedAt,
  };
}

function gitShortHash() {
  const r = spawnSync("git", ["rev-parse", "--short", "HEAD"], {
    cwd: webRoot,
    encoding: "utf8",
  });
  return r.status === 0 ? r.stdout.trim() : "unknown";
}

console.log("[quality] running checks...");
const checks = [
  runCheck("eslint", "node_modules/eslint/bin/eslint.js", ["."]),
  runCheck("tsc --noEmit", "node_modules/typescript/bin/tsc", ["--noEmit"]),
];

const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const report = {
  generatedAt: now.toISOString(),
  // 预格式化的本地时间：组件直接展示字符串，避免客户端时区格式化造成 hydration 差异
  generatedAtLocal: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
  commit: gitShortHash(),
  checks,
};

const outPath = path.join(webRoot, "public", "quality.json");
writeFileSync(outPath, JSON.stringify(report, null, 2) + "\n", "utf8");

for (const c of checks) {
  console.log(`[quality] ${c.name}: ${c.status} (${c.durationMs}ms)`);
}
console.log(`[quality] report -> ${outPath}`);
