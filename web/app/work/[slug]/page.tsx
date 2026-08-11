import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import ProjectMedia from "@/components/work/ProjectMedia";
import { getWorkProject, WORK_PROJECTS } from "@/content/work";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return WORK_PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getWorkProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getWorkProject(slug);
  if (!project) notFound();

  return (
    <main id="main-content" className="min-h-screen bg-black pb-10">
      <article>
        <header className="mx-auto max-w-[1500px] px-6 pb-16 pt-36 md:px-10 md:pt-44 lg:px-16">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 font-body text-sm text-white/48 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All work
          </Link>
          <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
            <div>
              <p className="font-body text-[11px] uppercase tracking-[0.28em] text-white/38">
                {project.no} · {project.category} · {project.status}
              </p>
              <h1 className="mt-5 text-wrap-balance font-heading text-[clamp(4rem,10vw,9rem)] italic leading-[0.8] tracking-tight text-white">
                {project.title}
              </h1>
              <p className="mt-5 font-body text-sm tracking-[0.24em] text-white/38">
                {project.zhTitle}
              </p>
            </div>
            <div>
              <p className="text-pretty font-body text-sm font-light leading-7 text-white/62 md:text-base">
                {project.summary}
              </p>
              <p className="mt-6 border-t border-white/10 pt-5 font-body text-sm leading-6 text-white/45">
                {project.role}
              </p>
            </div>
          </div>
        </header>

        <section className="mx-auto grid max-w-[1500px] gap-5 px-6 md:px-10 lg:grid-cols-12 lg:px-16">
          {project.media.map((media, index) => (
            <figure
              key={media.src}
              className={`liquid-glass rounded-2xl p-2.5 ${
                index === 0 ? "lg:col-span-8" : "lg:col-span-4"
              }`}
            >
              <ProjectMedia
                media={media}
                priority={index < 2}
                className="rounded-xl"
              />
              <figcaption className="px-2 pb-1 pt-3 font-body text-[10px] uppercase tracking-[0.2em] text-white/38">
                {media.caption}
              </figcaption>
            </figure>
          ))}
        </section>

        <section className="mx-auto grid max-w-[1500px] gap-14 px-6 py-24 md:px-10 lg:grid-cols-12 lg:px-16 lg:py-32">
          <div className="lg:col-span-7">
            <p className="font-body text-[10px] uppercase tracking-[0.28em] text-white/35">Context</p>
            <h2 className="mt-4 font-heading text-5xl italic leading-none text-white">Problem</h2>
            <p className="mt-6 max-w-2xl text-pretty font-body text-base font-light leading-8 text-white/58">
              {project.problem}
            </p>
            <h2 className="mt-16 font-heading text-5xl italic leading-none text-white">Approach</h2>
            <p className="mt-6 max-w-2xl text-pretty font-body text-base font-light leading-8 text-white/58">
              {project.solution}
            </p>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="liquid-glass rounded-2xl p-6 sm:p-8">
              <p className="font-body text-[10px] uppercase tracking-[0.26em] text-white/35">Evidence</p>
              <dl className="mt-7 space-y-7">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="border-b border-white/8 pb-6 last:border-0 last:pb-0">
                    <dt className="font-body text-xs text-white/38">{metric.label}</dt>
                    <dd className="mt-1 font-heading text-3xl italic tabular-nums text-white">{metric.value}</dd>
                    <dd className="mt-2 font-body text-xs leading-5 text-white/32">{metric.verify}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </section>

        <section className="border-y border-white/10">
          <div className="mx-auto max-w-[1500px] px-6 py-24 md:px-10 lg:px-16 lg:py-32">
            <p className="font-body text-[10px] uppercase tracking-[0.28em] text-white/35">Engineering decisions</p>
            <h2 className="mt-4 font-heading text-5xl italic text-white md:text-6xl">What I chose, and why.</h2>
            <div className="mt-14 divide-y divide-white/10">
              {project.decisions.map((decision, index) => (
                <section key={decision.title} className="grid gap-5 py-9 md:grid-cols-[4rem_1fr_1.35fr] md:gap-8">
                  <span className="font-body text-xs tabular-nums text-white/28">0{index + 1}</span>
                  <div>
                    <h3 className="font-heading text-3xl italic text-white">{decision.title}</h3>
                    <p className="mt-3 font-body text-sm text-white/72">{decision.choice}</p>
                    <p className="mt-2 font-body text-xs text-white/32">Not {decision.insteadOf}</p>
                  </div>
                  <p className="text-pretty font-body text-sm font-light leading-7 text-white/52">{decision.why}</p>
                </section>
              ))}
            </div>
          </div>
        </section>

        <footer className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-8 px-6 py-16 md:px-10 lg:px-16">
          <div className="flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span key={item} className="liquid-glass rounded-full px-3 py-1.5 font-body text-xs text-white/55">
                {item}
              </span>
            ))}
          </div>
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="liquid-glass-strong inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm text-white"
            >
              {link.label}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          ))}
        </footer>
      </article>
    </main>
  );
}
