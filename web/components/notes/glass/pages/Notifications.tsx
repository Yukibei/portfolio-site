import Link from "next/link";
import type { NoteMeta, NoteSeries } from "@/content/notes/types";
import GlassShell, { PageTitle } from "../shell/GlassShell";
import Panel, { PanelEmpty } from "../parts/Panel";
import styles from "../feature.module.css";

export default function Notifications({ notes, series }: { notes: NoteMeta[]; series: NoteSeries[] }) {
  const events = notes.slice(0, 8).map((note) => ({ date: note.displayDate, title: `发布了新笔记：${note.title}`, href: `/notes/${note.slug}`, detail: note.summary }));
  const seriesEvents = series.map((item) => ({ date: item.notes.at(-1)?.displayDate ?? "", title: `专栏更新：${item.title}`, href: `/notes/series/${item.slug}`, detail: `${item.notes.length} 篇文章已加入目录` }));
  const all = [...events, ...seriesEvents].sort((a, b) => b.date.localeCompare(a.date));
  return <GlassShell active="home" path="/notes/notifications" headCenter={<PageTitle>提醒中心</PageTitle>} hasUnread={all.length > 0} side={<Panel title="提醒来源"><p className={styles.muted}>提醒由文章的 publishedAt 和专栏目录实时推导，不维护一份容易过期的假数据。</p></Panel>} main={<div className={styles.page}><div className={styles.intro}><p className={styles.eyebrow}>Notifications</p><p className={styles.lead}>最近发生在这个笔记系统里的更新。</p></div><Panel title="最近更新">{all.length === 0 ? <PanelEmpty>暂时没有新的更新。</PanelEmpty> : <div className={styles.timeline}>{all.map((event) => <div className={styles.timelineItem} key={`${event.date}-${event.title}`}><time className={styles.timelineDate}>{event.date}</time><div><Link className={styles.timelineTitle} href={event.href}>{event.title}</Link><p className={styles.muted}>{event.detail}</p></div></div>)}</div>}</Panel></div>} />;
}
