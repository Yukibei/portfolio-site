export function forwardCanvasMissPointer(event) {
  const doc = document.documentElement.dataset;
  if (doc.lanyardCardActive === "true" || doc.lanyardCardDragging === "true") {
    return;
  }

  const safeZone = document.querySelector(".experience-lanyard-safe-zone");
  const safeRect = safeZone?.getBoundingClientRect();
  if (safeRect && event.clientX >= safeRect.left) return;

  const canvas = event.currentTarget;
  const frame = canvas.closest(".experience-lanyard-frame");
  const overlay = canvas.closest(".experience-lanyard");
  const canvasEvents = canvas.style.pointerEvents;
  const frameEvents = frame?.style.pointerEvents;
  const overlayEvents = overlay?.style.pointerEvents;

  canvas.style.pointerEvents = "none";
  if (frame) frame.style.pointerEvents = "none";
  if (overlay) overlay.style.pointerEvents = "none";
  const target = document.elementFromPoint(event.clientX, event.clientY);
  canvas.style.pointerEvents = canvasEvents;
  if (frame && frameEvents !== undefined) frame.style.pointerEvents = frameEvents;
  if (overlay && overlayEvents !== undefined) {
    overlay.style.pointerEvents = overlayEvents;
  }

  const clickable = target?.closest('a, button, [role="button"]');
  if (!clickable) return;

  event.preventDefault();
  event.stopPropagation();
  clickable.click();
}
