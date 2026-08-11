"use client";

import type { NoteMeta } from "@/content/notes/types";
import Panel, { PanelEmpty, PanelList } from "../parts/Panel";
import NoteRow, { ProgressBar, RowPercent } from "../parts/NoteRow";
import { isInProgress, progressStore, type ProgressEntry } from "../storage/readingProgress";
import { useStoreMap } from "../storage/useStore";

type Tracked = {
  note: NoteMeta;
  entry: ProgressEntry;
};

/** 从 localStorage 读真实滚动进度，按最近阅读排序 */
export default function ContinueReading({ notes }: { notes: NoteMeta[] }) {
  const progress = useStoreMap(progressStore);

  const items: Tracked[] = [];
  for (const note of notes) {
    const entry = progress[note.slug];
    if (!isInProgress(entry)) continue;
    items.push({ note, entry });
  }
  items.sort((a, b) => b.entry.updatedAt - a.entry.updatedAt);

  return (
    <Panel title="继续阅读" hint={items.length > 0 ? "按最近阅读" : undefined}>
      {items.length === 0 ? (
        <PanelEmpty>
          打开任意一篇笔记，
          <br />
          这里会记住你读到的位置。
        </PanelEmpty>
      ) : (
        <PanelList>
          {items.map(({ note, entry }) => (
            <NoteRow
              key={note.slug}
              note={note}
              sub={<ProgressBar percent={entry.percent} />}
              trailing={<RowPercent percent={entry.percent} />}
            />
          ))}
        </PanelList>
      )}
    </Panel>
  );
}
