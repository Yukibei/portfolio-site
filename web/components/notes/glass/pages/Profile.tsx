"use client";

import Link from "next/link";
import type { NoteMeta } from "@/content/notes/types";
import GlassShell, { PageTitle } from "../shell/GlassShell";
import Panel, { PanelList } from "../parts/Panel";
import NoteRow from "../parts/NoteRow";
import { favoritesStore } from "../storage/bookmarks";
import { progressStore, isFinished } from "../storage/readingProgress";
import { useStoreMap } from "../storage/useStore";
import styles from "../feature.module.css";

export default function Profile({ notes }: { notes: NoteMeta[] }) {
  const favorites = useStoreMap(favoritesStore);
  const progress = useStoreMap(progressStore);
  const years = [...new Set(notes.map((note) => note.publishedAt.slice(0, 4)))];
  const finished = notes.filter((note) => isFinished(progress[note.slug])).length;
  return <GlassShell active="profile" path="/notes/profile" headCenter={<PageTitle>个人主页</PageTitle>} side={<><Panel title="关于作者"><p className={styles.lead}>李怡霖，做 AI 产品和全栈系统。喜欢把模糊的问题拆成可以验证的界面、数据和交付物。</p><div className={styles.actions}><Link className={styles.action} href="/about">查看完整履历</Link></div></Panel><Panel title="阅读统计"><div className={styles.stats}><div className={styles.stat}><strong className={styles.statValue}>{notes.length}</strong><span className={styles.statLabel}>篇笔记</span></div><div className={styles.stat}><strong className={styles.statValue}>{Object.keys(favorites).length}</strong><span className={styles.statLabel}>收藏</span></div><div className={styles.stat}><strong className={styles.statValue}>{finished}</strong><span className={styles.statLabel}>读完</span></div></div></Panel></>} main={<div className={styles.page}><div className={styles.intro}><p className={styles.eyebrow}>Author archive</p><p className={styles.lead}>这里记录产品、工程和复盘，不把经验包装成抽象口号。</p></div><Panel title="按年份归档"><div className={styles.timeline}>{years.map((year) => <section key={year}><p className={styles.eyebrow}>{year}</p>{notes.filter((note) => note.publishedAt.startsWith(year)).map((note) => <div className={styles.timelineItem} key={note.slug}><time className={styles.timelineDate}>{note.displayDate}</time><Link className={styles.timelineTitle} href={`/notes/${note.slug}`}>{note.title}</Link></div>)}</section>)}</div></Panel><Panel title="最近发布"><PanelList>{notes.slice(0, 4).map((note) => <NoteRow key={note.slug} note={note} />)}</PanelList></Panel></div>} />;
}
