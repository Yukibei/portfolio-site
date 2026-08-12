"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProjectMedia as ProjectMediaData } from "@/content/work";

const SHAPE_CLASS = {
  wide: "aspect-[16/9]",
  landscape: "aspect-[8/5]",
  portrait: "aspect-[9/16]",
} satisfies Record<ProjectMediaData["shape"], string>;

export default function ProjectMedia({
  media,
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  className = "",
}: {
  media: ProjectMediaData;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaReady, setMediaReady] = useState(priority);

  useEffect(() => {
    const frame = frameRef.current;
    if (media.kind !== "video" || priority || !frame) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setMediaReady(true);
        observer.disconnect();
      },
      { rootMargin: "320px 0px" },
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, [media.kind, priority]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !mediaReady) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.35 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [mediaReady]);

  const frameClass = `${SHAPE_CLASS[media.shape]} relative overflow-hidden bg-[#090909] ${className}`;
  const fitClass = media.fit === "cover" ? "object-cover" : "object-contain";

  if (media.kind === "video") {
    return (
      <div
        ref={frameRef}
        className={frameClass}
        data-project-media-priority={priority || undefined}
      >
        <video
          ref={videoRef}
          src={mediaReady ? media.src : undefined}
          poster={mediaReady ? media.poster : undefined}
          muted
          loop
          playsInline
          preload={priority ? "auto" : "none"}
          aria-label={media.alt}
          className={`h-full w-full ${fitClass}`}
        />
      </div>
    );
  }

  return (
    <div className={frameClass} data-project-media-priority={priority || undefined}>
      <Image
        src={media.src}
        alt={media.alt}
        fill
        priority={priority}
        loading={priority ? "eager" : undefined}
        sizes={sizes}
        className={fitClass}
      />
    </div>
  );
}
