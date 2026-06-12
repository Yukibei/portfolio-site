import Reveal, { SectionTitle } from "./Reveal";

const FACTS = [
  { label: "Class of", value: "2026" },
  { label: "Major", value: "Computer Science" },
  { label: "Rank", value: "Top 3 / 65" },
  { label: "Focus", value: "AI Application · Full-Stack" },
];

export default function About() {
  return (
    <section
      id="about"
      className="relative scroll-mt-24 px-6 py-20 sm:px-10 lg:px-16 lg:py-28"
    >
      {/* 竖排中文装饰 */}
      <span
        aria-hidden="true"
        className="writing-vertical pointer-events-none absolute right-6 top-20 hidden select-none font-inter text-sm text-white/10 sm:block lg:right-14 lg:text-base"
      >
        把热爱写成代码
      </span>

      <SectionTitle index="01" en="Who I Am." zh="关于我" />

      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <Reveal delay={0.1}>
          <p className="max-w-2xl font-inter text-lg leading-relaxed text-white/80 sm:text-xl lg:text-2xl">
            我是<span className="font-bold text-white">李怡霖</span>
            ，2026 届计算机科学与技术本科生。
            <br />
            <br />
            我做的事情很简单：
            <span className="font-bold text-white">
              把 AI 能力做成真正可上线的产品
            </span>
            —— 从 RAG、多智能体编排，到前后端与部署的完整闭环。
            <span className="text-white/50">不止于 Demo。</span>
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/15 pt-8">
            {FACTS.map((fact) => (
              <div key={fact.label}>
                <dt className="font-inter text-[10px] uppercase tracking-widest text-white/40">
                  {fact.label}
                </dt>
                <dd className="mt-1 font-inter text-base font-semibold text-white sm:text-lg">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
