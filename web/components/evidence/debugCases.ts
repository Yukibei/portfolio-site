import type { EvidenceAsset } from "./caseStudies";

/**
 * Debug Case：工程复盘数据。
 * 选题标准：必须来自三个核心项目的真实修复（不用个人站自身的案例），
 * 有递进/反转的叙事结构，有量化验证。
 * 当前阵容：Case01 智瞳篮途（CV/几何）+ Case02 OpenClaw（Agent 状态），覆盖两大项目。
 */

export type DebugCase = {
  id: string;
  title: string;
  tag: string;
  system: string;
  symptom: string;
  /** 根因递进：badge 标注调查进度，驱动 LAYER 卡视觉；最后一项自动高亮 */
  rootCauses: { badge: string; name: string; explain: string; outcome: string }[];
  options: { name: string; verdict: "chosen" | "rejected"; reason: string }[];
  verification: { method: string; evidence: string }[];
  takeaway: string;
  assets: EvidenceAsset[];
};

export const DEBUG_CASES: DebugCase[] = [
  {
    id: "court-homography",
    title: "球员站在了球场外：Homography 的外推陷阱",
    tag: "计算机视觉 / 几何标定",
    system: "智瞳篮途的球场校准链路（球场关键点检测 → Homography 标定 → 战术小地图）",
    symptom:
      "战术小地图上，球员被画到了球场外——脚部坐标映射出 court(-7.03) 这样的负值。关键点检测没报错，单应矩阵也算得出来，每一步看起来都在工作，但最终答案物理上不可能。",
    rootCauses: [
      {
        badge: "Root 01 · 信息丢失",
        name: "关键点的身份被扔掉了",
        explain:
          "检测器明明输出了「这是哪个点」（带 ID 的 33 类球场关键点），旧校准流程却只保留坐标、丢弃 ID，再用启发式规则反过来猜 4 个角点。",
        outcome: "把 ID 保住就能修好？不止——就算角点全猜对，映射还是崩。问题在更深的几何层。",
      },
      {
        badge: "Root 02 · 几何真相",
        name: "Homography 在它没见过的区域作答",
        explain:
          "那一帧 6 个可见关键点全挤在画面上半部（y≤316），而球员在下半部（y≥490）——单应变换在标定点覆盖区之外是外推，误差随距离急剧放大，直接给出负坐标。",
        outcome: "修法不是调参，是让标定点覆盖全场：用语义 ID 找回每个关键点的真实世界坐标。",
      },
    ],
    options: [
      {
        name: "修补启发式：给角点估算规则加更多特判",
        verdict: "rejected",
        reason:
          "仍是 4 点半场标定，外推问题原封不动；规则越堆越脆，下一个机位角度就会出新 case。",
      },
      {
        name: "语义关键点映射：保留检测 ID → 33 点 NBA 全场坐标表 → N 点 RANSAC 标定",
        verdict: "chosen",
        reason:
          "标定点从 4 个猜测角点变成最多 33 个语义点：覆盖广了、外推变内插，RANSAC 还能自动剔除坏点；坐标系同步升级为全场 28.65m × 15.24m。",
      },
    ],
    verification: [
      {
        method: "症状点回归",
        evidence: "foot(640,490)：修复前 court(8.15, -7.03) → 修复后 court(14.28, 10.90)",
      },
      {
        method: "标定质量指标",
        evidence: "6 个可见关键点，inlier_ratio = 1.0，重投影误差 0.27",
      },
      {
        method: "全位置回归",
        evidence: "全部测试位置映射进球场边界，负坐标不再出现",
      },
    ],
    takeaway:
      "模型只在数据覆盖的地方可信。Homography 没有算错，是被要求在它没见过的区域作答——把覆盖补上，比给错误答案打补丁有效得多。",
    assets: [
      {
        kind: "diagram",
        status: "placeholder",
        caption: "修复前后小地图对比（负坐标幽灵球员 vs 正确落位）",
      },
    ],
  },
  {
    id: "agent-task-memory",
    title: "Agent 结果串台：上一次任务的摘要污染下一次运行",
    tag: "Agent 状态管理",
    system: "OpenClaw App 端小龙虾 Agent 的任务记忆（agentTaskMemory）",
    symptom:
      "连续执行两个不同任务时，第二个任务的结果卡片偶发先闪现上一个任务的摘要——用户视角是「AI 答非所问了一瞬间」。偶发、难复现，但每次出现都在消耗用户对 Agent 的信任。",
    rootCauses: [
      {
        badge: "Root 01 · 状态残留",
        name: "lastResultSummary 只写不清",
        explain:
          "任务结束时写入结果摘要，但新任务启动时没人负责清除——残留数据一直躺在那里等着被误读。",
        outcome: "确认残留存在，但为什么只是偶发？还有第二个因素。",
      },
      {
        badge: "Root 02 · 时序竞态",
        name: "读取先于写入到达",
        explain:
          "「启动任务」和「读取摘要」分属两条链路，先后顺序不被保证——只要残留存在，竞态就偶发命中，这正是它难复现的原因。",
        outcome: "两个根因叠加才发病：残留是弹药，竞态是扳机。修任何一个都能止血，修哪个更对？",
      },
    ],
    options: [
      {
        name: "读侧修：所有读取点校验摘要的归属任务 ID",
        verdict: "rejected",
        reason: "读取点会持续增加，每个新读取点都要记得校验——把一个 bug 变成一类 bug。",
      },
      {
        name: "写侧修：startTaskRun 统一清场，新任务启动即清残留",
        verdict: "chosen",
        reason: "单点修复：生命周期起点负责归零，读取方永远只可能读到空或本轮结果。",
      },
    ],
    verification: [
      {
        method: "连续任务实测",
        evidence: "连续派发两个不同任务，结果卡片不再出现上一轮摘要",
      },
      {
        method: "执行轨迹检查",
        evidence: "trace 确认 startTaskRun 清场动作先于首次读取",
      },
    ],
    takeaway:
      "Agent 这类长生命周期系统，状态要「谁启动谁清场」——把清理责任固定在生命周期锚点上，而不是散落在每个使用方。",
    assets: [],
  },
];
