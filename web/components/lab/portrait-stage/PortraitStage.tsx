import PortraitStageCanvas from "./PortraitStageCanvas";
import PortraitStageHud from "./PortraitStageHud";

export default function PortraitStage() {
  return (
    <main
      data-portrait-stage
      className="relative min-h-screen overflow-hidden bg-black"
    >
      <PortraitStageCanvas />
      <PortraitStageHud />
      <div className="pointer-events-none absolute inset-4 z-20 border border-white/8" />
      <div className="pointer-events-none absolute left-4 top-4 z-20 h-16 w-24 border-l border-t border-orange-300/35" />
      <div className="pointer-events-none absolute right-4 top-4 z-20 h-16 w-24 border-r border-t border-orange-300/35" />
      <div className="pointer-events-none absolute bottom-4 left-4 z-20 h-16 w-24 border-b border-l border-orange-300/35" />
      <div className="pointer-events-none absolute bottom-4 right-4 z-20 h-16 w-24 border-b border-r border-orange-300/35" />
    </main>
  );
}
