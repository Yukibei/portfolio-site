/**
 * AI in Action：AI 实践展示区数据。
 * 设计原则（GSAP 借鉴）：show, don't tell——录屏是主角，文字只做引导；
 * 每条配贴纸标签（橙色，微旋转）。素材未到位时演示位用占位框架。
 */

export type AiPractice = {
  id: string;
  /** 贴纸标签文案（英文短句，橙底黑字） */
  sticker: string;
  title: string;
  desc: string;
  /** 等宽小字数据行 */
  stat: string;
  stack: string;
  video: {
    src: string;
    poster: string;
    caption: string;
  };
};

export const AI_PRACTICES: AiPractice[] = [
  {
    id: "hoop-pupil-demo",
    sticker: "ReID system demo",
    title: "智瞳篮途：从检索到业务闭环",
    desc: "把篮球持球人 ReID 做成可操作系统：上传素材、发起识别、查看结果、进入业务页面。这里展示的是项目真实录屏，不再是占位骨架。",
    stat: "mAP 91.61% · Rank-1 94.52% · FastAPI + Spring Boot 联调",
    stack: "Vue 3 / Spring Boot / FastAPI / PyTorch",
    video: {
      src: "/projects/hp-demo.mp4",
      poster: "/projects/hp-demo-poster.jpg",
      caption: "Hoop Pupil 产品演示 · 自动播放",
    },
  },
  {
    id: "crayfish-agent",
    sticker: "AI operator",
    title: "OpenClaw：一句话驱动 App 操作",
    desc: "移动端全局悬浮 Agent：意图分类、能力目录、受控执行串起来。它不是聊天窗口，而是能进入页面、执行动作、等待结果并留下轨迹的操作层。",
    stat: "11 种受控动作 · 风险分级 · 执行轨迹可追溯",
    stack: "TypeScript / uni-app / Agent Runner / Capability Catalog",
    video: {
      src: "/projects/oc-demo.mp4",
      poster: "/projects/oc-demo-poster.jpg",
      caption: "OpenClaw 小龙虾操作录屏 · 自动播放",
    },
  },
  {
    id: "reflexlearn-demo",
    sticker: "Agentic learning",
    title: "ReflexLearn：多智能体学习闭环",
    desc: "规划、生成、评价、反思记忆以状态图编排，学习任务不是一次问答，而是一条可回放、可调整、能沉淀画像的长期链路。",
    stat: "LangGraph 状态图 · 向量召回 · SSE 流式输出",
    stack: "Python / LangGraph / Qdrant / Neo4j / PostgreSQL",
    video: {
      src: "/projects/rl-demo.mp4",
      poster: "/projects/rl-demo-poster.jpg",
      caption: "ReflexLearn 产品走查录屏 · 自动播放",
    },
  },
];
