/* eslint-disable @typescript-eslint/no-require-imports -- node 工具脚本 */
// 批量生成占位图：node gen-placeholders.js
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const TPL = "file:///D:/2026/A11/portfolio-site/web/card-src/placeholder.html";
const ROOT = "D:/2026/A11/portfolio-site/web";

const jobs = [];
const J = (dir, file, w, h, no, year, zh, en) =>
  jobs.push({ dir, file, w, h, q: { no, year, zh, en } });

[["01","2022","入学","ENROLLMENT"],["02","2022","起点工作室","QIDIAN STUDIO"],
 ["03","2023","第一个完整项目","FIRST PROJECT"],["04","2023","深夜代码","LATE NIGHT BUILD"],
 ["05","2024","ICPC 区域赛","ICPC REGIONAL"],["06","2024","国家级奖项","NATIONAL AWARD"],
 ["07","2025","讯飞实习","IFLYTEK INTERN"],["08","2025","交控科技","TCT PROJECT"],
 ["09","2026","Hoop Pupil 上线","SHIP IT"],["10","2026","下一站","NEXT CHAPTER"]
].forEach(([no, year, zh, en]) => J("public/journey", no + ".png", 840, 540, no, year, zh, en));

[["hp","2025","球员识别工作台","REID WORKBENCH","数据看板","DASHBOARD","智瞳篮途","HOOP PUPIL"],
 ["rl","2025","多智能体编排","AGENT GRAPH","学习计划","STUDY PLAN","反思学习","REFLEXLEARN"],
 ["oc","2026","Web 管家","WEB BUTLER","App 小龙虾","MOBILE AGENT","AI 管家","OPENCLAW"]
].forEach(([k, year, zh1, en1, zh2, en2, zh3, en3]) => {
  J("public/projects", k + "-a.png", 840, 540, k.toUpperCase(), year, zh1, en1);
  J("public/projects", k + "-b.png", 840, 540, k.toUpperCase(), year, zh2, en2);
  J("public/projects", k + "-tall.png", 800, 1000, k.toUpperCase(), year, zh3, en3);
});

[["iflytek-1","2025","讯飞工位","AT IFLYTEK"],["iflytek-2","2025","智学云团队","TEAM SNAP"],
 ["tct-1","2025","交控项目室","AT TCT"],["tct-2","2025","联调现场","ON SITE"]
].forEach(([f, year, zh, en]) => J("public/experience", f + ".png", 720, 480, "EXP", year, zh, en));

for (const job of jobs) {
  const dir = path.join(ROOT, job.dir);
  fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, job.file);
  const qs = new URLSearchParams(job.q).toString();
  const r = spawnSync(CHROME, [
    "--headless", "--disable-gpu", "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--window-size=" + job.w + "," + job.h,
    "--screenshot=" + out,
    TPL + "?" + qs,
  ], { stdio: "pipe" });
  if (r.status !== 0) { console.error("FAIL", job.file, r.stderr.toString()); process.exit(1); }
}
console.log("generated " + jobs.length + " placeholders");
