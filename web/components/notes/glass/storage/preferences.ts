import { createMapStore } from "./localStore";

export const TEXT_SCALES = ["compact", "default", "large"] as const;
export type TextScale = (typeof TEXT_SCALES)[number];

export type ReaderPreferences = {
  textScale: TextScale;
};

const PREFERENCES_KEY = "reader";
export const DEFAULT_PREFERENCES: ReaderPreferences = { textScale: "default" };

function isReaderPreferences(value: unknown): value is ReaderPreferences {
  if (typeof value !== "object" || value === null) return false;
  const textScale = (value as Record<string, unknown>).textScale;
  return TEXT_SCALES.some((value) => value === textScale);
}

export const preferencesStore = createMapStore<ReaderPreferences>(
  "notes:preferences",
  isReaderPreferences,
);

export function getPreferences(
  entries: Readonly<Record<string, ReaderPreferences>>,
): ReaderPreferences {
  return entries[PREFERENCES_KEY] ?? DEFAULT_PREFERENCES;
}

export function setTextScale(textScale: TextScale): void {
  preferencesStore.set(PREFERENCES_KEY, { textScale });
}
