import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import NotesShell from "@/components/notes/NotesShell";
import ReaderFrame from "@/components/notes/ReaderFrame";
import BookmarkToggle from "@/components/notes/glass/controls/BookmarkButton";
import ReadingTracker from "@/components/notes/glass/storage/ReadingTracker";
import NoteToc from "@/components/notes/NoteToc";
import { mdxComponents } from "@/components/notes/mdxComponents";
import { getAllNotes, getNote, getSeriesBySlug } from "@/content/notes";

type NotePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ resume?: string | string[] }>;
};

export function generateStaticParams() {
  return getAllNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return {};
  return { title: note.title, description: note.summary };
}

export default async function NotePage({ params, searchParams }: NotePageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const note = getNote(slug);
  if (!note) notFound();

  const notes = getAllNotes();
  const noteIndex = notes.findIndex((item) => item.slug === slug);
  const newer = noteIndex > 0 ? notes[noteIndex - 1] : undefined;
  const older = noteIndex >= 0 ? notes[noteIndex + 1] : undefined;
  const series = note.series ? getSeriesBySlug(note.series.slug) : undefined;
  const resumeValue = Array.isArray(query.resume) ? query.resume[0] : query.resume;

  return (
    <NotesShell aside={<NoteToc items={note.toc} />}>
      <ReadingTracker slug={slug} resume={resumeValue === "1"} />
      <ReaderFrame>
        <article className="max-w-[46rem]">
          <header className="border-b border-white/12 pb-10">
          <div className="flex flex-wrap items-center gap-3 font-body text-[10px] uppercase tracking-[0.22em] text-white/34">
            <span className="text-white/50">{note.category}</span>
            <span className="h-px w-6 bg-white/18" />
            <time dateTime={note.publishedAt}>{note.displayDate}</time>
            <span className="h-px w-6 bg-white/18" />
            <span>{note.readTime}</span>
          </div>
          {series ? (
            <Link
              href={`/notes/series/${series.slug}`}
              className="mt-6 inline-flex rounded-full border border-white/14 px-3 py-1 font-body text-[11px] text-white/55 transition-colors hover:border-white/30 hover:text-white"
            >
              {series.title} · 第 {note.series?.order} 篇
            </Link>
          ) : null}
          <h1 className="mt-6 text-wrap-balance font-heading text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.05] tracking-tight text-white">
            {note.title}
          </h1>
          <p className="mt-5 text-pretty font-body text-base font-light leading-8 text-white/55">
            {note.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/14 px-3 py-1 font-body text-[11px] text-white/45"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3 text-white/65">
            <BookmarkToggle
              slug={slug}
              kind="favorite"
              showLabel
              className="rounded-full border border-white/14 px-4 py-2.5 hover:bg-white/8"
            />
            <BookmarkToggle
              slug={slug}
              kind="queue"
              showLabel
              className="rounded-full border border-white/14 px-4 py-2.5 hover:bg-white/8"
            />
          </div>
          </header>

          {note.cover ? (
            <figure className="relative mt-10 aspect-[8/5] overflow-hidden rounded-lg border border-white/12 bg-white/[0.03]">
              <Image
                src={note.cover}
                alt={`${note.title} 封面`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 736px"
                className="object-cover"
              />
            </figure>
          ) : null}

          <div className="pt-12">
            <MDXRemote
              source={note.source}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    rehypeSlug,
                    [rehypePrettyCode, { theme: "github-dark-default", keepBackground: false }],
                  ],
                },
              }}
            />
          </div>

          <nav className="mt-20 grid gap-4 border-t border-white/12 pt-8 sm:grid-cols-2" aria-label="文章导航">
            {newer ? (
              <Link className="rounded-lg border border-white/12 p-4 text-white/55 transition-colors hover:border-white/25 hover:text-white" href={`/notes/${newer.slug}`}>
                <span className="block font-body text-[10px] uppercase tracking-[0.2em] text-white/30">上一篇</span>
                <span className="mt-2 block font-body text-sm leading-6">{newer.title}</span>
              </Link>
            ) : <span />}
            {older ? (
              <Link className="rounded-lg border border-white/12 p-4 text-right text-white/55 transition-colors hover:border-white/25 hover:text-white" href={`/notes/${older.slug}`}>
                <span className="block font-body text-[10px] uppercase tracking-[0.2em] text-white/30">下一篇</span>
                <span className="mt-2 block font-body text-sm leading-6">{older.title}</span>
              </Link>
            ) : null}
          </nav>
        </article>
      </ReaderFrame>
    </NotesShell>
  );
}
