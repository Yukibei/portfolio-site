import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageIntro from "@/components/site/PageIntro";

export const metadata: Metadata = {
  title: "About",
  description: "关于李怡霖：AI 应用、Agent 与全栈工程方向。",
};

const FACTS = [
  ["Focus", "AI Application · Full-Stack"],
  ["Education", "Computer Science"],
  ["Rank", "Top 3 / 65"],
  ["Current", "Building deployable AI systems"],
] as const;

export default function AboutPage() {
  return (
    <main id="main-content" className="min-h-screen bg-black">
      <PageIntro
        eyebrow="Profile"
        title="Human, debuggable."
        description="我是李怡霖。关注 AI 应用、Agent 系统与全栈交付，也愿意把失败路径、技术取舍和验证证据一起展示出来。"
      />
      <section className="mx-auto grid max-w-[1500px] gap-12 px-6 py-20 md:px-10 lg:grid-cols-12 lg:px-16 lg:py-28">
        <figure className="liquid-glass relative min-h-[34rem] overflow-hidden rounded-2xl lg:col-span-5">
          <Image
            src="/hero/portrait-base.webp"
            alt="李怡霖正面肖像"
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="object-contain object-bottom"
          />
        </figure>
        <div className="flex flex-col justify-between gap-14 lg:col-span-6 lg:col-start-7">
          <div>
            <h2 className="max-w-3xl text-wrap-balance font-heading text-5xl italic leading-[0.95] text-white md:text-7xl">
              I turn AI capability into software people can actually use.
            </h2>
            <div className="mt-9 max-w-2xl space-y-5 text-pretty font-body text-base font-light leading-8 text-white/56">
              <p>从 RAG、多智能体编排和计算机视觉，到 Java 业务后端、前端界面与服务器部署，我更关注一条能力怎样走完整个交付闭环。</p>
              <p>项目页面保留可以被追问的技术选择，博客记录过程，Services 只公开真实可访问的入口。</p>
            </div>
          </div>
          <dl className="grid gap-x-8 gap-y-7 border-t border-white/10 pt-8 sm:grid-cols-2">
            {FACTS.map(([label, value]) => (
              <div key={label}>
                <dt className="font-body text-[10px] uppercase tracking-[0.22em] text-white/32">{label}</dt>
                <dd className="mt-2 font-body text-sm text-white/78">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap gap-4">
            <a
              href="/resume.pdf"
              target="_blank"
              className="liquid-glass-strong inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm text-white"
            >
              Resume
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <Link
              href="/work"
              className="inline-flex items-center px-3 font-body text-sm text-white/52 transition-colors hover:text-white"
            >
              View work
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
