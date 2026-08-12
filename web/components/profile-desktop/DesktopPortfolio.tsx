"use client";

import { useState } from "react";
import Link from "next/link";
import DesktopWallpaper from "./DesktopWallpaper";
import DesktopWindow from "./DesktopWindow";
import Dock from "./Dock";
import ProjectCard from "./ProjectCard";
import { projects, type DesktopProject } from "./data";
import ProjectDetails from "./project/ProjectDetails";

type OpenWindow =
  | { kind: "about" }
  | { kind: "notes" }
  | { kind: "project"; project: DesktopProject };

export default function DesktopPortfolio() {
  const [openWindow, setOpenWindow] = useState<OpenWindow | null>(null);

  const openProject = (project: DesktopProject) => {
    setOpenWindow({ kind: "project", project });
  };

  return (
    <section aria-label="个人桌面作品集" style={{ position: "relative", width: "100%", height: "100vh", minHeight: 640, overflow: "hidden", background: "white", fontFamily: "Inter, sans-serif" }}>
      <DesktopWallpaper />
      <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(84,84,84,0) 0%, rgb(0,0,0) 100%)", opacity: .4, pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: 0, left: "50%", zIndex: 1, width: "100%", height: "47.375%", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", maskImage: "linear-gradient(to bottom, transparent 0%, black 40%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 40%)", pointerEvents: "none", transform: "translateX(-50%)" }} />

      {projects.map((project) => (
        <ProjectCard key={project.label} project={project} onOpen={openProject} />
      ))}

      <Dock onOpenWindow={(kind) => setOpenWindow({ kind })} />

      {openWindow?.kind === "about" ? (
        <DesktopWindow title="About Me" onClose={() => setOpenWindow(null)}>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-.04em" }}>李怡霖 · Yiling Li</p>
          <p style={{ margin: 0, color: "#666", fontSize: 15, lineHeight: 1.75 }}>AI 应用与全栈开发者。我关注的不只是模型效果，而是从交互、服务、数据链路到部署运维的完整交付。</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
            {["RAG", "Multi-Agent", "Java", "Next.js", "Docker", "ReID"].map((item) => <span key={item} style={{ padding: "10px 12px", borderRadius: 10, background: "#f2f2f4", fontSize: 13 }}>{item}</span>)}
          </div>
        </DesktopWindow>
      ) : null}

      {openWindow?.kind === "notes" ? (
        <DesktopWindow title="Notes" onClose={() => setOpenWindow(null)}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: "-.04em" }}>Notes from the build.</p>
          <p style={{ margin: 0, color: "#666", fontSize: 15, lineHeight: 1.75 }}>记录项目决策、工程复盘与正在学习的内容。</p>
          <Link href="/notes" style={{ alignSelf: "flex-start", padding: "10px 16px", borderRadius: 999, background: "#111", color: "white", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>进入 Notes</Link>
        </DesktopWindow>
      ) : null}

      {openWindow?.kind === "project" ? (
        <DesktopWindow title={openWindow.project.label} wide onClose={() => setOpenWindow(null)}>
          <ProjectDetails project={openWindow.project} />
        </DesktopWindow>
      ) : null}
    </section>
  );
}
