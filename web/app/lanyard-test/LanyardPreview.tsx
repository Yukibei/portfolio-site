"use client";

import Lanyard from "@/components/Lanyard";

export default function LanyardPreview() {
  return (
    <main className="h-screen w-screen bg-neutral-800">
      <Lanyard
        key="preview-lanyard-react-bits"
        position={[0, 0, 20]}
        gravity={[0, -40, 0]}
        fov={20}
        cardScale={2.95}
        frontImage="/lanyard/front.png"
        backImage="/lanyard/back.png"
        lanyardImage="/lanyard/band.png"
        lanyardWidth={1.05}
      />
    </main>
  );
}
