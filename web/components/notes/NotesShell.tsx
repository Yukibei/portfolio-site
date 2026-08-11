import type { ReactNode } from "react";
import NotesSidebar from "./NotesSidebar";
import { getNoteGroups } from "@/content/notes";

type NotesShellProps = {
  children: ReactNode;
  aside?: ReactNode;
};

export default function NotesShell({ children, aside }: NotesShellProps) {
  const groups = getNoteGroups();

  return (
    <main id="main-content" className="min-h-screen bg-black">
      <div className="mx-auto flex max-w-[1500px] gap-10 px-6 pb-28 pt-32 md:px-10 md:pt-40 lg:gap-14 lg:px-16">
        <aside className="hidden w-52 shrink-0 lg:block">
          <div className="sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto pr-2">
            <NotesSidebar groups={groups} />
          </div>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>

        {aside ? (
          <aside className="hidden w-52 shrink-0 xl:block">
            <div className="sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto pl-2">
              {aside}
            </div>
          </aside>
        ) : null}
      </div>
    </main>
  );
}
