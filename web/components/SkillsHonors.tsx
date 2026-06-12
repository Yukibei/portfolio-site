import Reveal, { SectionTitle } from "./Reveal";

const SKILLS = [
  { label: "Backend", body: "Java / Spring Boot · Python / FastAPI · RESTful · 异步编程 · JWT" },
  { label: "Frontend", body: "Vue 3 全家桶 · TypeScript · Tailwind CSS · React / Next.js" },
  { label: "Database", body: "MySQL · PostgreSQL · Redis · Qdrant · Neo4j" },
  { label: "AI Eng.", body: "RAG 检索链路 · LangGraph 多智能体 · LiteLLM · SSE 流式" },
  { label: "DevOps", body: "Linux · Docker Compose · Nginx · 阿里云 · Prometheus / Grafana" },
];

const HONORS = [
  { name: "全国高校计算机能力挑战赛", level: "国家级一等奖", national: true },
  { name: "中国大学生服务外包创新创业大赛", level: "国家级三等奖", national: true },
  { name: "华为 ICT 大赛实践赛云赛道", level: "全国三等奖", national: true },
  { name: "蓝桥杯大赛程序设计", level: "省二等奖", national: false },
  { name: "ICPC 程序设计竞赛省赛", level: "解题数达铜奖线", national: false },
  {
    name: "全国计算机技术与软件专业技术资格考试",
    level: "软件设计师（中级）",
    national: false,
  },
];

export default function SkillsHonors() {
  return (
    <section
      id="skills"
      className="scroll-mt-24 px-6 py-20 sm:px-10 lg:px-16 lg:py-28"
    >
      <SectionTitle index="04" en="Skills & Honors." zh="技能与荣誉" />

      <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
        <Reveal delay={0.08}>
          <h3 className="mb-6 font-inter text-xs uppercase tracking-[0.35em] text-white/40">
            Skills / 技术栈
          </h3>
          <dl className="space-y-5 border-t border-white/10 pt-6">
            {SKILLS.map((s) => (
              <div key={s.label} className="grid grid-cols-[90px_1fr] gap-4 sm:grid-cols-[110px_1fr]">
                <dt className="font-inter text-sm font-bold uppercase tracking-wider text-white">
                  {s.label}
                </dt>
                <dd className="font-inter text-sm leading-relaxed text-white/60 sm:text-base">
                  {s.body}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.16}>
          <h3 className="mb-6 font-inter text-xs uppercase tracking-[0.35em] text-white/40">
            Honors / 荣誉奖项
          </h3>
          <ul className="space-y-4 border-t border-white/10 pt-6">
            {HONORS.map((h) => (
              <li
                key={h.name}
                className="flex items-baseline justify-between gap-4 font-inter text-sm sm:text-base"
              >
                <span className="text-white/70">{h.name}</span>
                <span
                  className={`shrink-0 font-semibold tracking-wider ${
                    h.national ? "text-white" : "text-white/50"
                  }`}
                >
                  {h.level}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
