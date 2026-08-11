import Link from "next/link";
import type { NoteMeta } from "@/content/notes/types";
import GlassShell from "./GlassShell";
import ContinueReadingPanel from "./ContinueReadingPanel";
import { coverStyle } from "./coverArt";
import styles from "./GlassDashboard.module.css";

type GlassDashboardProps = {
  /** 当前筛选下的笔记，驱动 hero / 最新发布 / 推荐卡片 */
  notes: NoteMeta[];
  /** 全量笔记，「继续阅读」与筛选无关 */
  allNotes: NoteMeta[];
  activeCategory: string | null;
};

function ReleaseRow({ note }: { note: NoteMeta }) {
  return (
    <Link href={`/notes/${note.slug}`} className={styles.row}>
      <span className={styles.cover} style={coverStyle(note.category)} aria-hidden>
        {note.category.slice(0, 1)}
      </span>
      <span className={styles.rowText}>
        <span className={styles.rowTitle}>{note.title}</span>
        <span className={styles.rowMeta}>
          {note.displayDate} · {note.readTime}
        </span>
      </span>
    </Link>
  );
}

function Hero({ note }: { note: NoteMeta }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroShade} />
      <div className={styles.heroBody}>
        <div className={styles.chips}>
          <span className={styles.chip}>{note.category}</span>
          {note.tags.slice(0, 2).map((tag) => (
            <span key={tag} className={styles.chip}>
              {tag}
            </span>
          ))}
        </div>
        <h1 className={styles.heroTitle}>{note.title}</h1>
        <p className={styles.heroDesc}>{note.summary}</p>
        <div className={styles.heroButtons}>
          <Link href={`/notes/${note.slug}`} className={styles.heroRead}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 5.5A2.5 2.5 0 016.5 3H19v15H6.5A2.5 2.5 0 004 20.5z" />
              <path d="M4 20.5A2.5 2.5 0 016.5 18H19v3H6.5" />
            </svg>
            阅读全文
          </Link>
          <span className={styles.heroMeta}>
            {note.displayDate} · {note.readTime}
          </span>
        </div>
      </div>
    </section>
  );
}

function RecoCard({ note }: { note: NoteMeta }) {
  return (
    <Link href={`/notes/${note.slug}`} className={styles.card} style={coverStyle(note.category)}>
      <div className={styles.cardFade} />
      <span className={styles.cardCategory}>{note.category}</span>
      <span className={styles.cardTitle}>{note.title}</span>
      <span className={styles.cardMeta}>{note.readTime}</span>
    </Link>
  );
}

export default function GlassDashboard({ notes, allNotes, activeCategory }: GlassDashboardProps) {
  const hero = notes.at(0);
  const recos = notes.length > 1 ? notes.slice(1) : notes;

  return (
    <GlassShell
      activeCategory={activeCategory}
      side={
        <>
          <section className={styles.panel}>
            <div className={styles.panelHead}>
              <h2 className={styles.panelTitle}>最新发布</h2>
              <span className={styles.panelHint}>按发布时间</span>
            </div>
            {notes.length === 0 ? (
              <p className={styles.empty}>这个分类还没有文章。</p>
            ) : (
              <div className={styles.list}>
                {notes.map((note) => (
                  <ReleaseRow key={note.slug} note={note} />
                ))}
              </div>
            )}
          </section>

          <ContinueReadingPanel notes={allNotes} />
        </>
      }
      main={
        <>
          {hero ? (
            <Hero note={hero} />
          ) : (
            <section className={styles.hero}>
              <div className={styles.heroBody}>
                <h1 className={styles.heroTitle}>这个分类还没有文章</h1>
                <p className={styles.heroDesc}>换一个分类，或回到全部笔记看看。</p>
              </div>
            </section>
          )}

          <div className={styles.reco}>
            <div className={styles.recoHead}>
              <h2 className={styles.recoTitle}>你可能想读</h2>
              {activeCategory !== null && (
                <Link href="/notes" className={styles.panelHint}>
                  查看全部
                </Link>
              )}
            </div>
            <div className={styles.strip}>
              {recos.map((note) => (
                <RecoCard key={note.slug} note={note} />
              ))}
            </div>
          </div>
        </>
      }
    />
  );
}
