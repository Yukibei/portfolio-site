export type ProjectMediaKind = "image" | "video";
export type ProjectMediaRole =
  | "cover"
  | "product"
  | "mobile"
  | "process"
  | "result";
export type ProjectMediaShape = "wide" | "landscape" | "portrait";

export type ProjectMedia = {
  kind: ProjectMediaKind;
  role: ProjectMediaRole;
  src: string;
  poster?: string;
  alt: string;
  caption: string;
  shape: ProjectMediaShape;
  fit: "cover" | "contain";
};

export type ProjectMetric = {
  label: string;
  value: string;
  verify: string;
};

export type ProjectDecision = {
  title: string;
  choice: string;
  insteadOf: string;
  why: string;
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type WorkProject = {
  slug: string;
  no: string;
  title: string;
  zhTitle: string;
  category: string;
  year: string;
  status: "可演示" | "可联调" | "案例可验证" | "持续开发";
  featured: boolean;
  summary: string;
  role: string;
  problem: string;
  solution: string;
  stack: string[];
  metrics: ProjectMetric[];
  decisions: ProjectDecision[];
  media: ProjectMedia[];
  links: ProjectLink[];
};
