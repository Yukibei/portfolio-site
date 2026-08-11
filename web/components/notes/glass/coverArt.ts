import type { CSSProperties } from "react";
import type { NoteCategory } from "@/content/notes/types";

/** 笔记没有封面图，按分类映射固定渐变，生成书封形态的色块 */
const CATEGORY_GRADIENTS: Record<NoteCategory, string> = {
  "AI 应用": "linear-gradient(165deg, #2b3fa0, #5a2c8f 55%, #171a3a)",
  工程实践: "linear-gradient(165deg, #57636b, #39424a 55%, #191d24)",
  项目复盘: "linear-gradient(165deg, #8a4a2c, #5c3a30 55%, #20242f)",
};

export function coverStyle(category: NoteCategory): CSSProperties {
  return { "--cover-gradient": CATEGORY_GRADIENTS[category] } as CSSProperties;
}
