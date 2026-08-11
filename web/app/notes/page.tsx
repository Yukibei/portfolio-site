import type { Metadata } from "next";
import Dashboard from "@/components/notes/glass/pages/Dashboard";
import type { RecoItem } from "@/components/notes/glass/parts/RecoCard";
import { getAllNotes } from "@/content/notes";
import { NOTE_CATEGORIES, type NoteCategory } from "@/content/notes/types";
import { WORK_PROJECTS } from "@/content/work";
import type { WorkProject } from "@/content/work/types";

export const metadata: Metadata = {
  title: "Notes",
  description: "关于 AI 应用、Agent、全栈工程和真实项目复盘的个人笔记。",
};

type NotesPageProps = {
  searchParams: Promise<{ category?: string | string[]; hero?: string | string[]; query?: string | string[] }>;
};

function first(raw: string | string[] | undefined): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw;
}

function parseCategory(raw: string | string[] | undefined): NoteCategory | null {
  const value = first(raw);
  return NOTE_CATEGORIES.find((category) => category === value) ?? null;
}

/** 视频项目的封面在 poster，图片项目在 src */
function projectCover(project: WorkProject): string | undefined {
  const cover = project.media.find((item) => item.role === "cover");
  if (!cover) return undefined;
  return cover.kind === "video" ? cover.poster : cover.src;
}

/** 文章数量不足时，用 work 项目卡补满推荐位，图片用项目自己的封面 */
function projectToReco(project: WorkProject): RecoItem {
  return {
    key: `work-${project.slug}`,
    href: `/work/${project.slug}`,
    title: project.zhTitle,
    category: "作品",
    meta: `${project.year} · ${project.category}`,
    image: projectCover(project),
  };
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const { category: rawCategory, hero: rawHero, query: rawQuery } = await searchParams;
  const category = parseCategory(rawCategory);

  const allNotes = getAllNotes();
  const query = first(rawQuery)?.trim().toLowerCase() ?? "";
  const notes = (category === null ? allNotes : allNotes.filter((note) => note.category === category))
    .filter((note) => !query || [note.title, note.summary, note.category, ...note.tags].join(" ").toLowerCase().includes(query));

  const parsedHero = Number.parseInt(first(rawHero) ?? "0", 10);
  const heroIndex =
    Number.isInteger(parsedHero) && parsedHero >= 0 && parsedHero < notes.length ? parsedHero : 0;

  return (
    <Dashboard
      notes={notes}
      allNotes={allNotes}
      projectRecos={WORK_PROJECTS.map(projectToReco)}
      activeCategory={category}
      heroIndex={heroIndex}
    />
  );
}
