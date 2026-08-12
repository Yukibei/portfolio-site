import Image from "next/image";
import { ExternalLink } from "lucide-react";
import styles from "./AppDetails.module.css";

type AppDetailsProps = {
  title: string;
  subtitle: string;
  summary: string;
  thumbnail: string;
  thumbnailAspectRatio?: number;
  href?: string;
};

export default function AppDetails({
  title,
  subtitle,
  summary,
  thumbnail,
  thumbnailAspectRatio = 16 / 9,
  href,
}: AppDetailsProps) {
  const imageWidth = 1600;
  const imageHeight = Math.round(imageWidth / thumbnailAspectRatio);

  return (
    <article className={styles.root}>
      <div
        className={styles.media}
        style={{ aspectRatio: thumbnailAspectRatio }}
      >
        <Image
          className={styles.cover}
          src={thumbnail}
          alt={`${title} 应用封面`}
          width={imageWidth}
          height={imageHeight}
          sizes="(max-width: 900px) 88vw, 800px"
        />
      </div>

      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
        <p className={styles.summary}>{summary}</p>
      </header>

      {href ? (
        <a
          className={styles.link}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span>访问应用</span>
          <ExternalLink aria-hidden size={16} strokeWidth={1.8} />
        </a>
      ) : null}
    </article>
  );
}
