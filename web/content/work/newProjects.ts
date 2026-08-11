import type { WorkProject } from "./types";

export const NEW_PROJECTS: WorkProject[] = [
  {
    slug: "ai-ppt-platform",
    no: "01",
    title: "AI PPT Platform",
    zhTitle: "AI PPT 商业化平台",
    category: "AI Product · Full-Stack",
    year: "2026",
    status: "可联调",
    featured: true,
    summary:
      "把医疗质量改进材料转成可预览、可追踪、可下载的 PPT 产品，并补齐账号、积分、作品与订单主链路。",
    role:
      "参与 AI 任务链路、C 端 Web/H5、Java 商业后端和管理端的工程落地与联调。",
    problem:
      "生成一份 PPT 只是起点。真实产品还要处理长任务状态、跨端一致性、会员积分、下载授权、作品归档和运营配置。",
    solution:
      "使用 Next.js 承载用户端，若依 Java 负责账号与交易业务，FastAPI 专注 AI 引擎，并以 PostgreSQL 统一数据底座。生成免费，在线预览，下载阶段按规则完成授权与扣费。",
    stack: ["Next.js", "React", "Spring Boot", "FastAPI", "PostgreSQL"],
    metrics: [
      { label: "产品端", value: "Web / H5 / Admin", verify: "三端页面与联调记录" },
      { label: "业务主链", value: "账号到下载", verify: "商业化主链接口与状态流" },
      { label: "AI 引擎", value: "A / B 双线", verify: "生成与渲染任务链路" },
    ],
    decisions: [
      {
        title: "业务与 AI 分层",
        choice: "Java 管业务，FastAPI 管 AI 任务",
        insteadOf: "把账号、交易和生成逻辑放在一个服务",
        why: "交易规则需要稳定审计，模型链路需要快速迭代；按责任拆分后，两边可以独立发布和扩缩。",
      },
      {
        title: "扣费时机",
        choice: "免费生成与预览，下载时授权扣费",
        insteadOf: "生成前直接拦截并扣积分",
        why: "让用户先看到结果，再为可交付文件付费，符合当前产品验收口径，也减少失败任务带来的补偿复杂度。",
      },
      {
        title: "多端入口",
        choice: "桌面工作台与 H5 分场景设计",
        insteadOf: "把桌面复杂表单等比缩到手机",
        why: "移动端更适合分步创建和状态查看，桌面端承担复杂编辑与管理，两端共享业务契约而不是共享一套排版。",
      },
    ],
    media: [
      {
        kind: "image",
        role: "cover",
        src: "/work/aippt/home-desktop.png",
        alt: "AI PPT 商业化平台桌面端首页",
        caption: "桌面端产品首页",
        shape: "landscape",
        fit: "cover",
      },
      {
        kind: "image",
        role: "mobile",
        src: "/work/aippt/h5-mobile.png",
        alt: "AI PPT 商业化平台 H5 首页",
        caption: "移动端创建与服务入口",
        shape: "portrait",
        fit: "contain",
      },
    ],
    links: [],
  },
  {
    slug: "cad-semantic-workbench",
    no: "02",
    title: "CAD Semantic Workbench",
    zhTitle: "CAD 语义审查工作台",
    category: "Document AI · Engineering",
    year: "2026",
    status: "可演示",
    featured: true,
    summary:
      "解析多张 DWG 图纸并与人工验收表对账，把识别过程、差异定位和 Excel 交付包放进同一条可观察管线。",
    role: "负责应用链路、异步处理进度、差异审查和交付结果的全栈实现。",
    problem:
      "工程图纸信息分散在多个版面和符号中，人工核对耗时，单纯 OCR 又无法直接形成可交付的配线审查结果。",
    solution:
      "把图纸转换、版面解析、语义提取、对账与交付拆成七阶段任务；前端实时展示进度，结果页同时提供指标、差异清单、AI 诊断和 Excel 下载。",
    stack: ["FastAPI", "React", "DWG/PDF", "OCR", "Async Pipeline"],
    metrics: [
      { label: "识别记录", value: "235 条", verify: "端子审查交付文件" },
      { label: "匹配率", value: "99.16%", verify: "235 / 237 对账结果" },
      { label: "精确匹配", value: "98.73%", verify: "字段级差异审查" },
    ],
    decisions: [
      {
        title: "任务形态",
        choice: "七阶段异步管线",
        insteadOf: "一个同步接口从上传跑到下载",
        why: "图纸转换和识别耗时不稳定，阶段化后可以展示真实进度、定位失败节点，并从中间产物恢复。",
      },
      {
        title: "审查输出",
        choice: "原始识别、差异和交付包同时保留",
        insteadOf: "只返回一个匹配百分比",
        why: "工程验收需要知道每一条记录为什么匹配或缺失，结果必须可以复核，而不是只相信总分。",
      },
    ],
    media: [
      {
        kind: "image",
        role: "cover",
        src: "/work/cad/delivery.png",
        alt: "CAD 语义审查工作台交付结果页",
        caption: "识别、对账与交付结果",
        shape: "wide",
        fit: "cover",
      },
      {
        kind: "image",
        role: "process",
        src: "/work/cad/pipeline.png",
        alt: "CAD 语义审查七阶段处理进度",
        caption: "可观察的七阶段处理链路",
        shape: "wide",
        fit: "contain",
      },
    ],
    links: [],
  },
  {
    slug: "docpilot",
    no: "03",
    title: "DocPilot",
    zhTitle: "Word 智能编辑 Agent",
    category: "AI Agent · Productivity",
    year: "2026",
    status: "可演示",
    featured: true,
    summary:
      "让 LLM 负责理解与规划，让确定性执行引擎修改 Word，支持跨文档复制、版本对比、回滚和下载。",
    role: "负责 EditPlan 契约、确定性执行、版本事务和前端工作台的完整实现。",
    problem:
      "让模型直接重写 Word 容易丢格式、改错位置，也无法解释每一步修改，更难在失败后安全回滚。",
    solution:
      "LLM 只生成经 Pydantic 强校验的 EditPlan；后端逐项执行并生成新版本。缺少关键信息时强制澄清，用户确认后才落盘。",
    stack: ["React", "FastAPI", "Pydantic", "python-docx", "LibreOffice"],
    metrics: [
      { label: "E2E 样例", value: "DOC + DOCX", verify: "真实文件端到端测试" },
      { label: "跨文档表格", value: "9 × 3", verify: "样式保真复制结果" },
      { label: "版本能力", value: "Diff / 回滚", verify: "版本时间线与下载文件" },
    ],
    decisions: [
      {
        title: "模型边界",
        choice: "LLM 生成 EditPlan，代码执行",
        insteadOf: "让模型直接生成整份文档",
        why: "结构化计划可以校验、审批和审计，确定性代码负责格式与二进制关系，失败也能定位到具体操作。",
      },
      {
        title: "缺参处理",
        choice: "missing_info 强制澄清",
        insteadOf: "模型猜测目标位置和修改风格",
        why: "文档编辑的错误成本高于多问一次。关键参数缺失时暂停执行，能避免不可逆的范围误判。",
      },
      {
        title: "预览策略",
        choice: "快速预览 + 高保真 PDF 双通道",
        insteadOf: "所有步骤都等待服务端 PDF 转换",
        why: "对话中先快速反馈，下载前再做分页和页眉页脚的高保真确认，在速度和准确性之间取平衡。",
      },
    ],
    media: [
      {
        kind: "image",
        role: "cover",
        src: "/work/docpilot/editor.png",
        alt: "DocPilot 多文档智能编辑工作台",
        caption: "多文档对话式编辑工作台",
        shape: "landscape",
        fit: "cover",
      },
      {
        kind: "image",
        role: "result",
        src: "/work/docpilot/walkthrough.png",
        alt: "DocPilot 修改计划与版本对比",
        caption: "计划审批、跨文档复制与版本 Diff",
        shape: "landscape",
        fit: "contain",
      },
    ],
    links: [],
  },
];
