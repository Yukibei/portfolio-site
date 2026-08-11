"use client";

import { useEffect, useRef, useState } from "react";
import { DESKTOP_BACKGROUND, DESKTOP_WALLPAPER_VIDEO } from "./data";

const wallpaperStyle = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
} as const;

export default function DesktopWallpaper() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setMotionAllowed(!mediaQuery.matches);

    syncMotionPreference();
    mediaQuery.addEventListener("change", syncMotionPreference);
    return () => mediaQuery.removeEventListener("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !motionAllowed) return;

    let inViewport = false;
    const syncPlayback = () => {
      if (inViewport && !document.hidden) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.1 },
    );

    observer.observe(video);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, [motionAllowed]);

  if (!motionAllowed) {
    return (
      <div
        aria-hidden="true"
        style={{
          ...wallpaperStyle,
          backgroundImage: `url(${DESKTOP_BACKGROUND})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      aria-hidden="true"
      loop
      muted
      playsInline
      poster={DESKTOP_BACKGROUND}
      preload="metadata"
      src={DESKTOP_WALLPAPER_VIDEO}
      style={wallpaperStyle}
    />
  );
}
