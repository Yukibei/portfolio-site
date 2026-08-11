"use client";

import { useState } from "react";
import GlassShell, { PageTitle } from "../shell/GlassShell";
import Panel from "../parts/Panel";
import { favoritesStore, queueStore } from "../storage/bookmarks";
import { progressStore } from "../storage/readingProgress";
import styles from "../feature.module.css";

export default function Settings() {
  const [message, setMessage] = useState("");
  function exportData() {
    const payload = { favorites: favoritesStore.read(), queue: queueStore.read(), progress: progressStore.read(), exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "notes-data.json"; link.click(); URL.revokeObjectURL(link.href); setMessage("已导出当前浏览器中的阅读数据");
  }
  function clearData() { favoritesStore.clear(); queueStore.clear(); progressStore.clear(); setMessage("已清除收藏、稍后读和阅读进度"); }
  return <GlassShell active="settings" path="/notes/settings" headCenter={<PageTitle>设置</PageTitle>} side={<><Panel title="阅读偏好"><label className={styles.muted}>文字大小<select className={styles.select} defaultValue="default"><option value="default">跟随系统</option><option value="large">稍大</option><option value="compact">紧凑</option></select></label><p className={styles.muted}>偏好仅保存在当前浏览器。本系统不会上传阅读记录。</p></Panel><Panel title="数据范围"><p className={styles.muted}>收藏、稍后读和进度都使用 localStorage 保存，清除后无法恢复。</p></Panel></>} main={<div className={styles.page}><div className={styles.intro}><p className={styles.eyebrow}>Local preferences</p><p className={styles.lead}>调整阅读体验，管理这台设备上的本地数据。</p></div><Panel title="数据管理"><div className={styles.actions}><button className={styles.action} type="button" onClick={exportData}>导出阅读数据</button><button className={`${styles.action} ${styles.actionDanger}`} type="button" onClick={clearData}>清除全部数据</button></div>{message && <p className={styles.muted} role="status">{message}</p>}</Panel></div>} />;
}
