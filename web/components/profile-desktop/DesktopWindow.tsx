"use client";

import { useEffect, useRef, useState } from "react";

type DesktopWindowProps = {
  title: string;
  wide?: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function DesktopWindow({ title, wide = false, onClose, children }: DesktopWindowProps) {
  const [entered, setEntered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef({ active: false, sx: 0, sy: 0, ox: 0, oy: 0 });

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { active: true, sx: event.clientX, sy: event.clientY, ox: position.x, oy: position.y };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    setPosition({ x: drag.ox + event.clientX - drag.sx, y: drag.oy + event.clientY - drag.sy });
  };

  return (
    <div role="presentation" style={{ position: "fixed", inset: 0, zIndex: 50, pointerEvents: "none" }}>
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: wide ? "min(70vw, 840px)" : "min(60vw, 720px)",
          minWidth: "min(88vw, 340px)",
          maxHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: 24,
          background: "white",
          boxShadow: "0 32px 80px rgba(0,0,0,.28)",
          pointerEvents: "auto",
          opacity: entered ? 1 : 0,
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${entered ? 1 : .8})`,
          transition: "transform .4s cubic-bezier(.34,1.28,.64,1), opacity .3s ease",
        }}
      >
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => { dragRef.current.active = false; }}
          style={{ position: "relative", height: 40, flexShrink: 0, display: "flex", alignItems: "center", padding: "0 16px", borderBottom: "1px solid rgb(229,229,234)", cursor: "grab", touchAction: "none" }}
        >
          <div style={{ display: "flex", gap: 8, position: "relative", zIndex: 2 }}>
            {["rgb(253,93,92)", "rgb(250,201,0)", "rgb(52,199,90)"].map((color) => (
              <button key={color} type="button" aria-label="关闭窗口" onPointerDown={(event) => event.stopPropagation()} onClick={onClose} style={{ width: 12, height: 12, padding: 0, border: 0, borderRadius: "50%", background: color, cursor: "pointer" }} />
            ))}
          </div>
          <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "rgb(134,134,139)", fontFamily: "Inter, sans-serif", fontSize: 16, fontWeight: 400, letterSpacing: "-.04em", pointerEvents: "none" }}>{title}</span>
        </div>
        <div
          data-lenis-prevent
          data-lenis-prevent-wheel
          onWheel={(event) => event.stopPropagation()}
          onTouchMove={(event) => event.stopPropagation()}
          style={{
            display: "flex",
            flex: 1,
            minHeight: 0,
            flexDirection: "column",
            gap: 16,
            padding: 16,
            overflowY: "auto",
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
            color: "#151515",
          }}
        >
          {children}
        </div>
      </section>
    </div>
  );
}
