import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FEATURED_PROJECTS, type WorkProject } from "@/content/work";
import Reveal from "./Reveal";
import ProjectMedia from "./work/ProjectMedia";

function MediaComposition({ project }: { project: WorkProject }) {
  const [primary, secondary] = project.media;

  return (
    <figure className="liquid-glass relative rounded-2xl p-2 sm:p-3">
      <ProjectMedia media={primary} className="rounded-xl" />
      {secondary ? (
        <div
          className={`liquid-glass absolute z-10 rounded-xl p-1.5 shadow-[0_24px_70px_rgba(0,0,0,0.55)] sm:p-2 ${
            secondary.shape === "portrait"
              ? "-bottom-8 right-4 w-[28%] sm:-bottom-10 sm:right-7"
              : "-bottom-8 right-4 w-[48%] sm:-bottom-10 sm:right-7"
          }`}
        >
          <ProjectMedia
            media={secondary}
            sizes="(max-width: 1024px) 45vw, 24vw"
            className="rounded-lg"
          />
        </div>
      ) : null}
      <figcaption className="relative z-10 flex items-center justify-between gap-4 px-2 pb-1 pt-3 font-body text-[10px] uppercase tracking-[0.22em] text-white/40">
        <span>{primary.caption}</span>
        <span className="tabular-nums">{project.year}</span>
      </figcaption>
    </figure>
  );
}

function ProjectCopy({ project }: { project: WorkProject }) {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-wrap items-center gap-3 font-body text-[10px] uppercase tracking-[0.24em] text-white/45">
        <span>{project.no}</span>
        <span className="h-px w-8 bg-white/20" />
        <span>{project.category}</span>
        <span className="text-emerald-300/80">{project.status}</span>
      </div>
      <div>
        <h3 className="text-wrap-balance font-heading text-4xl italic leading-[0.9] tracking-tight text-white md:text-5xl lg:text-6xl">
          {project.title}
        </h3>
        <p className="mt-3 font-body text-sm tracking-[0.25em] text-white/38">
          {project.zhTitle}
        </p>
      </div>
      <p className="max-w-lg text-pretty font-body text-sm font-light leading-7 text-white/66 md:text-base">
        {project.summary}
      </p>
      <dl className="grid max-w-lg grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-5">
        {project.metrics.slice(0, 2).map((metric) => (
          <div key={metric.label}>
            <dt className="font-body text-[10px] uppercase tracking-[0.2em] text-white/35">
              {metric.label}
            </dt>
            <dd className="mt-1 font-body text-sm font-medium tabular-nums text-white/85">
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>
      <Link
        href={`/work/${project.slug}`}
        className="liquid-glass-strong inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm font-medium text-white transition-all duration-300 hover:bg-white/10 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        View case study
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-24 px-6 py-24 md:px-16 lg:px-24">
      <Reveal>
        <header className="mb-20 text-center">
          <span className="liquid-glass mb-4 inline-block rounded-full px-3.5 py-1 font-body text-xs font-medium text-white">
            Selected work
          </span>
          <h2 className="text-wrap-balance font-heading text-4xl italic leading-[0.9] tracking-tight text-white md:text-5xl lg:text-7xl">
            Built to ship. Made to be inspected.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty font-body text-sm font-light leading-7 text-white/52 md:text-base">
            真实系统、真实结果，以及每个关键技术选择背后的理由。
          </p>
        </header>
      </Reveal>

      <div className="mx-auto max-w-[1380px] space-y-28 lg:space-y-36">
        {FEATURED_PROJECTS.map((project, index) => (
          <Reveal key={project.slug}>
            <article
              className={`flex flex-col items-center gap-12 lg:gap-20 ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
            >
              <ProjectCopy project={project} />
              <div className="w-full flex-1 pb-10 lg:pb-0">
                <MediaComposition project={project} />
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-24 flex justify-center">
        <Link
          href="/work"
          className="font-body text-sm text-white/65 underline decoration-white/20 underline-offset-8 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          Browse all projects
        </Link>
      </div>
    </section>
  );
}
