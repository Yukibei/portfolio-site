import type { Metadata } from "next";
import GlassDashboard from "@/components/notes/glass/GlassDashboard";
import { getAllNotes } from "@/content/notes";
import { NOTE_CATEGORIES, type NoteCategory } from "@/content/notes/types";

export const metadata: Metadata = {
  title: "Notes",
  description: "关于 AI 应用、Agent、全栈工程和真实项目复盘的个人笔记。",
};

type NotesPageProps = {
  searchParams: Promise<{ category?: string | string[] }>;
};

function parseCategory(raw: string | string[] | undefined): NoteCategory | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return NOTE_CATEGORIES.find((category) => category === value) ?? null;
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const { category: rawCategory } = await searchParams;
  const category = parseCategory(rawCategory);

  const allNotes = getAllNotes();
  const notes = category === null ? allNotes : allNotes.filter((note) => note.category === category);

  return <GlassDashboard notes={notes} allNotes={allNotes} activeCategory={category} />;
}
