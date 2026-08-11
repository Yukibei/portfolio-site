import Link from "next/link";
import type { ReactNode } from "react";
import { cardArtStyle } from "../coverArt";
import styles from "./RecoCard.module.css";

/** 推荐位卡片的展示数据，由页面层组装（文章之外还可以是 work 项目） */
export type RecoItem = {
  key: string;
  href: string;
  title: string;
  category: string;
  meta: string;
  image?: string;
  /** 仅文章有；项目卡没有本地收藏态 */
  slug?: string;
};

type CardStripProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

export function CardStrip({ title, action, children }: CardStripProps) {
  return (
    <div className={styles.reco}>
      <div className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        {action}
      </div>
      <div className={styles.strip}>{children}</div>
    </div>
  );
}

type RecoCardProps = {
  item: RecoItem;
  index: number;
  topRight?: ReactNode;
  bottomRight?: ReactNode;
};

export default function RecoCard({ item, index, topRight, bottomRight }: RecoCardProps) {
  return (
    <article className={styles.card} style={cardArtStyle(index, item.image)}>
      {/* 图片独立成层并压到 .85，让渐变透上来，避免整卡变成一张贴图 */}
      <span className={styles.art} aria-hidden />
      <span className={styles.fade} aria-hidden />
      {topRight !== undefined && <span className={styles.top}>{topRight}</span>}
      <span className={styles.category}>{item.category}</span>
      {/* stretched link：标题链接铺满整卡，角上的按钮才能合法嵌套且可点击 */}
      <h3 className={styles.cardTitle}>
        <Link href={item.href} className={styles.stretch}>
          {item.title}
        </Link>
      </h3>
      <span className={styles.meta}>{item.meta}</span>
      {bottomRight !== undefined && <span className={styles.bottomRight}>{bottomRight}</span>}
    </article>
  );
}

export { styles as cardStyles };
