import {
  MODEL_GATEWAY_SERVICE,
  type ServiceEntry,
} from "@/content/services";

export type DesktopIcon = {
  label: string;
  thumbnail: string;
  thumbnailAspectRatio?: number;
  anchorX: number;
  anchorY: number;
};

export type ProjectContact = {
  label: "微信" | "QQ" | "手机";
  value: string;
  href?: string;
};

export type AuthorNote = {
  kicker: string;
  summary: string;
  tags: string[];
  details: string[];
  contacts: ProjectContact[];
};

export type DesktopProject =
  | (DesktopIcon & { kind: "work"; slug: string })
  | (DesktopIcon & { kind: "note"; note: AuthorNote })
  | (DesktopIcon & { kind: "service"; service: ServiceEntry });

export type DockItem = {
  label: string;
  icon: string;
  iconMode?: "photo" | "contained" | "full";
  href?: string;
  window?: "about" | "notes";
};

export const DESKTOP_BACKGROUND = "/profile-desktop/male-hoodie-wallpaper.png";

export const projects: DesktopProject[] = [
  {
    kind: "work",
    slug: "hoop-pupil",
    label: "Hoop Pupil",
    thumbnail: "/profile-desktop/apps/hoop-pupil.png",
    thumbnailAspectRatio: 2048 / 1153,
    anchorX: 26,
    anchorY: 29.5,
  },
  {
    kind: "work",
    slug: "reflexlearn",
    label: "ReflexLearn",
    thumbnail: "/profile-desktop/apps/reflexlearn.png",
    thumbnailAspectRatio: 2048 / 1146,
    anchorX: 42.75,
    anchorY: 48.5,
  },
  {
    kind: "work",
    slug: "ai-ppt-platform",
    label: "MedSlide Agent",
    thumbnail: "/profile-desktop/apps/medslide-agent.png",
    thumbnailAspectRatio: 2048 / 1029,
    anchorX: 61.5,
    anchorY: 60,
  },
  {
    kind: "work",
    slug: "cad-semantic-workbench",
    label: "CAD 语义审查",
    thumbnail: "/profile-desktop/apps/cad.png",
    thumbnailAspectRatio: 2048 / 1377,
    anchorX: 66.08,
    anchorY: 19.63,
  },
  {
    kind: "work",
    slug: "docpilot",
    label: "DocPilot",
    thumbnail: "/profile-desktop/apps/docpilot.png",
    thumbnailAspectRatio: 2048 / 1152,
    anchorX: 73.92,
    anchorY: 40.75,
  },
  {
    kind: "service",
    service: MODEL_GATEWAY_SERVICE,
    label: MODEL_GATEWAY_SERVICE.name,
    thumbnail: "/profile-desktop/apps/model-gateway.png",
    thumbnailAspectRatio: 2048 / 1371,
    anchorX: 55,
    anchorY: 29.5,
  },
  {
    kind: "note",
    label: "Author Note",
    thumbnail:
      "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260530_012333_aca09e65-227f-4185-a25f-85191cfac44d.png&w=1920&q=85",
    anchorX: 23.33,
    anchorY: 60.88,
    note: {
      kicker: "PERSONAL DIGITAL SPACE · 2026",
      summary:
        "Yukibei 持续建设的个人数字空间，集中呈现个人经历、项目实践与技术思考。",
      tags: ["开源二次开发", "AI Vibe Coding", "技术博客", "持续迭代"],
      details: [
        "网站围绕“可展示、可验证、可交流”进行设计：在优秀开源组件的基础上完成二次设计与工程化整合，并持续打磨属于自己的视觉语言和交互体验。",
        "站内同步建设博客系统，用于沉淀 AI 应用、全栈开发与工程实践；开发链路配套私有 AI 中转服务，支撑 AI 辅助的 Vibe Coding 工作流。感谢开源社区带来的知识与灵感，也期待通过持续学习、分享和交流认识更多对技术保持热情的人。",
        "如果你对我的项目、技术方向或合作设想感兴趣，欢迎通过以下方式联系。",
      ],
      contacts: [
        { label: "微信", value: "lyl486yyds" },
        { label: "QQ", value: "2747028274" },
        { label: "手机", value: "17513119836", href: "tel:17513119836" },
      ],
    },
  },
];

export const dockItems: DockItem[] = [
  {
    label: "About Me",
    icon: "/profile-desktop/avatar-yiling.png",
    iconMode: "photo",
    window: "about",
  },
  {
    label: "Notes",
    icon: "https://framerusercontent.com/images/4ar8CL6aUtjymV8jTsXrcPzXCM.svg",
    window: "notes",
  },
  {
    label: "GitHub",
    icon: "/profile-desktop/github.svg",
    iconMode: "contained",
    href: "https://github.com/Yukibei",
  },
  {
    label: "Linux.do",
    icon: "/profile-desktop/linux-do.svg",
    iconMode: "contained",
    href: "https://linux.do/",
  },
  {
    label: "洛谷",
    icon: "/profile-desktop/luogu.svg",
    iconMode: "contained",
    href: "https://www.luogu.com.cn/user/1393367",
  },
];
