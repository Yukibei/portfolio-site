import Image from "next/image";
import { hudStats, stageCopy, stageAssets } from "./stageConfig";

export default function PortraitStageHud() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 text-white">
      <div className="absolute left-5 top-5 font-inter text-[10px] uppercase tracking-[0.42em] text-white/45 sm:left-8 sm:top-8">
        Portrait Lab
      </div>

      <div className="absolute right-5 top-5 text-right font-inter text-[10px] uppercase tracking-[0.32em] text-orange-300/80 sm:right-8 sm:top-8">
        {stageCopy.status}
      </div>

      <div className="absolute left-5 top-1/2 hidden w-64 -translate-y-1/2 space-y-4 lg:block">
        {hudStats.map((stat) => (
          <div key={stat.label} className="border-l border-orange-400/45 pl-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-orange-300/80">
              {stat.label}
            </div>
            <div className="mt-1 font-inter text-sm text-white/70">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 left-5 right-5 flex items-end justify-between gap-6 sm:left-8 sm:right-8">
        <div>
          <h1 className="font-podium text-5xl uppercase leading-none tracking-tight sm:text-7xl lg:text-8xl">
            {stageCopy.name}
          </h1>
          <p className="mt-3 max-w-[28rem] font-inter text-xs uppercase tracking-[0.28em] text-white/48">
            {stageCopy.role}
          </p>
        </div>

        <div className="hidden w-64 text-right sm:block">
          <div className="ml-auto h-28 w-64 overflow-hidden">
            <Image
              src={stageAssets.signature}
              alt=""
              width={320}
              height={240}
              className="-mt-12 h-auto w-64 opacity-85 mix-blend-screen invert contrast-150"
              unoptimized
            />
          </div>
          <p className="mt-2 font-inter text-[10px] uppercase tracking-[0.32em] text-white/42">
            {stageCopy.cnName} · Signature
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 font-mono text-[10px] uppercase tracking-[0.34em] text-white/45 md:flex">
        <span>{stageCopy.prompt}</span>
        <span className="h-10 w-px bg-gradient-to-b from-orange-400 to-transparent" />
      </div>

      <div className="absolute inset-x-4 top-20 grid grid-cols-2 gap-2 sm:hidden">
        {hudStats.slice(0, 4).map((stat) => (
          <div key={stat.label} className="border border-white/10 bg-black/20 px-3 py-2">
            <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-orange-300/80">
              {stat.label}
            </div>
            <div className="mt-1 truncate font-inter text-[11px] text-white/65">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
