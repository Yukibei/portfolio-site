# 个人网站能力证据化升级计划

> 状态：讨论稿  
> 目标读者：你、后续接手创新的 Claude、未来实现者  
> 核心原则：网站不是“好看的简历”，而是“可被追问、可被验证、可展示工程判断的面试现场”。

## 1. 目标定位

当前网站已经完成了强视觉基础：首屏视频、一路走来照片带、项目卡、实习经历、3D 工作证、荣誉技能。下一阶段不应该继续堆装饰，而要把内容升级为“能力证据系统”。

最终目标：

- 让 HR 在 30 秒内确认：这是 AI 应用 / 全栈方向候选人，有真实项目和实习现场。
- 让技术面试官在 3 到 5 分钟内看到：你能解释问题、拆解方案、做技术取舍、验证结果。
- 让网站本身成为作品：包含交互、性能、质量验证、debug case、AI Agent 思维展示。
- 给 Claude 二次创新留下空间，但锁定底层叙事逻辑，避免改成只有炫技没有证据。

## 2. 当前基础与约束

### 已有页面结构

```text
Home
├── HeroSection          首屏定位 + 背景视频 + CTA
├── JourneyMarquee      一路走来照片带
├── About               自我定位
├── Projects            三个精选项目
├── Experience          实习经历 + 现场照片 + 3D 工作证
├── SkillsHonors        技能与荣誉
└── SiteFooter          联系方式
```

### 必须保留的优势

- 首屏已有强记忆点，不要改成普通营销页。
- 工作证和现场照片已经形成“真实经历”的证据，不要弱化。
- 项目区已有三个核心项目：Hoop Pupil、ReflexLearn、OpenClaw，应作为能力证明主线。
- 黑色视觉基调、强排版、技术感可以保留。

### 代码与架构约束

- Next.js 15.4、React 19、Tailwind CSS v4。
- TypeScript 优先，避免 `any`。
- 动态语言文件尽量不超过 300 行。
- `web/components` 顶层文件数已超过 8 个，后续新增组件时应迁移到子目录，例如：

```text
web/components/
├── common/
├── sections/
├── evidence/
├── agent-demo/
└── lanyard/
```

这是当前代码结构里的一个坏味道：顶层组件继续增加会导致边界变差。建议下一轮开发顺手修，不建议再往顶层塞新组件。

## 3. 三种升级路线

### 方案 A：面试证据路线

核心：把网站变成结构化面试回答。

新增模块：

- Recruiter / Engineer Mode 切换
- 项目案例研究
- Debug Case
- Live Quality

优点：

- 最符合求职目标。
- 内容真实，容易经得起追问。
- 实现风险低，不依赖后端。

风险：

- 创意感不如 AI 控制台强。
- 需要认真打磨文案，否则容易像普通说明书。

### 方案 B：AI 产品展示路线

核心：让网站出现一个“AI Agent 控制台”模拟演示。

新增模块：

- Agent Console
- RAG / Tool Calling / Risk Control 流程动画
- 预设问题与模拟输出

优点：

- 新颖，差异化强。
- 能直观展示 AI 应用能力。
- 适合 Claude 进一步发挥交互创意。

风险：

- 如果做成假聊天框，会显得浅。
- 如果真接模型，成本、稳定性、隐私、部署都会变复杂。

### 方案 C：作品集系统路线

核心：把网站做成一个完整可验证系统。

新增模块：

- 项目详情页
- 素材库
- 架构图
- 质量报告
- 站内 AI 导览

优点：

- 长期价值最高。
- 适合做成个人品牌资产。

风险：

- 开发范围最大。
- 容易拖慢当前求职投递节奏。

### 推荐路线

先做 A + B 的精简组合：

```text
P1：Engineer / Recruiter Mode + 项目案例研究
P2：Debug Case + Live Quality
P3：AI Agent 控制台模拟演示
P4：真实 AI 导览助手或项目详情页扩展
```

理由：P1/P2 先增强可信度，P3 再增强新颖度。这样不会一上来就做一个复杂 AI 玩具，也不会让网站变成静态简历。

## 4. 目标信息架构

建议升级后的首页结构：

```text
Home
├── Hero
│   ├── 当前定位保留
│   └── 增加 Recruiter / Engineer Mode 入口
├── Journey
│   └── 照片带保留，后续可点击展开故事
├── About
│   └── 强化“我如何做 AI 产品”的方法论
├── Evidence Switch
│   ├── Recruiter View：项目、实习、荣誉、联系
│   └── Engineer View：架构、决策、指标、debug
├── Project Case Studies
│   ├── Hoop Pupil
│   ├── ReflexLearn
│   └── OpenClaw
├── Agent Console Demo
│   ├── 任务输入
│   ├── 规划过程
│   ├── RAG / Tool / Risk 步骤
│   └── 模拟输出
├── Debug Case
│   ├── 问题截图
│   ├── 根因分析
│   ├── 方案对比
│   └── 验证结果
├── Live Quality
│   ├── Build / Lint / Layout Check
│   ├── 性能预算
│   └── 可访问性检查
├── Skills & Honors
└── Contact
```

不建议一开始做多页路由。当前首页已经是强叙事单页，第一阶段应保持单页，避免内容分散。项目详情页可以作为 P4。

## 5. 核心模块设计

### 5.1 Recruiter / Engineer Mode

目的：同一套内容针对不同读者重排信息密度。

交互建议：

- 在 Hero 或 Projects 前加入一个小型 segmented control。
- 默认 `Recruiter`，因为大多数访问者先是快速浏览。
- 切到 `Engineer` 后，不改变整站主题，只展开更深证据层。

Recruiter Mode 展示重点：

- 你是谁
- 做过什么项目
- 有什么实习
- 有什么荣誉
- 如何联系

Engineer Mode 展示重点：

- 架构图
- 技术决策
- 指标与验证
- Debug Case
- 工程质量

实现边界：

- 不需要做完全两套页面。
- 使用同一数据源，通过 `mode` 控制显示粒度。
- 不要让切换导致布局大幅跳动。

压力测试：

- HR 不切模式，也能完成浏览。
- 技术面试官切 Engineer 后，能在 1 分钟内看到至少 3 个可追问点。
- 手机端模式切换不遮挡 Hero 和 CTA。

### 5.2 项目案例研究

当前项目卡展示了项目名、描述、指标、技术栈。下一步应升级为“面试回答结构”。

每个项目使用统一数据结构：

```ts
type CaseStudy = {
  id: string;
  name: string;
  oneLiner: string;
  role: string;
  problem: string;
  solution: string;
  architecture: ArchitectureNode[];
  decisions: TechnicalDecision[];
  metrics: Metric[];
  risks: RiskControl[];
  evidence: EvidenceAsset[];
};
```

展示结构：

```text
项目名
├── 一句话定位
├── 我的角色
├── 问题背景
├── 方案路径
├── 关键技术决策 3 条
├── 结果指标
└── 证据素材：截图 / 录屏 / 链接
```

三个项目各自重点：

- Hoop Pupil：算法服务化、ReID 指标、前后端闭环、上线交付。
- ReflexLearn：LangGraph 多智能体、RAG、反思记忆、SSE 流式。
- OpenClaw：跨端 Agent、风险分级、页面操作、Pipeline Chain。

压力测试：

- 每个项目必须回答“你本人做了什么”。
- 每个项目必须至少有一个指标或验证方式。
- 每个项目必须包含一个技术取舍，而不是只列技术栈。
- 不能写涉密内容，实习项目只写公开化能力与工程方法。

### 5.3 AI Agent 控制台模拟演示

目的：把“我会 Agent / RAG / 工具调用”做成可视化过程，而不是一句技术栈。

建议先做模拟，不接真实大模型。

示例交互：

```text
输入任务：帮我生成课程知识问答

Step 1 Intent        识别任务类型：课程问答
Step 2 Retrieve      检索课程文档片段
Step 3 Plan          生成回答结构
Step 4 Tool          调用引用定位工具
Step 5 Stream        流式生成回答
Step 6 Guardrail     检查置信度与引用
```

视觉建议：

- 左侧是任务输入和输出。
- 右侧是执行轨迹 timeline。
- 每个步骤有状态：idle / running / done / fallback。
- 不要做成普通聊天窗口；重点是“执行过程可解释”。

模拟数据建议：

- 预设 3 个任务：
  - RAG 课程问答
  - OpenClaw 页面操作
  - 项目风险评估

压力测试：

- 关闭 JS 动画后仍能读懂流程。
- 不能误导用户以为接入真实在线大模型。
- 每一步都要对应你真实会的技术，不写空泛概念。
- 运行时不能影响首屏性能，必须懒加载。

### 5.4 Debug Case

目的：展示真实问题解决能力，像面试中讲“我怎么定位和修复 bug”。

可以先选本站工作证问题作为案例。

结构：

```text
问题：拖拽后工作证被裁切 / 图层不符合预期
现象：截图对比
根因：容器裁切、z-index、canvas 舞台、指针事件透传
方案：从物理边界改为图层优先
验证：Playwright 截图、elementFromPoint、layout check
结果：工作证可覆盖文字但自身始终在最上层
```

这个案例非常适合你，因为它同时展示：

- UI 问题定位
- 交互层级判断
- SSR / hydration 噪声识别
- Playwright 验证
- 用户反馈驱动迭代

压力测试：

- 不要显得在暴露网站 bug，而是展示工程复盘。
- 必须包含“为什么不用物理边界”的解释。
- 必须包含验证证据，而不是“看起来好了”。

### 5.5 Live Quality

目的：展示工程质量和交付意识。

第一阶段可以静态展示最近一次验证结果：

```text
Quality Gate
├── lint: pass
├── build: pass
├── experience-layout: pass
├── responsive: desktop / wide checked
├── hydration: extension noise handled
└── performance budget: pending
```

后续可接入自动生成 JSON：

```text
scripts/
├── lint.sh
├── build.sh
├── verify-experience-layout.sh
└── verify-quality-report.sh
```

压力测试：

- 不能伪造 CI 状态。
- 如果是静态状态，要标注“latest local verification”。
- 如果接自动化，要确保失败状态能如实展示。

### 5.6 Journey 点击故事

当前照片带已经有现场感。下一步可以给部分照片增加故事卡片。

不要每张都写，先选 6 张：

- 起点工作室
- 第一个项目
- ICPC
- 讯飞工位
- 智学云团队
- 交控联调现场

每个故事只写 3 句话：

```text
当时的问题
我做的动作
这段经历留下的能力
```

压力测试：

- 不要变成长篇自传。
- 不要让照片带拖拽体验变复杂。
- 点击区域和拖拽行为不能冲突。

## 6. 视觉与交互原则

设计方向：Trust & Authority + Technical Evidence。

可用元素：

- 指标卡
- 架构节点图
- before/after 对比
- 执行 timeline
- 代码片段样式
- 验证状态徽标

避免元素：

- 泛 AI 紫色/粉色渐变
- 大量无意义粒子效果
- 空洞的“未来感”装饰
- 会盖住正文的持续动画
- 只能桌面看、手机崩掉的交互

动效原则：

- 每屏最多一个主动效。
- 所有复杂动效必须尊重 `prefers-reduced-motion`。
- Agent Console 的动画只表达状态，不做纯装饰。
- Debug Case 的 before/after 应该清楚，不要花哨。

## 7. 数据与组件架构建议

新增目录建议：

```text
web/
├── app/
│   └── home/
│       ├── constants.ts
│       ├── HeroSection.tsx
│       └── PortfolioNav.tsx
├── components/
│   ├── common/
│   │   ├── SectionShell.tsx
│   │   ├── MetricBadge.tsx
│   │   └── ModeSwitch.tsx
│   ├── sections/
│   │   ├── EvidenceModeSection.tsx
│   │   ├── CaseStudiesSection.tsx
│   │   ├── AgentConsoleSection.tsx
│   │   ├── DebugCaseSection.tsx
│   │   └── LiveQualitySection.tsx
│   ├── evidence/
│   │   ├── caseStudies.ts
│   │   ├── debugCases.ts
│   │   └── qualityReport.ts
│   └── lanyard/
└── public/
    ├── evidence/
    ├── debug/
    └── agent-demo/
```

边界：

- `evidence/*.ts` 放结构化内容，不把大段数据塞进组件。
- `sections/*.tsx` 只负责布局和交互。
- `common/*.tsx` 放可复用 UI。
- 不要让单个组件超过 300 行。

## 8. 分阶段实施计划

### P0：规格冻结

产物：

- 本计划文档。
- Claude 二次创新提示词。
- 明确验收标准。

不做：

- 不写业务代码。
- 不新增实际 UI。

### P1：信息架构与组件重组

目标：先把架构边界打好。

任务：

- 新建 `components/common`、`components/sections`、`components/evidence`。
- 将新增能力模块全部放入子目录。
- 保持现有页面视觉不破坏。
- 为 `CaseStudy`、`DebugCase`、`QualityGate` 建强类型数据结构。

验收：

- 顶层 `web/components` 文件数不继续增加。
- 新增文件每个尽量不超过 300 行。
- `lint`、`build` 通过。

### P2：Recruiter / Engineer Mode

目标：建立双受众浏览体验。

任务：

- 增加模式切换组件。
- 默认 Recruiter。
- Engineer 模式展开技术证据层。
- 模式状态只在客户端保存，不影响 SSR 稳定。

验收：

- 不产生 hydration mismatch。
- 手机端可用。
- 不切模式也能完整浏览。

### P3：项目案例研究

目标：把项目卡升级成可追问的案例研究。

任务：

- 编写三个项目的数据。
- 每个项目增加技术决策、指标、证据素材。
- 保留当前视觉强卡片，但增加展开详情。

验收：

- 每个项目至少 3 个可追问点。
- 每个项目至少 1 个指标或验证方式。
- 不使用涉密内容。

### P4：Agent Console Demo

目标：用模拟执行流展示 AI 应用能力。

任务：

- 创建静态模拟数据。
- 实现步骤执行动画。
- 支持 3 个预设任务。
- 明确标注为 interactive demo / simulated trace。

验收：

- 不接真实 API。
- 首屏不加载重资源。
- 动效可关闭或降级。

### P5：Debug Case + Live Quality

目标：展示问题解决能力和交付质量。

任务：

- 用工作证问题做第一个 Debug Case。
- 引入 before/after 截图。
- 增加质量门禁展示。
- 后续可接 JSON 报告。

验收：

- Debug Case 像工程复盘，不像问题暴露。
- Quality 状态真实，不伪造。
- Playwright 截图验证关键交互。

### P6：Journey 故事化

目标：让照片带承担更多个人叙事。

任务：

- 选 6 张关键照片。
- 写短故事。
- 解决拖拽与点击冲突。

验收：

- 拖拽体验不退化。
- 每个故事不超过 80 字。

## 9. 压力测试矩阵

### 叙事压力测试

| 问题 | 通过标准 |
| --- | --- |
| HR 30 秒能否知道你是谁？ | Hero + Recruiter 默认路径明确 |
| 技术面试官能否追问？ | 每个核心项目有技术决策和验证 |
| 是否像简历复述？ | 有问题、方案、取舍、结果 |
| 是否过度炫技？ | 每个交互都有叙事目的 |

### 工程压力测试

| 问题 | 通过标准 |
| --- | --- |
| 首屏性能是否受影响？ | Agent Console 懒加载 |
| SSR 是否稳定？ | 不用随机数/时间直接参与首屏渲染 |
| 动画是否可降级？ | 支持 `prefers-reduced-motion` |
| 代码是否可维护？ | 数据与组件分离，文件不过长 |

### 内容压力测试

| 问题 | 通过标准 |
| --- | --- |
| 是否有夸大？ | 所有指标可解释 |
| 是否涉密？ | 实习内容只写公开能力与方法 |
| 是否有证据？ | 截图、录屏、验证命令、指标至少一种 |
| 是否便于 Claude 创新？ | 锁定目标，不锁死具体视觉实现 |

### 移动端压力测试

| 问题 | 通过标准 |
| --- | --- |
| 模式切换是否可点？ | 375px 宽度不遮挡 |
| Agent Console 是否拥挤？ | 小屏改为纵向步骤 |
| Debug before/after 是否可读？ | 支持横向滑动或上下对比 |
| 3D 工作证是否影响操作？ | 移动端继续隐藏或降级 |

## 10. Claude 二次创新提示词

可以把下面这段直接交给 Claude：

```text
你将基于一个 Next.js 15 + React 19 + Tailwind v4 的个人作品集网站继续创新设计。

目标不是做普通简历页，而是把网站升级成“能力证据系统”：
1. HR 能快速确认候选人的 AI 应用 / 全栈能力。
2. 技术面试官能看到项目架构、技术决策、debug 复盘和验证方式。
3. 网站本身要体现工程质量和产品意识。

请基于 discuss/portfolio-evidence-upgrade-plan.md 继续深化。

必须保留的方向：
- Trust & Authority + Technical Evidence。
- 不要做泛 AI 紫色渐变。
- 不要为了炫技牺牲可读性。
- 每个新交互必须回答“它证明了什么能力”。
- Recruiter / Engineer Mode 是核心交互之一。
- 项目区要升级为案例研究。
- Agent Console 先做模拟执行流，不接真实模型。
- Debug Case 优先使用本站工作证图层/拖拽问题。

工程约束：
- Next.js 15.4、React 19、Tailwind v4。
- TypeScript 优先，避免 any。
- 单文件尽量不超过 300 行。
- 新组件不要继续堆在 web/components 顶层，使用 common/sections/evidence 等子目录。
- 所有 Run & Debug 通过 scripts/*.sh。

请先输出创新方案与分阶段任务，不要直接写代码。
```

## 11. 最小可行版本建议

如果只做一轮，建议范围控制为：

```text
1. Recruiter / Engineer Mode
2. Project Case Studies 数据结构 + 展开层
3. Debug Case：工作证问题复盘
```

暂缓：

- 真实 AI 导览助手。
- 多页项目详情。
- 自动质量报告生成。
- Journey 每张照片故事化。

理由：这三个模块已经能显著改变网站定位，而且风险可控。

## 12. 开发前检查清单

进入开发前必须确认：

- [ ] 是否接受推荐路线：A + B 精简组合。
- [ ] 是否先做最小可行版本。
- [ ] 是否允许重组 `web/components` 目录。
- [ ] 是否准备项目截图 / 架构图 / before-after 截图。
- [ ] 是否需要 Claude 先基于本计划做视觉创新稿。
- [ ] 是否要走 `.spec-workflow` 的正式 Requirements / Design / Tasks 审批流程。

