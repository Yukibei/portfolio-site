import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageIntro from "@/components/site/PageIntro";

export const metadata: Metadata = {
  title: "Lab",
  description: "交互实验、3D、AI trace 与正在制作的网页模块。",
};

const LAB_ITEMS = [
  {
    no: "01",
    title: "Portrait Stage",
    zh: "肖像流体舞台",
    description: "把真人肖像、CRT 视觉与 WebGL 交互从首页叙事中拆出来，作为独立实验保留。",
    status: "Live experiment",
    href: "/lab/portrait-stage",
  },
  {
    no: "02",
    title: "Agent Trace",
    zh: "多智能体轨迹回放",
    description: "从真实节点与状态结构转写的执行轨迹，用于解释系统内部发生了什么。",
    status: "Case integration",
    href: "/work/reflexlearn",
  },
  {
    no: "03",
    title: "Dino Runner",
    zh: "404 跑酷",
    description: "从桌面 Pygame 版本移植的 Canvas 跑酷，现作为首页人物段的可展开彩蛋，并复用于 404。",
    status: "Homepage game",
    href: "/#dino-runner",
  },
] as const;

export default function LabPage() {
  return (
    <main id="main-content" className="min-h-screen bg-black">
      <PageIntro
        eyebrow="Interactive studies"
        title="Small experiments, real code."
        description="这里收纳不适合挤在首页、但值得继续发展的交互、3D、状态回放和趣味模块。"
      />
      <section className="mx-auto grid max-w-[1500px] gap-6 px-6 py-20 md:px-10 lg:grid-cols-12 lg:px-16 lg:py-28">
        {LAB_ITEMS.map((item, index) => {
          const content = (
            <article className="liquid-glass group flex min-h-[25rem] flex-col justify-between rounded-2xl p-7 sm:p-9">
              <div className="flex items-start justify-between gap-4">
                <span className="font-body text-xs tabular-nums text-white/28">{item.no}</span>
                <span className="font-body text-[10px] uppercase tracking-[0.2em] text-white/34">{item.status}</span>
              </div>
              <div>
                <h2 className="font-heading text-5xl italic leading-[0.88] text-white md:text-6xl">
                  {item.title}
                </h2>
                <p className="mt-3 font-body text-sm tracking-[0.22em] text-white/32">{item.zh}</p>
                <p className="mt-6 max-w-md text-pretty font-body text-sm font-light leading-7 text-white/48">
                  {item.description}
                </p>
                {item.href ? (
                  <span className="mt-8 inline-flex items-center gap-2 font-body text-sm text-white/62">
                    Open study
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </span>
                ) : null}
              </div>
            </article>
          );

          return item.href ? (
            <Link
              key={item.title}
              href={item.href}
              className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                index === 0 ? "lg:col-span-7" : "lg:col-span-5"
              }`}
            >
              {content}
            </Link>
          ) : null;
        })}
      </section>
    </main>
  );
}
