"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, Award, Crown } from "lucide-react";
import { STATS } from "./constants";

const VIDEO_URL = "/hero-video.mp4?v=2";
const POSTER_URL = "/hero-poster.jpg";

function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const SENSITIVITY = 0.8;
    let prevX: number | null = null;
    let targetTime = 0;
    let rafId = 0;

    const tick = () => {
      if (
        video.duration &&
        !Number.isNaN(video.duration) &&
        video.readyState >= 1 &&
        !video.seeking &&
        Math.abs(video.currentTime - targetTime) > 0.02
      ) {
        video.currentTime = targetTime;
      }
      rafId = requestAnimationFrame(tick);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 0.9) return;
      if (prevX === null) {
        prevX = e.clientX;
        return;
      }
      const delta = e.clientX - prevX;
      prevX = e.clientX;
      if (!video.duration || Number.isNaN(video.duration)) return;
      const offset =
        (delta / window.innerWidth) * SENSITIVITY * video.duration;
      targetTime = Math.min(Math.max(targetTime + offset, 0), video.duration);
    };

    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={VIDEO_URL}
      muted
      playsInline
      preload="metadata"
      poster={POSTER_URL}
      className="absolute inset-0 h-full w-full object-cover"
      style={{ objectPosition: "70% center" }}
    />
  );
}

export default function HeroSection() {
  return (
    <section className="sticky top-0 h-screen w-full overflow-hidden bg-black">
      <BackgroundVideo />

      <div className="relative z-[1] flex h-full flex-col justify-center px-6 pt-20 sm:px-10 lg:px-16">
        <div className="animate-fade-up mb-6 flex items-center gap-3 lg:mb-8">
          <Crown className="h-4 w-4 text-white/70" />
          <span className="font-inter text-xs uppercase tracking-[0.3em] text-white/70 sm:text-sm">
            AI Application &amp; Full-Stack Engineer
          </span>
        </div>

        <h1 className="animate-fade-up-delay-1 font-podium uppercase leading-[0.92] tracking-tight text-white">
          <span className="block text-[clamp(2.8rem,8vw,7rem)]">Build.</span>
          <span className="block text-[clamp(2.8rem,8vw,7rem)]">Deploy.</span>
          <span className="block text-[clamp(2.8rem,8vw,7rem)]">Deliver.</span>
        </h1>

        <p className="animate-fade-up-delay-2 mt-6 max-w-md font-inter text-sm leading-relaxed text-white/70 sm:text-base lg:mt-8">
          I turn AI capabilities into real products,
          <br />
          from agents &amp; RAG to full-stack apps -{" "}
          <span className="font-bold text-white">they ship.</span>
        </p>
        <p className="animate-fade-up-delay-2 mt-3 font-inter text-xs tracking-[0.25em] text-white/45 sm:text-sm">
          把 AI 能力做成可上线的产品 - 不止于 Demo。
        </p>

        <div className="animate-fade-up-delay-3 mt-8 flex flex-wrap items-center gap-4 sm:gap-6 lg:mt-10">
          <a
            href="#projects"
            className="group flex items-center gap-2 bg-black px-5 py-3 font-inter text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-neutral-900 sm:px-7 sm:py-4 sm:text-xs"
          >
            SEE MY WORK
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>

          <div className="hidden items-center gap-3 sm:flex">
            <Award className="h-8 w-8 text-white/50" />
            <div className="font-inter text-xs uppercase tracking-wider text-white/60">
              <div>2x National</div>
              <div>Award Winner</div>
            </div>
          </div>
        </div>

        <div className="animate-fade-up-delay-4 mt-8 flex flex-wrap gap-6 sm:mt-10 sm:gap-12 lg:mt-14 lg:gap-16">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="font-inter text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {stat.value}
              </div>
              <div className="mt-1 font-inter text-[9px] uppercase tracking-widest text-white/50 sm:text-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-7 right-6 z-[1] flex flex-col items-center gap-3 sm:right-10 lg:right-16">
        <span className="writing-vertical font-inter text-[10px] tracking-[0.3em] text-white/50">
          SCROLL · 往下看
        </span>
        <span className="block h-12 w-px bg-white/20">
          <span className="scroll-flow block h-full w-full bg-white/80" />
        </span>
      </div>
    </section>
  );
}
