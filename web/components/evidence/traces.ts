/**
 * Agent 执行轨迹数据（TracePlayer 回放用）。
 *
 * 真实性口径（重要，文案不得过度声称）：
 * - ReflexLearn：节点名与执行顺序取自 LangGraph 图定义
 *   （multagent/src/reflexlearn/orchestration/graph.py），
 *   降级行为与日志字段取自实际运行日志 logs/api.log（2026-06），
 *   文案经脱敏转写，回放时长按比例压缩。
 * - OpenClaw：动作类型与状态机取自 mobile-agent 真实代码
 *   （actionTypes.ts 的 MobileAgentActionKind / mobileAgentTrace.ts 的 TraceItem），
 *   流程为 pipeline 全链路分析的脱敏转写。
 * - 已过脱敏清单：无内部域名/IP、无 token、无真实用户数据。
 */

export type TraceStepStatus = "done" | "fallback" | "confirm";

export type TraceStep = {
  /** 步骤标识：必须使用真实系统里的节点名 / 动作名，禁止虚构 */
  step: string;
  label: string;
  status: TraceStepStatus;
  /** 回放时长 ms（按真实比例压缩后的演示节奏） */
  durMs: number;
  summary: string;
  /** 展开层：引用真实日志字段或行为细节 */
  detail?: string;
};

export type AgentTrace = {
  id: string;
  title: string;
  task: string;
  output: string;
  /** 来源与口径声明，UI 必须展示 */
  sourceNote: string;
  steps: TraceStep[];
};

export const TRACES: Record<string, AgentTrace> = {
  "reflexlearn-learning-task": {
    id: "reflexlearn-learning-task",
    title: "一次学习资源生成任务的完整执行",
    task: "为学习者生成一份针对薄弱点的讲解文档",
    output:
      "输出讲解文档一份（质量门禁 passed）；学习路径以规则策略生成——LLM 通道当时不可用，系统按设计降级而非失败。",
    sourceNote:
      "节点名与顺序取自 LangGraph 图定义；降级与日志字段取自 2026-06 实际运行日志，脱敏转写，时长压缩。",
    steps: [
      {
        step: "profile",
        label: "学习者画像",
        status: "done",
        durMs: 900,
        summary: "载入跨会话学习者画像：薄弱知识点与历史偏好",
        detail: "图入口：START → profile。画像来自长期记忆，不靠拼接历史对话。",
      },
      {
        step: "recall",
        label: "记忆召回",
        status: "done",
        durMs: 1100,
        summary: "召回与本次任务相关的错题与反思记录",
        detail: "profile → recall → planner。向量召回 + 知识图谱两路检索。",
      },
      {
        step: "planner",
        label: "任务规划",
        status: "done",
        durMs: 1300,
        summary: "生成执行计划 plan_size=1，路由到协作流水线",
        detail:
          "条件边 dispatch_route: planner → [generate_resource | pipeline]，本次命中 pipeline。",
      },
      {
        step: "pipeline.generation",
        label: "内容生成",
        status: "done",
        durMs: 2200,
        summary: "doc_gen 技能生成讲解文档（task_id=s1 type=doc）",
        detail:
          "日志原样字段：pipeline_diag stage=generation_end status=ok task_id=s1 type=doc step=1 retry=1 skill=doc_gen",
      },
      {
        step: "pipeline.quality",
        label: "质量检查",
        status: "done",
        durMs: 1400,
        summary: "生成结果过质量检查：passed",
        detail:
          "日志原样字段：pipeline_diag stage=quality_end status=passed task_id=s1 step=1 retry=1 fixable=true。不过关会带反馈回流重生成。",
      },
      {
        step: "gate",
        label: "质量门禁",
        status: "done",
        durMs: 800,
        summary: "门禁判定通过，进入反思阶段",
        detail: "条件边：gate 不过会路由回 critic → planner 重新规划。",
      },
      {
        step: "metacognition",
        label: "元认知反思",
        status: "done",
        durMs: 1200,
        summary: "对产出做自我评审：candidates=1 reviews=1 refine=0",
        detail:
          "日志原样字段：metacognition_diag duration_ms=8 candidates=1 reviews=1 refine=0。refine>0 时会路由回 generate_resource。",
      },
      {
        step: "assemble",
        label: "结果组装",
        status: "done",
        durMs: 700,
        summary: "组装最终输出与引用",
      },
      {
        step: "path_plan",
        label: "学习路径规划",
        status: "fallback",
        durMs: 1000,
        summary: "LLM 通道不可用 → 按设计降级为规则策略",
        detail:
          "日志原文：path_plan degraded (no api key) -> rule based。降级路径是显式设计：LLM 失败不阻断主流程。",
      },
    ],
  },
  "openclaw-pipeline-analysis": {
    id: "openclaw-pipeline-analysis",
    title: "一句话触发的跨页分析流水线",
    task: "「识别这张图里的球员，并生成对标分析报告」",
    output:
      "识别结果（编号球员 + 置信度）已生成对标报告；生成动作属中风险，按策略先征求用户确认后继续。",
    sourceNote:
      "动作类型与状态机取自 mobile-agent 真实代码（MobileAgentActionKind / TraceItem），流程为 pipeline 全链路的脱敏转写。",
    steps: [
      {
        step: "observe_page",
        label: "读取页面能力",
        status: "done",
        durMs: 800,
        summary: "读取当前页面 Manifest：AI 只能调用页面声明过的动作",
        detail:
          "声明式能力面（onUpload / onTriggerButton / onSetField），不做 DOM 自由探索。",
      },
      {
        step: "navigate",
        label: "跳转识别页",
        status: "done",
        durMs: 900,
        summary: "低风险动作，按 riskPolicy 自动执行",
        detail: "risk=low → 直接执行；trace 记录 startedAt/endedAt 与 result.status。",
      },
      {
        step: "upload_user_asset",
        label: "注入用户图片",
        status: "done",
        durMs: 1300,
        summary: "把用户附件以资源 bundle 注入上传组件",
        detail: "附件经由路由参数携带的 bundle 机制进入页面，不经第三方中转。",
      },
      {
        step: "trigger_button",
        label: "触发识别",
        status: "done",
        durMs: 1000,
        summary: "触发图搜识别动作",
      },
      {
        step: "wait_for_result",
        label: "等待任务完成",
        status: "done",
        durMs: 2000,
        summary: "轮询识别任务直到完成",
        detail: "长任务异步轮询；超时与失败路径会以 failed/blocked 状态进入 trace。",
      },
      {
        step: "read_result_summary",
        label: "读取结果摘要",
        status: "done",
        durMs: 900,
        summary: "读取识别结果：编号球员与置信度",
        detail:
          "低置信度时话术会显式提示不确定性（产品决策：不假装确定）。",
      },
      {
        step: "trigger_button",
        label: "生成对标报告",
        status: "confirm",
        durMs: 1500,
        summary: "中风险动作 → 弹出确认卡，用户点头后继续",
        detail:
          "riskPolicy：low 自动 / medium 确认（status=confirming）/ high 阻断转人工。信任优先于全自动。",
      },
      {
        step: "complete_task",
        label: "完成并汇报",
        status: "done",
        durMs: 700,
        summary: "汇总执行轨迹，生成可读的任务结果摘要",
        detail:
          "TraceItem { step, action.kind, result.status, startedAt, endedAt } 全程留痕。",
      },
    ],
  },
};
