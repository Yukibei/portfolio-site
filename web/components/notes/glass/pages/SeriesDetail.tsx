"use client";

import Link from "next/link";
import type { NoteSeries } from "@/content/notes/types";
import GlassShell, { PageTitle } from "../shell/GlassShell";
import Panel, { PanelEmpty, PanelList } from "../parts/Panel";
import NoteRow, { ProgressBar, RowPercent } from "../parts/NoteRow";
import { progressStore } from "../storage/readingProgress";
import { useStoreMap } from "../storage/useStore";
import styles from "../feature.module.css";

export default function SeriesDetail({ series }: { series: NoteSeries }) {
  const progress = useStoreMap(progressStore);
  const total = series.notes.length * 100;
  const completed = series.notes.reduce((sum, note) => sum + (progress[note.slug]?.percent ?? 0), 0);
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return <GlassShell active="home" path={`/notes/series/${series.slug}`} headCenter={<PageTitle>{series.title}</PageTitle>} side={<><Panel title="专栏进度" hint={`${percent}%`}><ProgressBar percent={percent} /><p className={styles.muted}>{series.notes.length} 篇文章 · 逐篇记录阅读位置</p></Panel><Panel title="关于专栏"><p className={styles.muted}>{series.summary}</p></Panel></>} main={<div className={styles.page}><div className={styles.intro}><p className={styles.eyebrow}>Series / {series.slug}</p><p className={styles.lead}>{series.summary}</p></div><Panel title="目录"><PanelList>{series.notes.map((note) => <NoteRow key={note.slug} note={note} sub={<><span className={styles.muted}>第 {note.series?.order ?? 0} 篇 · {progress[note.slug]?.percent ?? 0}%</span><ProgressBar percent={progress[note.slug]?.percent ?? 0} /></>} trailing={<RowPercent percent={progress[note.slug]?.percent ?? 0} />} />)}{series.notes.length === 0 && <PanelEmpty>这个专栏还没有文章。</PanelEmpty>}</PanelList></Panel><div className={styles.actions}><Link className={styles.action} href="/notes">返回全部笔记</Link></div></div>} />;
}
