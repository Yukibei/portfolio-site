import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageIntro from "@/components/site/PageIntro";
import { SERVICES } from "@/content/services";

export const metadata: Metadata = {
  title: "Services",
  description: "李怡霖的在线服务、模型网关与项目部署入口。",
};

export default function ServicesPage() {
  return (
    <main id="main-content" className="min-h-screen bg-black">
      <PageIntro
        eyebrow="Live systems"
        title="Services, routes, status."
        description="公开入口只展示可安全访问的地址和真实部署状态。没有上线的项目保留案例页，不把规划写成已经运行。"
      />
      <section className="mx-auto max-w-[1500px] px-6 py-16 md:px-10 lg:px-16 lg:py-24">
        <div className="divide-y divide-white/10 border-y border-white/10">
          {SERVICES.map((service, index) => (
            <article
              key={service.name}
              className="grid gap-6 py-9 md:grid-cols-[4rem_minmax(0,1fr)_15rem_auto] md:items-center md:gap-8"
            >
              <span className="font-body text-xs tabular-nums text-white/25">
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-heading text-4xl italic leading-none text-white">
                  {service.name}
                </h2>
                <p className="mt-3 max-w-2xl text-pretty font-body text-sm font-light leading-6 text-white/44">
                  {service.description}
                </p>
              </div>
              <div className="font-body text-xs">
                <div className="text-white/32">{service.label}</div>
                <div className={`mt-2 ${service.status === "Live" ? "text-emerald-300/80" : "text-white/45"}`}>
                  {service.status}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {service.caseHref ? (
                  <Link
                    href={service.caseHref}
                    className="font-body text-sm text-white/48 underline decoration-white/20 underline-offset-6 transition-colors hover:text-white"
                  >
                    Case
                  </Link>
                ) : null}
                {service.href ? (
                  <a
                    href={service.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`打开 ${service.name}`}
                    className="liquid-glass-strong rounded-full p-3 text-white transition-colors hover:bg-white/10"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
