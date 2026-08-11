# 能力证据系统 · 开发执行文档

> 这是开发阶段的**唯一进度真相源**。任何 AI（或人）接管开发时，从本文档开始读。
> 创建：2026-06-13 ｜ 维护规则：每完成一个阶段，更新 §2 状态表与 §8 开发日志。

## 0. 文档体系（按阅读顺序）

| 文档 | 作用 |
| --- | --- |
| `PLAN.md` | 项目蓝图：定位、部署、视觉方向（2026-06-10） |
| `discuss/portfolio-evidence-upgrade-plan.md` | Round 1：证据化升级计划（三路线、模块设计、压力测试矩阵） |
| `discuss/portfolio-brainstorm-round2.md` | Round 2：三项修订（mode 降级 / trace 真实回放 / quality 构建时生成）+ 遗漏项 |
| **本文档** | 开发阶段定义、状态跟踪、数据契约、接管指南 |

冲突裁决：**本文档 > Round 2 > Round 1 > PLAN.md**。

## 1. 已拍板的最终方案（用户 2026-06-13 确认）

- ❌ 不做全站 Recruiter/Engineer 切换 → ✅ 案例卡两层结构（正面 HR 层 + 浮层工程层）
- ❌ 不做 simulated trace → ✅ TracePlayer 回放**真实导出**的 trace JSON（来源 ReflexLearn / OpenClaw），标注 `recorded from real run`，必须过脱敏清单
- ❌ 不手填 quality 状态 → ✅ 构建时生成 quality JSON（lint/typecheck 结果 + commit hash + 时间戳）
- ✅ EXHIBIT 证据链：`<Claim>` 组件给关键声明标注验证方式，footer 证据索引
- ✅ facts.ts 单一事实源，全站数字与简历 PDF 一致
- ✅ OG/微信转发卡片优先级最高（求职链路第一屏）
- ✅ Debug Case：#1 工作证 3D 图层（前端向）、#2 agentTaskMemory 状态污染（Agent 向，默认推荐，用户未反对）
- ✅ 录屏与 trace 互补：录屏=用户看到什么，trace=系统内部发生什么；时间轴同步版为 T4 可选项

理想形态的完整描述见对话记录与 Round 2 文档 §1.2（TracePlayer 线框图已在对话中确认）。

## 2. 阶段状态表（接管者先看这里）

| 阶段 | 内容 | 状态 | 备注 |
| --- | --- | --- | --- |
| T0 | OG/微信卡片 + metadata | ✅ 2026-06-13 | OG 图暂用 hero-poster.jpg，专属 1200×630 设计图待补 |
| T1a | facts.ts + caseStudies.ts 数据层 | ✅ 2026-06-13 | 数字需用户最终核对与简历一致 |
| T1b | 案例卡两层结构（CaseStudyPanel 浮层） | ✅ 2026-06-13 | sticky 层叠视觉未动；深链 /#case-{id} 可用 |
| T2a | TracePlayer 组件（先吃 placeholder trace） | ✅ 2026-06-13 | 用户授权后已从两仓库勘探真实结构，traces.ts 已基于真实节点/动作/日志转写并点亮 |
| T2b | Debug Case #1（工作证图层） | ✅ 2026-06-13 | DebugCaseSection 已含 Case #2 agentTaskMemory；before/after 截图仍 placeholder |
| T3a | EXHIBIT/Claim 组件 + footer 证据索引 | ✅ 2026-06-13（轻量版） | Evidence Index 已上线（FACTS 全表渲染于 footer）；行内 `<Claim>` 埋点组件未做，留后续 |
| T3b | 构建时 quality JSON + Hero 角落 status 行 | ✅ 2026-06-13 | prebuild 钩子 + QualityGate 组件（footer）；Hero 角落 status 行未做（避免动 Hero 视觉，等用户意见） |
| T3c | Debug Case #2（agentTaskMemory） | ✅ 2026-06-13 | 随 T2b 一并完成 |
| T4 | 独立 Agent Console 区块 / dev overlay 彩蛋 / Journey 故事 / 录屏-trace 同步 | ⬜ 可选 | 不阻塞求职 |

状态图例：⬜ 未开始 ｜ 🔨 进行中 ｜ ✅ 完成 ｜ ⛔ 阻塞

## 3. 数据契约（所有新代码必须遵守）

### 3.1 目录约定

```text
web/components/
├── evidence/          # 数据 + 证据类组件
│   ├── facts.ts       # 全站数字唯一来源（与简历 PDF 同步）
│   ├── caseStudies.ts # 三个项目的案例研究数据
│   ├── CaseStudyPanel.tsx
│   └── (后续) traces/*.json, debugCases.ts, qualityReport 读取
├── common/            # 可复用 UI（Claim、MetricBadge…）
└── sections/          # 新增页面区块
```

顶层 `web/components/*.tsx` 现有 8 个文件**不再增加**；现有文件原位不强制迁移。

### 3.2 核心类型（定义在 caseStudies.ts，后续模块复用）

```ts
type EvidenceAsset = {
  kind: "screenshot" | "video" | "trace" | "link" | "diagram";
  status: "ready" | "placeholder";   // placeholder = 素材未到位，UI 优雅降级
  src?: string;
  caption: string;
};

type TechnicalDecision = {
  title: string;      // 决策点
  choice: string;     // 选了什么
  insteadOf: string;  // 而不是什么
  why: string;        // 取舍理由（面试拷打点前置自答）
};

type TraceEvent = {   // T2 实现时使用
  t: number;          // 相对起点 ms
  step: string;       // intent/retrieve/plan/tool/confirm/stream/guardrail
  status: "start" | "done" | "fallback" | "confirm";
  summary: string;    // 脱敏后单行描述
  detail?: string;
};
```

### 3.3 素材槽位协议

开发**永不**被素材阻塞：所有 asset 先以 `status: "placeholder"` 入库，UI 渲染为低调灰条（"素材整理中"）或直接隐藏；用户补料后改 `status: "ready"` + 填 `src` 即点亮。

## 4. 工程约束

- Next.js 15.4 / React 19 / Tailwind v4 / framer-motion；TypeScript 严格，禁 `any`。
- 单文件尽量 ≤300 行；超了就拆。
- `reactStrictMode: false` 是有意为之（rapier 物理双挂载 NaN），勿恢复。
- ⚠️ `next.config.ts` 当前**未开** `output: 'export'`；PLAN.md 部署方案是静态导出 + Nginx。上线前需确认部署形态（静态导出 or node server），开 export 前要检查 three/rapier 兼容。
- 动效：每屏一个主动效；复杂动效尊重 `prefers-reduced-motion`（framer-motion `useReducedMotion`）。
- 不引新重型依赖；TracePlayer 用现有 framer-motion 实现。
- Run & Debug 一律走 `scripts/*.sh`（lint.sh / build.sh / dev.sh / verify-experience-layout.sh）。

## 5. 内容红线（文案层，与简历一致）

- 第一人称、具体名词、真实数字；禁"赋能/打造/极致/引领"类词；禁泛 AI 紫粉渐变。
- 经历口径：讯飞智学云=真实实习；交控=外包项目制；不写涉密内容，智学云只写公开化能力与方法。
- 所有指标必须可解释：mAP 91.61% / Rank-1 94.40% / 特征 ~35ms / 匹配 11ms（赛题达标线 91.5 / 94.0 / 40ms / 30ms）。
- ICPC 表述："解题数达铜奖线"。

## 6. 脱敏清单（trace / 录屏 / 截图入库前逐项过）

- [ ] 内部域名 / IP / 端口
- [ ] 完整接口路径与参数原文（可保留语义化摘要）
- [ ] token / key / cookie
- [ ] 真实用户数据（手机号、头像、昵称）
- [ ] 讯飞智学云内部信息（页面、接口、数据）一律不出现

## 7. 用户资源供给清单（异步补料，不阻塞开发）

| 资源 | 用于 | 状态 |
| --- | --- | --- |
| 核对 facts.ts 数字与简历一致 | T1a | ⬜ 待用户核对 |
| ReflexLearn / OpenClaw trace 日志导出（或授权 AI 进仓库导） | T2a | ⬜ **T2 前置阻塞项** |
| 工作证 bug before/after 截图 | T2b | ⬜ git 历史可部分复原 |
| 录屏 4 段（Pipeline Chain / 小龙虾 / 智瞳篮途 / ReflexLearn） | 案例卡 evidence | ⬜ placeholder 兜底中 |
| 架构图 2-3 张（论文图可改绘） | 案例工程层 | ⬜ placeholder 兜底中 |
| 专属 OG 卡片图 1200×630 | T0 收尾 | ⬜ 暂用 hero-poster.jpg |

## 8. 开发日志（倒序追加）

### 2026-06-13 深夜 · 调整二（用户指令）

- Debug Case #1 再换题：个人站素材（视频擦洗）按用户要求撤下，换为**智瞳篮途球场校准 Homography 外推崩溃**（素材取自 memory court-calibration-fix：负坐标 court(-7.03)、关键点 ID 丢弃、6 点全在上半部外推崩溃、33 点语义映射+RANSAC 修复、inlier 1.0/重投影 0.27）。选题规则更新进 debugCases.ts 注释：**只用三个核心项目的真实修复，不用个人站自身案例**。两案例现覆盖智瞳篮途（CV/几何）+ OpenClaw（Agent 状态）。
- footer 重排：QualityGate+Evidence Index 移到前，Say Hello 移到最底部（紧贴底栏）。**踩坑复发**：Say Hello 移到页面最底部后被 Reveal 包裹导致 whileInView 永不触发、整块隐身（底栏注释早有记录的同一坑）——去掉 Reveal 直接渲染修复。**规则：页面最底部 ~70px 内的内容一律不要用 Reveal 包。**
- 验证：eslint+tsc pass；Playwright 确认 Case01 球场案例渲染、footer 顺序与 Say Hello 可见。截图同目录归档。
- 等待用户提供参考排版模板，下一轮按模板校准布局。

### 2026-06-13 深夜 · 视觉重做（用户差评驱动）

用户反馈三条：①首页感知不到变化 ②工作证案例选题单薄"像没东西可写" ③QualityGate 左右栏失衡"左边少右边长"。根因复盘：把信息架构正确当成了交付标准，交付的是文档排版不是设计——全部 10-13px 灰字堆叠、无视觉锚点、未复用站点已有的 PODIUM 大字语言。重做内容：

- **Debug Case #1 换题**：工作证图层案例删除，换为 hero 视频擦洗三层根因（CDN→事件死锁→真凶 4K 单关键帧编码，素材取自本仓库真实修复史，验证含 ffprobe 97/97 关键帧）。选题标准写进 debugCases.ts 注释：必须有递进/反转的戏剧结构，小修小补不入选。
- **DebugCaseSection 重排版**：PODIUM 大编号案例头 + 引言级现象大字 + LAYER 递进卡横排（卡间箭头，最后一张琥珀色"真凶/扳机"高亮 + outcome 结论行）+ 方案 PK 卡（弃案 opacity-70 / 选案亮边）+ 验证徽章横排 + 引言体沉淀。数据结构加 badge/outcome 字段驱动递进叙事。
- **QualityGate 重构**：废弃左右双栏（失衡根源），改为全宽终端式状态线（呼吸灯 + 单行等宽 checks + commit + 时间）+ Evidence Index 4×2 大数字卡阵（font-podium 3xl-4xl，呼应 Hero 统计区），hover 提亮验证文字。
- **Projects 卡**："工程细节"按钮升级为实心白底主按钮（首页可感知入口）。
- 验证：tsc + eslint pass；Playwright 桌面 1440 + 移动 375 截图自审通过，归档 `discuss/verify/2026-06-13-redesign/`。
- 教训沉淀：**交付标准 = 截图自审"像不像设计作品"，不是"信息全不全"**；新区块必须复用站点既有视觉语言（PODIUM 大字/大编号/卡片层级），灰色小字只能做辅助层。

### 2026-06-13 深夜 · 第二轮（同一执行者，用户授权自主勘探）

- **T2a trace 勘探与点亮**：
  - ReflexLearn 真实结构：LangGraph 图（`multagent/src/reflexlearn/orchestration/graph.py`）节点 profile→recall→planner→(generate_resource|pipeline)→gate→(critic→planner 回流|debate→judge|metacognition)→assemble→path_plan；实际运行日志 `logs/api.log` 提供 `pipeline_diag`/`metacognition_diag` 字段与真实降级事件（`path_plan degraded (no api key) -> rule based`）。
  - OpenClaw 真实结构：`ballshow-mobile/.../mobile-agent/actionTypes.ts`（11 种 ActionKind、ok/blocked/confirming/failed/done 状态、low/medium/high 风险）+ `mobileAgentTrace.ts`（TraceItem 结构）。
  - `evidence/traces.ts`：两段 trace（ReflexLearn 学习任务含 fallback 结尾 / OpenClaw 流水线含 confirm 中风险步骤），sourceNote 如实声明"转写自真实日志与代码"口径，已过脱敏清单。
  - `evidence/TracePlayer.tsx`：播放/暂停/单步/1x2x/重播；完成步保留 done/fallback/confirm 语义色；行点击展开 detail（日志原样字段）；reduced-motion 直接呈现完成态；移动端摘要换行。已嵌入 CaseStudyPanel（trace asset ready+traceId 即渲染）。
- **T2b/T3c Debug Cases**：`evidence/debugCases.ts` + `sections/DebugCaseSection.tsx`，挂载 page.tsx（Experience 后）。Case#1 工作证图层（裁切/层叠/指针三根因 + 物理边界 vs 图层优先取舍 + 三种验证），Case#2 agentTaskMemory 状态污染（写侧清场 vs 读侧校验取舍）。区块编号顺延：Debug=04、Skills=05、Contact=06。
- **T3a/T3b Quality**：`web/scripts/generate-quality.mjs`（prebuild 钩子真实执行 eslint+tsc 写 public/quality.json，永远 exit 0、如实记录 fail，挡部署交给 next build 自身）+ `evidence/QualityGate.tsx`（Quality Gate 状态 + Evidence Index=FACTS 全表）挂 SiteFooter。**踩坑：Windows 下 spawnSync+npx+shell:true 偶发误报 fail，改为 process.execPath 直接调 node_modules bin 入口后稳定且更快（2s 级）**。时间戳预格式化为 generatedAtLocal 字符串，避免客户端时区格式化 hydration 差异。
- 验证（全过）：build ✅（首页 195kB First Load）；Playwright 桌面 1440 + 移动 375：TracePlayer 播放/完成态、Debug 区双栏/单栏、QualityGate+Evidence Index 移动降级。截图归档 `discuss/verify/2026-06-13-t2-t3/`。
- 已知边界：站内 hash 变化不触发浮层（深链仅整页加载时生效，符合使用场景）；TracePlayer 同卡片多 trace 未做互斥（当前每卡一条，无影响）。

### 2026-06-13 · 第一轮（Claude，Round 2 同一执行者）

- 建立本文档。
- T0：`app/layout.tsx` 补 metadataBase / openGraph / twitter / 中文 description；OG 图暂用 `/hero-poster.jpg`。
- T1a：新建 `components/evidence/facts.ts`、`components/evidence/caseStudies.ts`；`app/home/constants.ts` 的 STATS 改为从 facts 引用（HeroSection 接口不变）。
- T1b：新建 `components/evidence/CaseStudyPanel.tsx`（底部浮层，工程细节层）；`components/Projects.tsx` 数据源切到 caseStudies.ts，卡片加 "Engineering Details" 入口。浮层方案原因：卡片处于 sticky+h-screen 层叠布局，原地展开会破坏滚动编排，浮层零布局冲突且移动端可全屏。
- 验证（全部通过）：
  - `scripts/lint.sh` ✅ 无告警；`scripts/build.sh` ✅ 编译+类型检查通过，首页 First Load 188 kB。
  - Playwright 实测：深链 `/#case-hoop-pupil` 自动开浮层 ✅；Esc 关闭并清 hash ✅；遮罩点击关闭 ✅（注意：断言需等退出动画 ~0.6s 后查 DOM）；375px 移动端按钮打开/排版可读 ✅。
  - 截图归档：`discuss/verify/2026-06-13-t0-t1/`。
- 遗留：OG 专属图（§7）；Hero 的 mAP 由 91.6% 改为 91.61%（与简历/facts 对齐），需用户过目。

## 9. 接管指南（给下一个 AI）

1. 读本文档 §1-§5，再扫 Round 2 文档；不必重读 Round 1 全文。
2. 看 §2 状态表挑第一个 ⬜/⛔ 项；阻塞项优先问用户要资源（§7）。
3. 改代码前跑一遍 `scripts/lint.sh && scripts/build.sh` 确认基线干净。
4. 新组件只进 `evidence/ | common/ | sections/` 子目录。
5. 完成后：更新 §2 状态 + §8 追加日志（日期、做了什么、为什么这么做、验证结果）。
6. 文案改动必须过 §5 红线；素材入库必须过 §6 脱敏清单。
7. 不确定的决策：在 `discuss/` 新建讨论稿留档，倾向于先用 placeholder 推进而不是停下等确认。
