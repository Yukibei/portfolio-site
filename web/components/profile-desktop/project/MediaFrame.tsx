import type { ProjectMedia, ProjectMediaShape } from "@/content/work";
import styles from "./MediaFrame.module.css";

const ASPECT_RATIO: Record<ProjectMediaShape, string> = {
  wide: "16 / 9",
  landscape: "3 / 2",
  portrait: "3 / 4",
};

type MediaFrameProps = {
  media: ProjectMedia;
  className?: string;
};

export default function MediaFrame({ media, className }: MediaFrameProps) {
  const frameClassName = className ? `${styles.frame} ${className}` : styles.frame;

  return (
    <figure className={frameClassName}>
      <div className={styles.canvas} style={{ aspectRatio: ASPECT_RATIO[media.shape] }}>
        {media.kind === "video" ? (
          <video
            className={styles.media}
            style={{ objectFit: media.fit }}
            src={media.src}
            poster={media.poster}
            controls
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={media.alt}
          />
        ) : (
          <img
            className={styles.media}
            style={{ objectFit: media.fit }}
            src={media.src}
            alt={media.alt}
            loading="lazy"
            draggable={false}
          />
        )}
      </div>
      <figcaption className={styles.caption}>{media.caption}</figcaption>
    </figure>
  );
}
