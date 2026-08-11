import { CASE_STUDIES } from "@/components/evidence/caseStudies";
import type { ProjectMedia, WorkProject } from "./types";

const MEDIA: Record<string, ProjectMedia[]> = {
  "hoop-pupil": [
    {
      kind: "video",
      role: "cover",
      src: "/work/hoop/showcase.mp4",
      poster: "/projects/hp-demo-poster.jpg",
      alt: "智瞳篮途篮球视频分析演示",
      caption: "球场视频理解结果",
      shape: "wide",
      fit: "cover",
    },
    {
      kind: "image",
      role: "product",
      src: "/projects/hp-a.png",
      alt: "智瞳篮途产品页面",
      caption: "场馆与业务页面",
      shape: "landscape",
      fit: "cover",
    },
  ],
  reflexlearn: [
    {
      kind: "video",
      role: "cover",
      src: "/projects/rl-demo.mp4",
      poster: "/projects/rl-demo-poster.jpg",
      alt: "ReflexLearn 多智能体学习任务演示",
      caption: "多智能体学习闭环",
      shape: "landscape",
      fit: "cover",
    },
    {
      kind: "image",
      role: "product",
      src: "/projects/rl-b.png",
      alt: "ReflexLearn 学习工作台",
      caption: "学习任务与状态反馈",
      shape: "landscape",
      fit: "contain",
    },
  ],
  openclaw: [
    {
      kind: "video",
      role: "cover",
      src: "/projects/oc-demo.mp4",
      poster: "/projects/oc-demo-poster.jpg",
      alt: "OpenClaw 跨端 AI 操作演示",
      caption: "一句话驱动受控操作",
      shape: "landscape",
      fit: "cover",
    },
    {
      kind: "image",
      role: "mobile",
      src: "/projects/oc-tall.png",
      alt: "OpenClaw 移动端页面",
      caption: "移动端受控执行链路",
      shape: "portrait",
      fit: "contain",
    },
  ],
};

const META: Record<
  string,
  Pick<WorkProject, "category" | "year" | "status" | "featured">
> = {
  "hoop-pupil": {
    category: "Computer Vision · Full-Stack",
    year: "2026",
    status: "案例可验证",
    featured: true,
  },
  reflexlearn: {
    category: "Multi-Agent · Learning",
    year: "2026",
    status: "案例可验证",
    featured: true,
  },
  openclaw: {
    category: "AI Agent · Automation",
    year: "2026",
    status: "持续开发",
    featured: false,
  },
};

export const EXISTING_PROJECTS: WorkProject[] = CASE_STUDIES.map((project) => ({
  slug: project.id,
  no:
    project.id === "hoop-pupil"
      ? "04"
      : project.id === "reflexlearn"
        ? "05"
        : "06",
  title: project.name,
  zhTitle: project.zh,
  ...META[project.id],
  summary: project.oneLiner,
  role: project.role,
  problem: project.problem,
  solution: project.approach,
  stack: project.stackLine.split(" · "),
  metrics: project.metrics,
  decisions: project.decisions,
  media: MEDIA[project.id],
  links: project.href ? [{ label: project.linkLabel, href: project.href }] : [],
}));
