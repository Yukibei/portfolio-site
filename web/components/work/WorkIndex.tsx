import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { WORK_PROJECTS } from "@/content/work";
import ProjectMedia from "./ProjectMedia";

const SPAN_CLASS = [
  "lg:col-span-7",
  "lg:col-span-5 lg:mt-24",
  "lg:col-span-5",
  "lg:col-span-7 lg:mt-24",
  "lg:col-span-7",
  "lg:col-span-5 lg:mt-24",
];

export default function WorkIndex() {
  return (
    <section className="mx-auto grid max-w-[1500px] grid-cols-1 gap-x-8 gap-y-20 px-6 py-20 md:px-10 lg:grid-cols-12 lg:px-16 lg:py-28">
      {WORK_PROJECTS.map((project, index) => (
        <article key={project.slug} className={SPAN_CLASS[index % SPAN_CLASS.length]}>
          <Link
            href={`/work/${project.slug}`}
            className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <div className="liquid-glass rounded-2xl p-2.5 transition-transform duration-500 group-hover:-translate-y-1">
              <ProjectMedia media={project.media[0]} className="rounded-xl" />
            </div>
            <div className="mt-6 flex items-start justify-between gap-6">
              <div>
                <div className="font-body text-[10px] uppercase tracking-[0.24em] text-white/35">
                  {project.no} · {project.category}
                </div>
                <h2 className="mt-3 font-heading text-4xl italic leading-none text-white md:text-5xl">
                  {project.title}
                </h2>
                <p className="mt-3 max-w-xl text-pretty font-body text-sm font-light leading-6 text-white/50">
                  {project.summary}
                </p>
              </div>
              <ArrowUpRight className="mt-6 h-5 w-5 shrink-0 text-white/45 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
            </div>
          </Link>
        </article>
      ))}
    </section>
  );
}
