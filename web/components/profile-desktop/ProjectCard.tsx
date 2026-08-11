"use client";

import { useState } from "react";
import { useDraggable } from "./useDraggable";
import type { DesktopProject } from "./data";

type ProjectCardProps = {
  project: DesktopProject;
  onOpen: (project: DesktopProject) => void;
};

export default function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const drag = useDraggable();
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      aria-label={`打开项目 ${project.label}`}
      onPointerDown={drag.onPointerDown}
      onPointerMove={drag.onPointerMove}
      onPointerCancel={drag.onPointerUp}
      onPointerUp={() => {
        drag.onPointerUp();
        if (!drag.isDraggingRef.current.moved) onOpen(project);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "absolute",
        left: `calc(${project.anchorX}% - 52px)`,
        top: `calc(${project.anchorY}% - 64px)`,
        transform: `translate(${drag.pos.x}px, ${drag.pos.y}px)`,
        zIndex: 2,
        cursor: drag.isDraggingRef.current.active ? "grabbing" : "grab",
        userSelect: "none",
        border: 0,
        padding: 0,
        background: "transparent",
        color: "inherit",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        touchAction: "none",
      }}
    >
      <span style={{ padding: 12, borderRadius: 8, border: `2px solid ${hovered ? "rgba(255,255,255,.2)" : "transparent"}`, background: hovered ? "rgba(0,0,0,.16)" : "transparent", transition: "background .18s ease, border-color .18s ease" }}>
        <img src={project.thumbnail} alt="" draggable={false} style={{ display: "block", width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1px solid rgba(255,255,255,.2)", boxShadow: "0 1px 6px rgba(0,0,0,.08)" }} />
      </span>
      <span style={{ padding: hovered ? "4px 8px" : "4px 0", borderRadius: 4, background: hovered ? "rgb(0,102,221)" : "transparent", color: "rgb(247,247,247)", fontFamily: "Inter, sans-serif", fontSize: 16, fontWeight: 400, lineHeight: 1.4, letterSpacing: "-.04em", whiteSpace: "nowrap", transition: "background .18s ease, padding .18s ease" }}>
        {project.label}
      </span>
    </button>
  );
}
