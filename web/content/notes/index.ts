import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { SERIES_DEFINITIONS } from "./series";
import {
  NOTE_CATEGORIES,
  RESERVED_NOTE_SLUGS,
  type NoteCategory,
  type NoteDocument,
  type NoteFrontmatter,
  type NoteGroup,
  type NoteMeta,
  type NoteSeries,
  type NoteSeriesRef,
  type TocItem,
} from "./types";

export { NOTE_CATEGORIES } from "./types";
export type {
  NoteCategory,
  NoteDocument,
  NoteGroup,
  NoteMeta,
  NoteSeries,
  TocItem,
} from "./types";

const POSTS_DIR = path.join(process.cwd(), "content", "notes", "posts");

function fail(slug: string, field: string, expected: string): never {
  throw new Error(`content/notes/posts/${slug}.mdx 的 frontmatter 字段 ${field} ${expected}`);
}

function readString(value: unknown, slug: string, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    fail(slug, field, "必须是非空字符串");
  }
  return value;
}

function readDate(value: unknown, slug: string): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  fail(slug, "publishedAt", "必须是 YYYY-MM-DD 格式");
}

function readTags(value: unknown, slug: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    fail(slug, "tags", "必须是字符串数组");
  }
  return value.filter((item): item is string => typeof item === "string");
}

function readCategory(value: unknown, slug: string): NoteCategory {
  const matched = NOTE_CATEGORIES.find((item) => item === value);
  if (!matched) {
    fail(slug, "category", `必须是以下之一：${NOTE_CATEGORIES.join(" / ")}`);
  }
  return matched;
}

function readSeries(value: unknown, slug: string): NoteSeriesRef | undefined {
  if (value === undefined) return undefined;

  if (typeof value !== "object" || value === null) {
    fail(slug, "series", "必须是 { slug, order } 对象");
  }

  const raw = value as Record<string, unknown>;
  const seriesSlug = raw.slug;
  const order = raw.order;

  if (typeof seriesSlug !== "string" || !SERIES_DEFINITIONS.some((item) => item.slug === seriesSlug)) {
    fail(slug, "series.slug", `必须是 series.ts 中已定义的专栏：${SERIES_DEFINITIONS.map((item) => item.slug).join(" / ")}`);
  }
  if (typeof order !== "number" || !Number.isInteger(order) || order < 1) {
    fail(slug, "series.order", "必须是从 1 开始的整数");
  }

  return { slug: seriesSlug, order };
}

function readFrontmatter(data: Record<string, unknown>, slug: string): NoteFrontmatter {
  return {
    title: readString(data.title, slug, "title"),
    summary: readString(data.summary, slug, "summary"),
    category: readCategory(data.category, slug),
    tags: readTags(data.tags, slug),
    publishedAt: readDate(data.publishedAt, slug),
    readTime: readString(data.readTime, slug, "readTime"),
    cover: readOptionalString(data.cover),
    series: readSeries(data.series, slug),
  };
}

function readOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function extractToc(source: string): TocItem[] {
  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];
  let insideFence = false;

  for (const line of source.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      insideFence = !insideFence;
      continue;
    }
    if (insideFence) continue;

    const matched = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!matched) continue;

    const text = matched[2];
    toc.push({ id: slugger.slug(text), text, depth: matched[1].length === 2 ? 2 : 3 });
  }

  return toc;
}

function parseNote(fileName: string): NoteDocument {
  const slug = fileName.replace(/\.mdx$/, "");

  if (RESERVED_NOTE_SLUGS.some((reserved) => reserved === slug)) {
    throw new Error(
      `content/notes/posts/${slug}.mdx 的文件名与玻璃系统功能页路由冲突，保留字：${RESERVED_NOTE_SLUGS.join(" / ")}`,
    );
  }

  const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), "utf8");
  const parsed = matter(raw);
  const frontmatter = readFrontmatter(parsed.data, slug);

  return {
    ...frontmatter,
    slug,
    displayDate: frontmatter.publishedAt.replace(/-/g, "."),
    source: parsed.content,
    toc: extractToc(parsed.content),
  };
}

function readAllNotes(): NoteDocument[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map(parseNote)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getAllNotes(): NoteMeta[] {
  return readAllNotes().map((note) => ({
    slug: note.slug,
    title: note.title,
    summary: note.summary,
    category: note.category,
    tags: note.tags,
    publishedAt: note.publishedAt,
    displayDate: note.displayDate,
    readTime: note.readTime,
    cover: note.cover,
    series: note.series,
  }));
}

export function getNote(slug: string): NoteDocument | undefined {
  return readAllNotes().find((note) => note.slug === slug);
}

export function getNoteGroups(): NoteGroup[] {
  const notes = getAllNotes();
  return NOTE_CATEGORIES.map((category) => ({
    category,
    notes: notes.filter((note) => note.category === category),
  })).filter((group) => group.notes.length > 0);
}

type SeriesNote = NoteMeta & { series: NoteSeriesRef };

function belongsTo(note: NoteMeta, seriesSlug: string): note is SeriesNote {
  return note.series?.slug === seriesSlug;
}

/** 已有文章的专栏，按 series.order 升序；空专栏不返回 */
export function getSeries(): NoteSeries[] {
  const notes = getAllNotes();

  return SERIES_DEFINITIONS.map((definition) => {
    const members = notes
      .filter((note): note is SeriesNote => belongsTo(note, definition.slug))
      .sort((a, b) => a.series.order - b.series.order);

    const orders = members.map((note) => note.series.order);
    if (new Set(orders).size !== orders.length) {
      throw new Error(`专栏 ${definition.slug} 存在重复的 series.order：${orders.join(", ")}`);
    }

    return { ...definition, notes: members };
  }).filter((series) => series.notes.length > 0);
}

export function getSeriesBySlug(slug: string): NoteSeries | undefined {
  return getSeries().find((series) => series.slug === slug);
}
