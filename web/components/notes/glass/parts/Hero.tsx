import type { ReactNode } from "react";
import { heroArtStyle } from "../coverArt";
import styles from "./Hero.module.css";

type HeroProps = {
  /** 站内图片路径，缺省用策展图书馆图 */
  image?: string;
  chips?: string[];
  title: string;
  author?: string;
  desc?: string;
  /** 按钮区插槽：主 CTA、收藏等 */
  actions?: ReactNode;
  /** 右下角翻页箭头，仅首页用 */
  arrows?: ReactNode;
};

export default function Hero({ image, chips, title, author, desc, actions, arrows }: HeroProps) {
  return (
    <section className={styles.hero} style={heroArtStyle(image)}>
      <div className={styles.shadeLeft} />
      <div className={styles.shadeBottom} />
      <div className={styles.body}>
        {chips !== undefined && chips.length > 0 && (
          <div className={styles.chips}>
            {chips.map((chip) => (
              <span key={chip} className={styles.chip}>
                {chip}
              </span>
            ))}
          </div>
        )}
        <h1 className={styles.title}>{title}</h1>
        {author !== undefined && <p className={styles.author}>{author}</p>}
        {desc !== undefined && <p className={styles.desc}>{desc}</p>}
        {actions !== undefined && <div className={styles.buttons}>{actions}</div>}
      </div>
      {arrows !== undefined && <div className={styles.arrows}>{arrows}</div>}
    </section>
  );
}

export { styles as heroStyles };
