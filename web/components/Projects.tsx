import { ArrowUpRight, Clock } from "lucide-react";
import Reveal, { SectionTitle } from "./Reveal";

// href 为 null 表示部署入口预留：服务器购置后填入正式地址即可
const PROJECTS = [
  {
    no: "01",
    name: "Hoop Pupil",
    zh: "智瞳篮途",
    desc: "篮球持球人重识别（ReID）平台 — 从算法服务化到前后端交付的完整闭环，已上线运行。",
    metrics: "mAP 91.6% · Rank-1 94.4% · 12 个业务模块",
    stack: "Vue 3 · Spring Boot · FastAPI · PyTorch · MySQL · Redis",
    href: "https://admin.hooppupil.me",
    linkLabel: "Live Demo",
  },
  {
    no: "02",
    name: "ReflexLearn",
    zh: "反思学习",
    desc: "基于 LangGraph 的多智能体个性化学习系统 — 规划、生成、评价与反思记忆的闭环，SSE 流式输出。",
    metrics: "多智能体编排 · 向量召回 · 知识图谱",
    stack: "Python · LangGraph · LiteLLM · Qdrant · Neo4j · PostgreSQL",
    href: null,
    linkLabel: "Coming Soon",
  },
  {
    no: "03",
    name: "OpenClaw",
    zh: "AI 管家",
    desc: "跨 Web 与 App 的 AI 管家体系 — 一句话驱动页面操作与跨页流水线，按风险分级执行。",
    metrics: "Manifest 适配 · Pipeline Chain · 移动端受控自动化",
    stack: "TypeScript · uni-app · Agent Runner · 风险分级",
    href: null,
    linkLabel: "Coming Soon",
  },
];

const rowClass =
  "group grid gap-4 border-b border-white/10 py-8 transition-colors duration-300 sm:py-10 lg:grid-cols-[auto_1.2fr_1fr_auto] lg:items-center lg:gap-10";

function RowBody({ p, live }: { p: (typeof PROJECTS)[number]; live: boolean }) {
  return (
    <>
      <span className="font-inter text-sm tracking-widest text-white/30 transition-colors group-hover:text-black/40 lg:px-2">
        ({p.no})
      </span>

      <div>
        <h3 className="font-podium text-3xl uppercase tracking-tight text-white transition-colors group-hover:text-black sm:text-4xl lg:text-5xl">
          {p.name}
          <span className="ml-3 align-middle font-inter text-sm font-normal tracking-[0.35em] text-white/40 transition-colors group-hover:text-black/50">
            {p.zh}
          </span>
        </h3>
        <p className="mt-3 max-w-xl font-inter text-sm leading-relaxed text-white/60 transition-colors group-hover:text-black/70 sm:text-base">
          {p.desc}
        </p>
      </div>

      <div className="font-inter text-xs leading-relaxed tracking-wider text-white/40 transition-colors group-hover:text-black/50 sm:text-sm">
        <div className="text-white/70 transition-colors group-hover:text-black">
          {p.metrics}
        </div>
        <div className="mt-2">{p.stack}</div>
      </div>

      {live ? (
        <div className="flex items-center gap-2 font-inter text-[11px] uppercase tracking-widest text-white/70 transition-colors group-hover:text-black lg:justify-self-end lg:px-2">
          {p.linkLabel}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      ) : (
        <div className="flex flex-col items-start gap-1 lg:items-end lg:justify-self-end lg:px-2">
          <span className="flex items-center gap-2 font-inter text-[11px] uppercase tracking-widest text-white/40 transition-colors group-hover:text-black/50">
            <Clock className="h-3.5 w-3.5" />
            {p.linkLabel}
          </span>
          <span className="font-inter text-[10px] tracking-[0.3em] text-white/25 transition-colors group-hover:text-black/40">
            部署预留
          </span>
        </div>
      )}
    </>
  );
}

export default function Projects() {
  return (
    <section
      id="projects"
      className="scroll-mt-24 px-6 py-20 sm:px-10 lg:px-16 lg:py-28"
    >
      <SectionTitle index="02" en="Selected Works." zh="精选项目" />

      <div className="border-t border-white/10">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            {p.href ? (
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className={`${rowClass} hover:bg-white`}
              >
                <RowBody p={p} live />
              </a>
            ) : (
              <div className={`${rowClass} cursor-default hover:bg-white/90`}>
                <RowBody p={p} live={false} />
              </div>
            )}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
