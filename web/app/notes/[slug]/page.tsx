import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import NotesShell from "@/components/notes/NotesShell";
import ReadingTracker from "@/components/notes/glass/ReadingTracker";
import NoteToc from "@/components/notes/NoteToc";
import { mdxComponents } from "@/components/notes/mdxComponents";
import { getAllNotes, getNote } from "@/content/notes";

type NotePageProps = {
  params: Promise<{ slug: string }>;
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

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  return (
    <NotesShell aside={<NoteToc items={note.toc} />}>
      <ReadingTracker slug={slug} />
      <article className="max-w-[46rem]">
        <header className="border-b border-white/12 pb-10">
          <div className="flex flex-wrap items-center gap-3 font-body text-[10px] uppercase tracking-[0.22em] text-white/34">
            <span className="text-white/50">{note.category}</span>
            <span className="h-px w-6 bg-white/18" />
            <time dateTime={note.publishedAt}>{note.displayDate}</time>
            <span className="h-px w-6 bg-white/18" />
            <span>{note.readTime}</span>
          </div>
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
        </header>

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
      </article>
    </NotesShell>
  );
}
