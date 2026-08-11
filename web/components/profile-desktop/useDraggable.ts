"use client";

import { useRef, useState } from "react";

type Position = { x: number; y: number };

export function useDraggable() {
  const [pos, setPos] = useState<Position>({ x: 0, y: 0 });
  const dragRef = useRef({ active: false, sx: 0, sy: 0, ox: 0, oy: 0, moved: false });

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      active: true,
      sx: event.clientX,
      sy: event.clientY,
      ox: pos.x,
      oy: pos.y,
      moved: false,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const x = drag.ox + event.clientX - drag.sx;
    const y = drag.oy + event.clientY - drag.sy;
    drag.moved = Math.hypot(event.clientX - drag.sx, event.clientY - drag.sy) >= 5;
    setPos({ x, y });
  };

  const onPointerUp = () => {
    dragRef.current.active = false;
  };

  return { pos, onPointerDown, onPointerMove, onPointerUp, isDraggingRef: dragRef };
}
