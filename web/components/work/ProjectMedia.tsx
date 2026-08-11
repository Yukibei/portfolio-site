"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.35 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const frameClass = `${SHAPE_CLASS[media.shape]} relative overflow-hidden bg-[#090909] ${className}`;
  const fitClass = media.fit === "cover" ? "object-cover" : "object-contain";

  if (media.kind === "video") {
    return (
      <div className={frameClass} data-project-media-priority={priority || undefined}>
        <video
          ref={videoRef}
          src={media.src}
          poster={media.poster}
          muted
          loop
          playsInline
          preload={priority ? "auto" : "metadata"}
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
