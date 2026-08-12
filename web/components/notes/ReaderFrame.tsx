"use client";

import type { ReactNode } from "react";
import {
  getPreferences,
  preferencesStore,
} from "./glass/storage/preferences";
import { useStoreMap } from "./glass/storage/useStore";
import styles from "./ReaderFrame.module.css";

export default function ReaderFrame({ children }: { children: ReactNode }) {
  const entries = useStoreMap(preferencesStore);
  const preferences = getPreferences(entries);

  return (
    <div className={styles.root} data-text-scale={preferences.textScale}>
      {children}
    </div>
  );
}
