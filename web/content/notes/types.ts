export const NOTE_CATEGORIES = ["AI 应用", "工程实践", "项目复盘"] as const;

export type NoteCategory = (typeof NOTE_CATEGORIES)[number];

export type NoteFrontmatter = {
  title: string;
  summary: string;
  category: NoteCategory;
  tags: string[];
  publishedAt: string;
  readTime: string;
};

export type TocItem = {
  id: string;
  text: string;
  depth: 2 | 3;
};

export type NoteMeta = NoteFrontmatter & {
  slug: string;
  displayDate: string;
};

export type NoteDocument = NoteMeta & {
  source: string;
  toc: TocItem[];
};

export type NoteGroup = {
  category: NoteCategory;
  notes: NoteMeta[];
};
