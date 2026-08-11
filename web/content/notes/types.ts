export const NOTE_CATEGORIES = ["AI 应用", "工程实践", "项目复盘"] as const;

export type NoteCategory = (typeof NOTE_CATEGORIES)[number];

/** 玻璃系统的功能页占用这些一级路径，文章 slug 不得与之冲突 */
export const RESERVED_NOTE_SLUGS = [
  "favorites",
  "queue",
  "profile",
  "settings",
  "notifications",
  "series",
] as const;

/** 文章在专栏中的位置；order 从 1 开始，同专栏内不得重复 */
export type NoteSeriesRef = {
  slug: string;
  order: number;
};

export type NoteFrontmatter = {
  title: string;
  summary: string;
  category: NoteCategory;
  tags: string[];
  publishedAt: string;
  readTime: string;
  /** 站内图片路径，可选；缺省时封面用分类渐变兜底 */
  cover?: string;
  series?: NoteSeriesRef;
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

/** 专栏元信息，手写在 series.ts；文章列表由 index.ts 按 order 组装 */
export type SeriesDefinition = {
  slug: string;
  title: string;
  summary: string;
  cover?: string;
};

export type NoteSeries = SeriesDefinition & {
  notes: NoteMeta[];
};
