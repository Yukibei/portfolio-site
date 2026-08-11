# 第二轮头脑风暴：对证据化升级计划的修订与增补

> 状态：讨论稿（Round 2）
> 基于：`discuss/portfolio-evidence-upgrade-plan.md`（Round 1）
> 立场：不推翻 Round 1 的"能力证据系统"定位，挑战其中 3 个设计决策，补 5 个遗漏项，按投递期重排优先级。

## 0. 结论先行

| 项目 | Round 1 方案 | Round 2 修订 |
| --- | --- | --- |
| Recruiter / Engineer Mode | 全站 segmented control 切换 | 降级为"卡片内渐进披露"，全站切换取消；可选终端风格 dev overlay 彩蛋 |
| Agent Console | 模拟执行流（simulated trace） | 升级为**真实运行轨迹回放**（replayed trace），从 ReflexLearn / OpenClaw 导出真实 trace JSON |
| Live Quality | 静态展示最近一次本地验证 | 改为**构建时生成** quality JSON，绑定 commit hash + 构建时间，天然不可伪造 |
| 新增 | — | 微信/OG 转发卡片（T0 最高优先级）、facts.ts 数据同源、深链锚点、第二个后端向 Debug Case、trace 脱敏清单 |
| 全站语言 | Trust & Authority（口号层面） | 落地为 **EXHIBIT 证据链组件体系**：每个声明可点开验证方式 |

## 1. 三个设计决策的挑战

### 1.1 Mode 切换：从"全站状态"降级为"就地渐进披露"

Round 1 自己列出的风险（hydration、布局跳动、HR 不切也要能看完）其实指向同一个结论：**这个交互的维护成本高于真实使用率**。

理由：

- 没有访问者会主动回答"我是谁"。HR 不会点 Engineer，面试官也未必点——多一个决策点就少一批往下看的人。
- 同一份内容维护两套信息密度，每次更新项目都要改两份，长期必然失真。
- 全站 mode 状态（context/localStorage）在静态导出 + SSR 下就是 Round 1 担心的那个 hydration 雷。

替代方案，分两层：

1. **卡片内两层结构**（承载全部必要信息）：案例研究卡片正面 = Recruiter 层（定位、角色、指标、一张图），展开 = Engineer 层（架构、决策、验证、trace）。HR 自然停在正面，面试官自然点开。局部 state，零 hydration 风险，零内容重复。
2. **终端风格 dev overlay**（可选彩蛋，不承载必要信息）：页面角落一个 status bar 或按 `~` 键，弹出开发者视图——构建信息、quality 报告、commit hash、甚至本站架构自述。这比 segmented control 有记忆点得多，而且它本身就是一条工程能力证据。做不做不影响主线。

这样 Round 1 信息架构里的 "Evidence Switch" 区块整个消解，省出的工时投给 1.2。

### 1.2 Agent Console：simulated trace → replayed trace（本轮最重要的一条）

证据效力排序：**可复现的实时运行 > 真实记录的回放 > 录屏 > 模拟动画 > 文字描述**。

Round 1 选了"模拟动画"档，但对 AI Agent 岗位的面试官来说，一个标注 simulated 的 trace 只证明你会写前端动画，不证明你会写 Agent。而关键在于：**回放真实 trace 的前端成本和编假数据几乎一样**——都是一份 JSON 驱动 timeline 组件——叙事价值却差一个量级：

- 模拟版的回答："这是示意动画。"
- 回放版的回答："这是 2026 年 5 月 OpenClaw 流水线一次真实运行的 trace 导出，原始日志在仓库里。"

可行性：ReflexLearn 基于 LangGraph，本身就有事件流；OpenClaw mobile-agent 已有 trace/confirm 机制。两边都天然产生结构化轨迹，导出 1-3 段、定义统一 `TraceEvent` schema 即可。

实施要点：

```ts
type TraceEvent = {
  t: number;            // 相对时间戳 ms
  step: string;         // intent / retrieve / plan / tool / stream / guardrail
  status: 'start' | 'done' | 'fallback' | 'confirm';
  summary: string;      // 脱敏后的单行描述
  detail?: string;      // 展开层：参数摘要、置信度、引用
};
```

- 前端做一个 `TracePlayer` 组件：时间轴回放、可调速、可单步、可暂停看某一步详情。
- 标注改为 `recorded from real run · 2026-05` 而不是 `simulated`。
- **必须配脱敏清单**：trace 来自真实日志，最容易带出内部接口名、域名、key、用户数据。导出脚本里做白名单字段过滤，人工复核一遍再入库。
- 降级路径：若某段 trace 导出困难，可以"基于真实运行人工转写"，标注转写来源，仍优于纯虚构。

另一个一鱼两吃：TracePlayer 先作为 ReflexLearn / OpenClaw 案例研究里的证据组件出现（嵌在卡片 Engineer 层），独立的 Agent Console 区块在 T4 再用同一组件拼装。不需要先建一个大 section。

### 1.3 Live Quality：静态手填 → 构建时生成

"latest local verification" 静态徽标有两个问题：会过期（badge 写 pass 但站点已坏，反向伤害）；可伪造嫌疑（无法自证）。

修订：**在 build 流程里跑 lint / typecheck / test，把结果连同 commit hash、构建时间写入静态 JSON，页面读这个 JSON 渲染**。部署产物和检查结果天然绑定——build 挂了就部署不出去，这个机制本身就是"不能伪造"的证明，面试时还可以把这个机制当一条工程设计讲。

加分项（按成本排序）：

1. commit hash 链接到 GitHub 对应 commit（成本≈0）。
2. 展示 Lighthouse 分数 + 一行复现命令 `npx lighthouse https://me.hooppupil.me`——"任何人可复现"是最高级的信任信号。
3. GitHub Actions 真 CI + badge（如果仓库公开）。

## 2. Round 1 遗漏的高杠杆项

### 2.1 微信/OG 转发卡片 —— T0，优先级高于站内一切新模块

中国求职链路里，这个链接大概率是在**微信对话里被 HR 点开**的。转发卡片（标题、描述、缩略图）是真正的第一屏，先于 Hero 存在。PLAN.md 原本有这条，Round 1 丢了，必须捡回来：

- 每页 metadata + OG 图（建议专门设计一张 1200×630，含姓名、定位、2 个硬数字）。
- 微信内置浏览器实测一遍：能否打开、视频是否自动播放被禁、首屏 4G 加载时间。
- 这件事半天能做完，影响每一次投递。

### 2.2 facts.ts 单一事实源

简历 PDF、站点、面试答题稿三处的数字必须一致（mAP 91.61% / Rank-1 94.40% / 35ms / 11ms / 12 个模块……）。面试官交叉对比简历和网站是常见动作，**不一致比没有更糟**。

建 `web/components/evidence/facts.ts` 作为唯一事实源，Hero 硬数字、案例指标、quality 区全部从这里引用。简历更新时同步改这一个文件。

### 2.3 深链锚点

每个案例研究、每个 Debug Case 要有稳定的 hash 锚点（`/#hoop-pupil`、`/#debug-lanyard`），用途：

- 简历里可以精确引用某个案例；
- 面试中口头报地址能直达；
- 微信里发"看这个：me.hooppupil.me/#reflexlearn-trace"。

单页结构不变，只要锚点 ID 稳定 + 滚动定位正确。

### 2.4 第二个 Debug Case 必须是后端 / AI 向

工作证 z-index 案例自指性好（网站自己就是作品），保留为 #1。但目标岗位是 AI 应用 / Agent 开发，如果所有 Debug Case 都是 CSS 层面，信号偏弱。建议 #2 从真实修复记录里选：

- **首选：agentTaskMemory 状态重置 bug**——Agent 系统 + 状态管理 + 真实修复过程，正中岗位方向（问题：任务结果摘要被上次运行污染；修复：startTaskRun 清状态 + sendContent 启动前调用）。
- 备选：图搜话术优化（"未知球员"→"编号 XXX" + 低置信度提示），这是产品判断向的案例，能展示 AI 产品意识。

两个案例一前端一 Agent，覆盖面刚好。

### 2.5 内容脱敏清单（贯穿所有证据素材）

trace JSON、录屏、截图三类素材都来自真实系统，统一过一遍清单：内部域名/IP、接口路径、token/key、真实用户数据、讯飞智学云内部信息。建议在 `discuss/` 里维护一份 `redaction-checklist.md`，每批素材入库前打勾。

## 3. 全站设计语言：EXHIBIT 证据链

把"Trust & Authority"从口号落成可感知的 UI 模式：

- 全站统一组件 `<Claim>`：任何关键声明（指标、上线、获奖）旁边一个小的 verified 标记，hover/点击展示**验证方式**（截图 / 复现命令 / 链接 / trace 片段）。
- 每个 section 角落一个低调的 exhibit 编号（EXHIBIT A/B/C…），footer 放一个"证据索引"：列出全站所有可验证声明及其验证方式。
- 视觉上与等宽字体、检测框元素（PLAN.md 的 ReID 框 hover 创意值得保留——这是题材原生的视觉语言）同属一套"技术证据"语言。

这个体系成本低（一个组件 + 数据结构），但它让"可验证"成为访问者能**感知**到的全站气质，而不是某个单独区块的功能。目前几乎没有作品集这么做，差异化和叙事目的兼得。

## 4. 按投递期重排的实施顺序

原则：先修转发链路（影响每次投递），再做面试官必看区，再做差异化。

| 阶段 | 内容 | 工时估计 | 对应 Round 1 |
| --- | --- | --- | --- |
| T0 | OG/微信卡片 + 移动端首屏性能复测 + 简历链接核对 | 0.5 天 | （遗漏项） |
| T1 | 组件目录重组 + facts.ts + 三个案例研究（卡片两层结构、深链锚点） | 2-3 天 | P1 + P3，吸收 P2 的精华 |
| T2 | TracePlayer（嵌入 ReflexLearn/OpenClaw 案例）+ Debug Case #1 工作证 | 2 天 | P4 + P5 前半 |
| T3 | EXHIBIT/Claim 体系 + 构建时 quality JSON + Debug Case #2 | 1-2 天 | P5 后半 + 新增 |
| T4（可选） | 独立 Agent Console 区块（复用 TracePlayer）+ dev overlay 彩蛋 + Journey 故事 | 不限期 | P4 独立化 + P6 |

Round 1 的 P2（全站 Mode 切换）取消，其意图由 T1 的卡片两层结构实现。

## 5. 三人协作协议

角色：用户（资源供给 + 拍板）、规划 Claude（蓝图已锁定）、实现 Claude（按 T0-T4 推进）。

### 5.1 素材槽位协议（关键：开发永不被素材阻塞）

所有证据资产在数据层声明状态：

```ts
type EvidenceAsset = {
  kind: 'screenshot' | 'video' | 'trace' | 'link' | 'diagram';
  status: 'ready' | 'placeholder';
  src?: string;
  caption: string;
};
```

UI 对 placeholder 优雅降级（隐藏或灰框），代码先行，用户异步补料，补一个亮一个。

### 5.2 用户的资源供给清单（按 T 阶段对齐）

| 资源 | 用于 | 需要时间点 |
| --- | --- | --- |
| 核对 facts.ts 全部数字与简历一致 | T1 | T1 开始前 |
| ReflexLearn / OpenClaw trace 日志导出（或允许实现 Claude 进仓库导） | T2 | T2 开始前 |
| 工作证 bug 的 before/after 截图（仓库 git 历史里可能可复现） | T2 | T2 期间 |
| 录屏 4 段（Pipeline Chain / 小龙虾 / 智瞳篮途 / ReflexLearn） | T1-T4 持续 | 随时，placeholder 兜底 |
| 架构图 2 张（论文里有可复用改绘） | T1 | 随时 |
| OG 卡片用的个人定位文案一句话 | T0 | T0 前确认 |

### 5.3 每轮验收

- `scripts/*.sh` 跑 lint / build / layout check。
- Playwright 桌面 + 375px 移动端截图，结果归档 `discuss/`。
- 真人测试：T1 完成后找 1-2 个非技术朋友看 30 秒，回答"他是做什么的、最强的项目是哪个、怎么联系"——这是把 Round 1 压力测试矩阵第一行真正执行掉。

## 6. 给实现 Claude 的提示词补丁

在 Round 1 第 10 节提示词基础上追加：

```text
修订（以本文档为准，覆盖 Round 1 对应条目）：
- 不做全站 Recruiter/Engineer 切换；用案例卡片内两层结构实现渐进披露。
- Agent 执行流必须基于真实导出的 trace JSON 回放，标注 recorded from real run；
  禁止虚构 trace 内容；导出数据必须过脱敏清单。
- Live Quality 必须构建时生成（lint/typecheck 结果 + commit hash + 时间戳写入 JSON），
  禁止手填状态。
- 新增 facts.ts 单一事实源，所有数字从此引用，与简历 PDF 保持一致。
- 所有关键声明使用 <Claim> 组件标注验证方式（EXHIBIT 体系）。
- 文案红线与简历一致：第一人称、具体名词、真实数字；
  禁用"赋能/打造/极致/引领"类词；禁止泛 AI 紫色渐变。
- T0（OG 卡片）优先于一切站内新模块。
```

## 7. 待用户拍板

- [ ] 是否接受取消全站 Mode 切换，改为卡片两层结构？
- [ ] 是否同意 trace 走"真实导出回放"路线（需要开放 ReflexLearn / OpenClaw 日志导出）？
- [ ] Debug Case #2 选 agentTaskMemory 还是图搜话术？
- [ ] T0 的 OG 卡片定位文案一句话（建议沿用简历定位）。
- [ ] 是否本轮就进入 T0 + T1 开发？
