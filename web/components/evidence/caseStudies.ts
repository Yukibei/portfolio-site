import { FACTS } from "./facts";

/**
 * 项目案例研究数据（卡片正面 + 工程细节浮层共用一份数据源）。
 *
 * 文案红线（见 dev-plan §5）：第一人称、具体名词、真实数字；
 * 每条技术决策必须是"为什么不用 X 而用 Y"；不写涉密内容。
 */

export type EvidenceAsset = {
  kind: "screenshot" | "video" | "trace" | "link" | "diagram";
  /** placeholder = 素材未到位，UI 优雅降级；补料后改 ready 即点亮 */
  status: "ready" | "placeholder";
  src?: string;
  /** kind=video 时的封面图 */
  poster?: string;
  /** kind=trace 时指向 traces.ts 里的 AgentTrace id */
  traceId?: string;
  caption: string;
};

export type TechnicalDecision = {
  title: string;
  choice: string;
  insteadOf: string;
  why: string;
};

export type CaseMetric = {
  label: string;
  value: string;
  verify: string;
};

export type CaseStudy = {
  /** 稳定深链锚点：/#case-{id} 直达工程细节浮层 */
  id: string;
  no: string;
  name: string;
  zh: string;
  oneLiner: string;
  metricsLine: string;
  stackLine: string;
  href: string | null;
  linkLabel: string;
  images: { a: string; b: string; tall: string };
  role: string;
  problem: string;
  approach: string;
  decisions: TechnicalDecision[];
  metrics: CaseMetric[];
  evidence: EvidenceAsset[];
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "hoop-pupil",
    no: "01",
    name: "Hoop Pupil",
    zh: "智瞳篮途",
    oneLiner:
      "篮球持球人重识别（ReID）平台 — 从算法服务化到前后端交付的完整闭环。",
    metricsLine: `mAP ${FACTS.reidMap.value} · Rank-1 ${FACTS.reidRank1.value} · ${FACTS.modulesShipped.value} 业务模块`,
    stackLine: "Vue 3 · Spring Boot · FastAPI · PyTorch · MySQL · Redis",
    href: null,
    linkLabel: "案例可验证",
    images: {
      a: "/projects/hp-a.png",
      b: "/projects/hp-b.png",
      tall: "/projects/hp-tall.png",
    },
    role: "负责 ReID 算法选型调优、算法服务化（FastAPI），以及与 Java 后端 / Vue 前端的联调交付。",
    problem:
      "篮球场景下跨镜头识别持球人：姿态剧烈变化、频繁遮挡、队服高度相似。赛题硬指标：mAP ≥91.5%、Rank-1 ≥94.0%，且特征提取 ≤40ms、匹配 ≤30ms——精度和延迟都不能让。",
    approach:
      "以 TransReID 为骨干做场景化微调，把算法独立成 Python 推理服务，与 Java 业务后端通过接口解耦；特征离线入库，查询只算相似度。",
    decisions: [
      {
        title: "骨干模型",
        choice: "TransReID（ViT 系，patch 级局部特征）",
        insteadOf: "ResNet 系 CNN baseline",
        why: "篮球场景的遮挡和姿态变化让全局特征不稳，ViT 的 patch 级表征对局部可见区域更鲁棒；微调后 mAP 达 91.61%，过达标线。",
      },
      {
        title: "服务形态",
        choice: "算法独立为 FastAPI 推理服务",
        insteadOf: "把模型嵌进 Java 后端进程",
        why: "PyTorch/GPU 生态在 Python 侧，业务在 Java 侧；进程级解耦让两边独立部署、独立扩缩，算法迭代不动业务发布。",
      },
      {
        title: "延迟路径",
        choice: "特征预提取入库，查询阶段只算相似度",
        insteadOf: "查询时对底库全量重新提特征",
        why: "把重计算挪到入库时刻，查询只剩矩阵相似度——匹配 11ms，远低于 30ms 要求，底库增长也不拖慢查询。",
      },
    ],
    metrics: [
      { label: "mAP", value: FACTS.reidMap.value, verify: FACTS.reidMap.verify },
      { label: "Rank-1", value: FACTS.reidRank1.value, verify: FACTS.reidRank1.verify },
      {
        label: "特征提取",
        value: FACTS.featureLatency.value,
        verify: FACTS.featureLatency.verify,
      },
      {
        label: "匹配延迟",
        value: FACTS.matchLatency.value,
        verify: FACTS.matchLatency.verify,
      },
      {
        label: "上线模块",
        value: FACTS.modulesShipped.value,
        verify: FACTS.modulesShipped.verify,
      },
    ],
    evidence: [
      {
        kind: "screenshot",
        status: "ready",
        src: "/projects/hp-a.png",
        caption: "场馆预约与球场详情：真实业务页面截图",
      },
      {
        kind: "video",
        status: "ready",
        src: "/projects/hp-demo.mp4",
        poster: "/projects/hp-demo-poster.jpg",
        caption: "Hoop Pupil 产品操作录屏（真实系统录制）",
      },
      {
        kind: "screenshot",
        status: "ready",
        src: "/projects/hp-tall.png",
        caption: "训练模式、实时排行与业务工作台：真实系统截图",
      },
    ],
  },
  {
    id: "reflexlearn",
    no: "02",
    name: "ReflexLearn",
    zh: "反思学习",
    oneLiner:
      "基于 LangGraph 的多智能体个性化学习系统 — 规划、生成、评价与反思记忆的闭环，SSE 流式输出。",
    metricsLine: "多智能体编排 · 向量召回 · 知识图谱",
    stackLine: "Python · LangGraph · LiteLLM · Qdrant · Neo4j · PostgreSQL",
    href: null,
    linkLabel: "案例可验证",
    images: {
      a: "/projects/rl-a.png",
      b: "/projects/rl-b.png",
      tall: "/projects/rl-tall.png",
    },
    role: "独立设计并实现多智能体架构：状态图编排、反思记忆、检索与流式输出链路。",
    problem:
      "个性化学习不是一次问答：系统要记住学习者哪里薄弱、上次讲过什么、什么讲法有效。单次 LLM 调用既无法保持长期画像，也无法对自己的输出做质量把关。",
    approach:
      "用 LangGraph 把「规划 → 生成 → 评价 → 反思」做成显式状态图，评价不过关就带反馈回流重生成；学习者画像沉淀为跨会话记忆，检索走向量召回 + 知识图谱两路。",
    decisions: [
      {
        title: "编排方式",
        choice: "LangGraph 显式状态图",
        insteadOf: "自由循环的 ReAct 单体 Agent",
        why: "教学流程需要确定性的环节边界：每步可控、可中断、失败可定位到具体节点，执行轨迹天然可导出回放——这也是本站 trace 回放的数据来源。",
      },
      {
        title: "记忆设计",
        choice: "分层记忆：会话内状态 + 跨会话学习者画像（向量化沉淀）",
        insteadOf: "把历史对话无限拼进上下文窗口",
        why: "拼上下文的成本随轮次线性涨且很快超窗；画像化沉淀让第 N 次会话直接以「他薄弱点是 X」开场，而不是重新摸底。",
      },
      {
        title: "输出链路",
        choice: "SSE 流式输出",
        insteadOf: "同步等待完整生成",
        why: "多智能体串行链路总时延不可避免地长，流式把「首字可见」提前到秒级，等待感知完全不同。",
      },
    ],
    metrics: [
      {
        label: "角色闭环",
        value: "规划 / 生成 / 评价 / 反思",
        verify: "LangGraph 状态图定义与节点代码",
      },
      {
        label: "检索通路",
        value: "向量召回 + 知识图谱",
        verify: "Qdrant 集合与 Neo4j 图谱 schema",
      },
    ],
    evidence: [
      {
        kind: "trace",
        status: "ready",
        traceId: "reflexlearn-learning-task",
        caption: "一次学习任务的执行轨迹回放（取自真实运行日志）",
      },
      {
        kind: "video",
        status: "ready",
        src: "/projects/rl-demo.mp4",
        poster: "/projects/rl-demo-poster.jpg",
        caption: "ReflexLearn 产品操作走查录屏（真实系统录制）",
      },
    ],
  },
  {
    id: "openclaw",
    no: "03",
    name: "OpenClaw",
    zh: "AI 管家",
    oneLiner:
      "跨 Web 与 App 的 AI 管家体系 — 一句话驱动页面操作与跨页流水线，按风险分级执行。",
    metricsLine: `${FACTS.openclawSurface.value} 可操作页面 · ${FACTS.pipelineChains.value} 条 Pipeline Chain`,
    stackLine: "TypeScript · uni-app · Agent Runner · 风险分级",
    href: null,
    linkLabel: "案例可验证",
    images: {
      a: "/projects/oc-a.png",
      b: "/projects/oc-b.png",
      tall: "/projects/oc-tall.png",
    },
    role: "设计并实现 Web 端 Manifest 体系与 App 端受控自动化链路（意图分类 → 能力目录 → 执行器）。",
    problem:
      "让 AI 替用户操作一个 12+ 模块的真实业务系统，最大的问题不是「能不能点」，而是「敢不敢让它点」：误操作、不可解释、出错无法兜底，任何一条都足以让用户关掉它。",
    approach:
      "页面用 Manifest 声明自己能被 AI 做什么，AI 只能调用声明过的动作；执行按风险分级，全程留 trace；App 端按移动端约束另建受控链路，而不是移植 Web 方案。",
    decisions: [
      {
        title: "页面能力接口",
        choice: "Manifest 声明式动作（onUpload / onTriggerButton / onSetField）",
        insteadOf: "让 AI 自由探索和操作 DOM",
        why: "自由探索不可枚举也就不可测试；声明式把能力面收敛成白名单，每个动作可单测，页面改版只需同步 Manifest。",
      },
      {
        title: "执行策略",
        choice: "风险分级：低风险自动执行、中风险确认后继续、高风险阻断转人工",
        insteadOf: "全自动执行所有指令",
        why: "「全自动」在 demo 里好看，在真实系统里等于把删除、支付类操作交给概率模型。分级让用户保留最终控制权，信任是这类产品的第一指标。",
      },
      {
        title: "跨端架构",
        choice: "App 端独立链路：intent → capability catalog → runner → executor",
        insteadOf: "把 Web Manifest 方案直接移植到 App",
        why: "移动端拿不到 Web 那样的页面注入能力，强行移植只会得到残缺版；按端的真实能力边界设计，以受控自动化 + 路由跳转交接为主。",
      },
    ],
    metrics: [
      {
        label: "可操作页面",
        value: FACTS.openclawSurface.value,
        verify: FACTS.openclawSurface.verify,
      },
      {
        label: "Pipeline Chain",
        value: FACTS.pipelineChains.value,
        verify: FACTS.pipelineChains.verify,
      },
    ],
    evidence: [
      {
        kind: "trace",
        status: "ready",
        traceId: "openclaw-pipeline-analysis",
        caption: "Pipeline 全链路分析的执行轨迹回放（动作与状态机取自真实代码）",
      },
      {
        kind: "video",
        status: "ready",
        src: "/projects/oc-demo.mp4",
        poster: "/projects/oc-demo-poster.jpg",
        caption: "OpenClaw 小龙虾一句话操作录屏（真实系统录制）",
      },
    ],
  },
];
