"use client";

import { useState } from "react";
import { dockItems, type DockItem } from "./data";

type DockProps = {
  onOpenWindow: (window: "about" | "notes") => void;
};

type DockButtonProps = Pick<DockItem, "label" | "icon" | "iconMode" | "href"> & {
  onClick?: () => void;
};

function DockButton({ label, icon, iconMode = "full", href, onClick }: DockButtonProps) {
  const [hovered, setHovered] = useState(false);
  const imageStyle: React.CSSProperties = iconMode === "photo"
    ? { width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 18%", transform: "scale(1.55)", transformOrigin: "50% 26%" }
    : { width: "100%", height: "100%", padding: iconMode === "contained" ? 7 : 0, objectFit: "contain" };
  const content = (
    <>
      <span style={{ position: "absolute", bottom: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)", padding: "6px 12px", borderRadius: 64, background: "white", boxShadow: "0 4px 16px rgba(0,0,0,.12)", color: "black", fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 500, letterSpacing: "-.04em", whiteSpace: "nowrap", opacity: hovered ? 1 : 0, pointerEvents: "none", transition: "opacity .15s ease" }}>
        {label}
        <span style={{ position: "absolute", left: "50%", top: "100%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "8px solid white" }} />
      </span>
      <span aria-hidden style={{ display: "block", width: "100%", height: "100%", overflow: "hidden", borderRadius: "28%", background: "rgba(255,255,255,.96)", boxShadow: "0 1px 2px rgba(0,0,0,.08)" }}>
        <img src={icon} alt="" draggable={false} style={imageStyle} />
      </span>
    </>
  );

  const style: React.CSSProperties = {
    position: "relative",
    display: "block",
    width: 48,
    height: 48,
    padding: 0,
    overflow: "visible",
    border: 0,
    borderRadius: "28%",
    background: "transparent",
    cursor: "pointer",
    transform: `scale(${hovered ? 1.12 : 1})`,
    transition: "transform .2s cubic-bezier(.34,1.56,.64,1)",
  };

  if (href) {
    return <a href={href} target="_blank" rel="noreferrer" aria-label={label} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={style}>{content}</a>;
  }

  return <button type="button" aria-label={label} onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={style}>{content}</button>;
}

export default function Dock({ onOpenWindow }: DockProps) {
  return (
    <nav aria-label="桌面快捷入口" style={{ position: "absolute", bottom: 64, left: "50%", zIndex: 4, display: "flex", alignItems: "center", gap: 16, padding: 12, border: "1px solid rgba(255,255,255,.2)", borderRadius: 24, background: "rgba(255,255,255,.1)", backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)", transform: "translateX(-50%)" }}>
      {dockItems.map((item, index) => {
        const target = item.window;

        return (
          <div key={item.label} style={{ display: "contents" }}>
            {index === 2 ? <span aria-hidden style={{ width: 1, height: 48, borderRadius: 64, background: "rgba(255,255,255,.2)" }} /> : null}
            <DockButton label={item.label} icon={item.icon} iconMode={item.iconMode} href={item.href} onClick={target ? () => onOpenWindow(target) : undefined} />
          </div>
        );
      })}
    </nav>
  );
}
