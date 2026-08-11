"use client";

import Link from "next/link";
import type { NoteMeta } from "@/content/notes/types";
import GlassShell, { PageTitle } from "../shell/GlassShell";
import Panel, { PanelEmpty, PanelList } from "../parts/Panel";
import NoteRow from "../parts/NoteRow";
import RecoCard, { CardStrip } from "../parts/RecoCard";
import BookmarkToggle from "../controls/BookmarkButton";
import { orderedSlugs, favoritesStore } from "../storage/bookmarks";
import { useStoreMap } from "../storage/useStore";
import styles from "../feature.module.css";

export default function Favorites({ notes }: { notes: NoteMeta[] }) {
  const entries = useStoreMap(favoritesStore);
  const bySlug = new Map(notes.map((note) => [note.slug, note]));
  const saved = orderedSlugs(entries).map((slug) => bySlug.get(slug)).filter((note): note is NoteMeta => Boolean(note));
  return <GlassShell active="favorites" path="/notes/favorites" headCenter={<PageTitle>收藏</PageTitle>} side={<><Panel title="最近收藏" hint={`${saved.length} 篇`}><PanelList>{saved.slice(0, 6).map((note) => <NoteRow key={note.slug} note={note} trailing={<BookmarkToggle slug={note.slug} kind="favorite" />} />)}{saved.length === 0 && <PanelEmpty>还没有收藏。读到喜欢的文章时，点一下心形即可留存。</PanelEmpty>}</PanelList></Panel><Panel title="收藏说明"><p className={styles.muted}>收藏是长期保留的阅读清单；它只存在于当前浏览器，不会上传到服务器。</p></Panel></>} main={<div className={styles.page}><div className={styles.intro}><p className={styles.eyebrow}>Your library</p><p className={styles.lead}>把真正想反复回看的工程判断放在这里。</p></div><CardStrip title={`全部收藏 · ${saved.length}`}><>{saved.map((note, index) => <RecoCard key={note.slug} item={{ key: note.slug, href: `/notes/${note.slug}`, title: note.title, category: note.category, meta: note.readTime, image: note.cover, slug: note.slug }} index={index} bottomRight={<BookmarkToggle slug={note.slug} kind="favorite" className="" iconSize={12} />} />)}{saved.length === 0 && <PanelEmpty>收藏列表还是空的。</PanelEmpty>}</></CardStrip><div className={styles.actions}><Link className={styles.action} href="/notes">继续发现文章</Link></div></div>} />;
}
