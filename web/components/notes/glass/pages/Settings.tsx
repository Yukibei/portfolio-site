"use client";

import { useState, type ChangeEvent } from "react";
import GlassShell, { PageTitle } from "../shell/GlassShell";
import Panel from "../parts/Panel";
import { favoritesStore, queueStore } from "../storage/bookmarks";
import {
  getPreferences,
  preferencesStore,
  setTextScale,
  type TextScale,
} from "../storage/preferences";
import { progressStore } from "../storage/readingProgress";
import { useStoreMap } from "../storage/useStore";
import styles from "../feature.module.css";

export default function Settings() {
  const [message, setMessage] = useState("");
  const preferenceEntries = useStoreMap(preferencesStore);
  const preferences = getPreferences(preferenceEntries);

  function exportData() {
    const payload = {
      favorites: favoritesStore.read(),
      queue: queueStore.read(),
      progress: progressStore.read(),
      preferences: preferencesStore.read(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "notes-data.json";
    link.click();
    URL.revokeObjectURL(link.href);
    setMessage("已导出当前浏览器中的阅读数据与偏好");
  }

  function changeTextScale(event: ChangeEvent<HTMLSelectElement>) {
    setTextScale(event.target.value as TextScale);
    setMessage("阅读文字大小已更新");
  }

  function clearData() {
    if (!window.confirm("确定清除这台设备上的全部笔记阅读数据吗？")) return;
    favoritesStore.clear();
    queueStore.clear();
    progressStore.clear();
    preferencesStore.clear();
    setMessage("已清除收藏、稍后读、阅读进度和阅读偏好");
  }

  return (
    <GlassShell
      active="settings"
      path="/notes/settings"
      headCenter={<PageTitle>设置</PageTitle>}
      side={
        <>
          <Panel title="阅读偏好">
            <label className={styles.muted}>
              正文文字大小
              <select
                className={styles.select}
                value={preferences.textScale}
                onChange={changeTextScale}
              >
                <option value="default">标准</option>
                <option value="large">稍大</option>
                <option value="compact">紧凑</option>
              </select>
            </label>
            <p className={styles.muted}>选择会立即应用到文章正文，并保存在当前浏览器。</p>
          </Panel>
          <Panel title="数据范围">
            <p className={styles.muted}>收藏、稍后读、进度和阅读偏好均保存在本机，不会上传。</p>
          </Panel>
        </>
      }
      main={
        <div className={styles.page}>
          <div className={styles.intro}>
            <p className={styles.eyebrow}>Local preferences</p>
            <p className={styles.lead}>调整阅读体验，管理这台设备上的本地数据。</p>
          </div>
          <Panel title="数据管理">
            <div className={styles.actions}>
              <button className={styles.action} type="button" onClick={exportData}>
                导出阅读数据
              </button>
              <button
                className={`${styles.action} ${styles.actionDanger}`}
                type="button"
                onClick={clearData}
              >
                清除全部数据
              </button>
            </div>
            {message && <p className={styles.muted} role="status">{message}</p>}
          </Panel>
        </div>
      }
    />
  );
}
