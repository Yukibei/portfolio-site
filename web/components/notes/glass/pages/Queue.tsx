"use client";

import Link from "next/link";
import type { NoteMeta } from "@/content/notes/types";
import GlassShell, { PageTitle } from "../shell/GlassShell";
import Panel, { PanelEmpty, PanelList } from "../parts/Panel";
import NoteRow, { ProgressBar, RowPercent } from "../parts/NoteRow";
import BookmarkToggle from "../controls/BookmarkButton";
import { orderedSlugs, queueStore } from "../storage/bookmarks";
import { isFinished, progressStore } from "../storage/readingProgress";
import { useStoreMap } from "../storage/useStore";
import styles from "../feature.module.css";

export default function Queue({ notes }: { notes: NoteMeta[] }) {
  const queue = useStoreMap(queueStore);
  const progress = useStoreMap(progressStore);
  const bySlug = new Map(notes.map((note) => [note.slug, note]));
  const queued = orderedSlugs(queue).map((slug) => bySlug.get(slug)).filter((note): note is NoteMeta => Boolean(note));
  const finished = notes.filter((note) => isFinished(progress[note.slug]));
  return <GlassShell active="queue" path="/notes/queue" headCenter={<PageTitle>稍后读</PageTitle>} side={<><Panel title="队列状态" hint={`${queued.length} 篇`}><PanelList>{queued.slice(0, 6).map((note) => <NoteRow key={note.slug} note={note} sub={<ProgressBar percent={progress[note.slug]?.percent ?? 0} />} trailing={<RowPercent percent={progress[note.slug]?.percent ?? 0} />} />)}{queued.length === 0 && <PanelEmpty>把还没读完的文章放进来，下一次从这里继续。</PanelEmpty>}</PanelList></Panel><Panel title="已读完归档" hint={`${finished.length} 篇`}><PanelList>{finished.map((note) => <NoteRow key={note.slug} note={note} trailing={<BookmarkToggle slug={note.slug} kind="queue" />} />)}{finished.length === 0 && <PanelEmpty>读完的文章会出现在这里。</PanelEmpty>}</PanelList></Panel></>} main={<div className={styles.page}><div className={styles.intro}><p className={styles.eyebrow}>Read later</p><p className={styles.lead}>按加入顺序整理你的阅读队列，进度来自文章页的真实滚动位置。</p></div><Panel title="待阅读清单"><PanelList>{queued.map((note) => <NoteRow key={note.slug} note={note} sub={<><span className={styles.muted}>{progress[note.slug]?.percent ?? 0}% 已读</span><ProgressBar percent={progress[note.slug]?.percent ?? 0} /></>} trailing={<BookmarkToggle slug={note.slug} kind="queue" />} />)}{queued.length === 0 && <PanelEmpty>队列为空。<br /><Link href="/notes">回首页挑一篇</Link></PanelEmpty>}</PanelList></Panel></div>} />;
}
