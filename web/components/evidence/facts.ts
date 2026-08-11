/**
 * 全站数字的唯一事实源。
 *
 * 规则（见 discuss/portfolio-evidence-dev-plan.md §3）：
 * - 任何组件展示硬数字一律从这里引用，禁止散落字面量；
 * - 这里的值必须与简历 PDF（简洁版v2）逐项一致，改简历先改这里；
 * - 每个数字必须带 verify：它怎么被验证，面试官追问时的答案。
 */

export type Fact = {
  /** 展示值 */
  value: string;
  /** 中文标签 */
  label: string;
  /** 英文短标签（Hero 统计区用） */
  labelEn: string;
  /** 验证方式：这个数字怎么来的、如何复核 */
  verify: string;
};

export const FACTS = {
  reidMap: {
    value: "91.61%",
    label: "ReID mAP（达标线 ≥91.5%）",
    labelEn: "ReID mAP Achieved",
    verify: "赛题官方评测脚本在测试集上的输出，论文与平台数据一致",
  },
  reidRank1: {
    value: "94.40%",
    label: "Rank-1（达标线 ≥94.0%）",
    labelEn: "Rank-1 Accuracy",
    verify: "与 mAP 同一次官方评测输出",
  },
  featureLatency: {
    value: "~35ms",
    label: "单张特征提取（要求 ≤40ms）",
    labelEn: "Feature Extraction",
    verify: "FastAPI 服务端推理计时（GPU），多次取均值",
  },
  matchLatency: {
    value: "11ms",
    label: "特征匹配（要求 ≤30ms）",
    labelEn: "Matching Latency",
    verify: "特征预提取入库后，查询阶段相似度计算计时",
  },
  modulesShipped: {
    value: "12+",
    label: "上线业务模块",
    labelEn: "Modules Shipped",
    verify: "前后端模块清单、接口路由与真实系统操作录屏",
  },
  techAwards: {
    value: "6+",
    label: "技术类获奖",
    labelEn: "Tech Awards Won",
    verify: "证书原件，荣誉区列明",
  },
  openclawSurface: {
    value: "13 + 10+",
    label: "OpenClaw 静态适配器 + Manifest 页面",
    labelEn: "Agent-Operable Pages",
    verify: "仓库 ai-agent/manifests/ 目录与适配器注册表",
  },
  pipelineChains: {
    value: "4",
    label: "跨页 Pipeline Chain 流水线",
    labelEn: "Pipeline Chains",
    verify: "一句话触发的多页连续操作，有完整执行 trace",
  },
} as const satisfies Record<string, Fact>;

export type FactKey = keyof typeof FACTS;
