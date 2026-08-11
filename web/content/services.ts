export type ServiceEntry = {
  name: string;
  label: string;
  description: string;
  status: "Live" | "Private preview" | "Deployment planned";
  href?: string;
  caseHref?: string;
};

export const SERVICES: ServiceEntry[] = [
  {
    name: "Personal Portfolio",
    label: "liyilin.xyz",
    description: "个人作品、实验、工程笔记与在线服务的统一入口。",
    status: "Live",
    href: "https://www.liyilin.xyz",
  },
  {
    name: "Model Gateway",
    label: "api.liyilin.xyz",
    description: "模型网关与 API Routing 基础设施。公开入口不展示密钥、余额和内部调用日志。",
    status: "Live",
    href: "https://api.liyilin.xyz",
  },
  {
    name: "AI PPT Platform",
    label: "AI generation service",
    description: "AI PPT 商业化主链可联调，独立服务器承载生成任务。",
    status: "Private preview",
    caseHref: "/work/ai-ppt-platform",
  },
  {
    name: "CAD Semantic Workbench",
    label: "cad.liyilin.xyz",
    description: "DWG 语义解析、配线审查与 Excel 交付工作台。",
    status: "Deployment planned",
    caseHref: "/work/cad-semantic-workbench",
  },
  {
    name: "DocPilot",
    label: "doc.liyilin.xyz",
    description: "基于 EditPlan 与确定性执行引擎的 Word 智能编辑 Agent。",
    status: "Deployment planned",
    caseHref: "/work/docpilot",
  },
];
