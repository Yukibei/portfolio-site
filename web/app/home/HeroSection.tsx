"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Award, Crown } from "lucide-react";
import { STATS } from "./constants";

const VIDEO_URL = "/hero-video.mp4?v=3";
const POSTER_URL = "/hero-poster.jpg";

function HeroBackdrop() {
  const [videoEnabled, setVideoEnabled] = useState(false);

  useEffect(() => {
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncVideoPolicy = () => setVideoEnabled(pointerQuery.matches);

    syncVideoPolicy();
    pointerQuery.addEventListener("change", syncVideoPolicy);
    return () => pointerQuery.removeEventListener("change", syncVideoPolicy);
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-[70%_center]"
        style={{
          backgroundImage: `url(${POSTER_URL})`,
          filter: "brightness(1.12) saturate(1.04)",
        }}
      />
      {videoEnabled ? <BackgroundVideo /> : null}
    </>
  );
}

function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const SENSITIVITY = 0.8;
    const SEEK_INTERVAL_MS = 45;
    let prevX: number | null = null;
    let targetTime = 0;
    let rafId = 0;
    let lastSeekAt = 0;

    const seekToTarget = () => {
      rafId = 0;
      if (
        !video.duration ||
        Number.isNaN(video.duration) ||
        video.readyState < 1 ||
        video.seeking
      ) {
        return;
      }

      const now = performance.now();
      if (now - lastSeekAt < SEEK_INTERVAL_MS) {
        rafId = requestAnimationFrame(seekToTarget);
        return;
      }

      if (Math.abs(video.currentTime - targetTime) > 0.08) {
        video.currentTime = targetTime;
        lastSeekAt = now;
      }
    };

    const scheduleSeek = () => {
      if (!rafId) rafId = requestAnimationFrame(seekToTarget);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 0.9) {
        prevX = null;
        return;
      }
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
      scheduleSeek();
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
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
      style={{
        objectPosition: "70% center",
        filter: "brightness(1.12) saturate(1.04)",
      }}
    />
  );
}

export default function HeroSection() {
  return (
    <section className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-black">
      <HeroBackdrop />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.30),rgba(0,0,0,0.08)_68%,rgba(0,0,0,0.02))]"
      />

      <div className="hero-layout relative z-[1] flex h-full flex-col px-6 pb-6 pt-24 sm:px-10 sm:pb-8 sm:pt-28 lg:px-16 lg:pb-10 lg:pt-28">
        <div className="shrink-0">
          <div className="hero-tagline animate-fade-up mb-4 flex items-center gap-3 lg:mb-5">
            <Crown className="h-4 w-4 shrink-0 text-white/70" />
            <span className="font-inter text-xs uppercase tracking-[0.3em] text-white/70 sm:text-sm">
              AI Application &amp; Full-Stack Engineer
            </span>
          </div>

          <h1 className="hero-title animate-fade-up-delay-1 font-podium text-[3.4rem] uppercase leading-[0.98] tracking-tight text-white sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6.25rem] xl:text-[7rem]">
            <span className="block">Build.</span>
            <span className="block">Deploy.</span>
            <span className="block">Deliver.</span>
          </h1>

          <p className="hero-description animate-fade-up-delay-2 mt-4 max-w-md font-inter text-sm leading-relaxed text-white/70 sm:mt-5 sm:text-base lg:mt-6">
            I turn AI capabilities into real products,
            <br />
            from agents &amp; RAG to full-stack apps -{" "}
            <span className="font-bold text-white">they ship.</span>
          </p>
          <p className="hero-cn animate-fade-up-delay-2 mt-2 font-inter text-xs tracking-[0.25em] text-white/45 sm:text-sm">
            把 AI 能力做成可上线的产品 - 不止于 Demo。
          </p>

          <div className="hero-actions animate-fade-up-delay-3 mt-6 flex flex-wrap items-center gap-4 sm:gap-6 lg:mt-8">
            <a
              href="#projects"
              className="group flex items-center gap-2 bg-black px-5 py-3 font-inter text-[11px] uppercase tracking-widest text-white transition-colors hover:bg-neutral-900 sm:px-7 sm:py-4 sm:text-xs"
            >
              SEE MY WORK
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

            <div className="hero-award hidden items-center gap-3 sm:flex">
              <Award className="h-8 w-8 text-white/50" />
              <div className="font-inter text-xs uppercase tracking-wider text-white/60">
                <div>2x National</div>
                <div>Award Winner</div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-stats animate-fade-up-delay-4 flex shrink-0 flex-wrap gap-8 pt-6 sm:gap-14 lg:gap-20">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="font-inter text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
                {stat.value}
              </div>
              <div className="mt-1.5 font-inter text-[10px] uppercase tracking-widest text-white/55 sm:text-[13px]">
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
