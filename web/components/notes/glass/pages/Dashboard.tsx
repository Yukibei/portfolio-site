import Link from "next/link";
import type { NoteCategory, NoteMeta } from "@/content/notes/types";
import GlassShell from "../shell/GlassShell";
import CategoryTabs from "../shell/CategoryTabs";
import Panel, { PanelEmpty, PanelList } from "../parts/Panel";
import NoteRow from "../parts/NoteRow";
import Hero, { heroStyles } from "../parts/Hero";
import RecoCard, { CardStrip, cardStyles, type RecoItem } from "../parts/RecoCard";
import BookmarkToggle from "../controls/BookmarkButton";
import { BookIcon, ChevronLeftIcon, ChevronRightIcon } from "../controls/icons";
import controls from "../controls/controls.module.css";
import ContinueReading from "./ContinueReading";

const RECO_LIMIT = 5;

type DashboardProps = {
  /** 当前分类下的笔记，驱动 hero / 最新发布 / 推荐卡片 */
  notes: NoteMeta[];
  /** 全量笔记，「继续阅读」与筛选无关 */
  allNotes: NoteMeta[];
  /** 文章不足时补进推荐位的项目卡 */
  projectRecos: RecoItem[];
  activeCategory: NoteCategory | null;
  /** hero 展示第几篇，由 ?hero= 驱动，箭头真实翻页 */
  heroIndex: number;
};

function noteToReco(note: NoteMeta): RecoItem {
  return {
    key: `note-${note.slug}`,
    href: `/notes/${note.slug}`,
    title: note.title,
    category: note.category,
    meta: note.readTime,
    image: note.cover,
    slug: note.slug,
  };
}

function heroHref(category: NoteCategory | null, index: number) {
  const query: Record<string, string> = {};
  if (category !== null) query.category = category;
  if (index > 0) query.hero = String(index);
  return { pathname: "/notes", query };
}

export default function Dashboard({
  notes,
  allNotes,
  projectRecos,
  activeCategory,
  heroIndex,
}: DashboardProps) {
  const hero = notes.at(heroIndex);
  const rest = notes.filter((_, index) => index !== heroIndex);
  const recos = [...rest.map(noteToReco), ...projectRecos].slice(0, RECO_LIMIT);

  const hasPrev = heroIndex > 0;
  const hasNext = heroIndex < notes.length - 1;

  return (
    <GlassShell
      active="home"
      path="/notes"
      headCenter={<CategoryTabs active={activeCategory} />}
      side={
        <>
          <Panel title="最新发布" hint="按发布时间">
            {notes.length === 0 ? (
              <PanelEmpty>这个分类还没有文章。</PanelEmpty>
            ) : (
              <PanelList>
                {notes.map((note) => (
                  <NoteRow
                    key={note.slug}
                    note={note}
                    trailing={<BookmarkToggle slug={note.slug} kind="favorite" />}
                  />
                ))}
              </PanelList>
            )}
          </Panel>

          <ContinueReading notes={allNotes} />
        </>
      }
      main={
        <>
          {hero ? (
            <Hero
              image={hero.cover}
              chips={[hero.category, ...hero.tags.slice(0, 2)]}
              title={hero.title}
              author={`李怡霖 · ${hero.displayDate}`}
              desc={hero.summary}
              actions={
                <>
                  <Link href={`/notes/${hero.slug}`} className={heroStyles.primary}>
                    <BookIcon size={15} />
                    阅读全文
                  </Link>
                  <BookmarkToggle
                    slug={hero.slug}
                    kind="favorite"
                    className={heroStyles.ghost}
                    showLabel
                    iconSize={15}
                  />
                  <BookmarkToggle
                    slug={hero.slug}
                    kind="queue"
                    className={heroStyles.ghost}
                    showLabel
                    iconSize={15}
                  />
                </>
              }
              arrows={
                notes.length > 1 ? (
                  <>
                    <Link
                      href={heroHref(activeCategory, heroIndex - 1)}
                      className={`${heroStyles.arrow} ${hasPrev ? "" : heroStyles.arrowDim}`}
                      aria-disabled={!hasPrev}
                      aria-label="上一篇"
                    >
                      <ChevronLeftIcon size={14} />
                    </Link>
                    <Link
                      href={heroHref(activeCategory, heroIndex + 1)}
                      className={`${heroStyles.arrow} ${hasNext ? "" : heroStyles.arrowDim}`}
                      aria-disabled={!hasNext}
                      aria-label="下一篇"
                    >
                      <ChevronRightIcon size={14} />
                    </Link>
                  </>
                ) : undefined
              }
            />
          ) : (
            <Hero title="这个分类还没有文章" desc="换一个分类，或回到全部笔记看看。" />
          )}

          <CardStrip
            title="你可能想读"
            action={
              activeCategory !== null ? (
                <Link href="/notes" className={cardStyles.seeAll}>
                  查看全部
                </Link>
              ) : undefined
            }
          >
            {recos.map((item, index) => (
              <RecoCard
                key={item.key}
                item={item}
                index={index}
                topRight={
                  item.slug !== undefined ? (
                    <BookmarkToggle
                      slug={item.slug}
                      kind="queue"
                      className={controls.circle}
                      iconSize={12}
                    />
                  ) : undefined
                }
                bottomRight={
                  item.slug !== undefined ? (
                    <BookmarkToggle
                      slug={item.slug}
                      kind="favorite"
                      className={controls.circleSolid}
                      iconSize={12}
                    />
                  ) : undefined
                }
              />
            ))}
          </CardStrip>
        </>
      }
    />
  );
}
