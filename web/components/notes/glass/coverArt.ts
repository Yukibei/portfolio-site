import type { CSSProperties } from "react";

/**
 * 策展图库：沿用原型验证过的整套占位图与渐变，先保证视觉丰富度。
 * 后期给文章 frontmatter 配 cover、给项目卡传 image 时，会自动优先真图。
 */
const HERO_ART = "/glass/art/hero.jpg";

const CARD_ART = [
  { image: "/glass/art/card-1.jpg", gradient: "linear-gradient(165deg, #8a4a2c, #5c3a30 55%, #20242f)" },
  { image: "/glass/art/card-2.jpg", gradient: "linear-gradient(165deg, #57636b, #39424a 55%, #191d24)" },
  { image: "/glass/art/card-3.jpg", gradient: "linear-gradient(165deg, #2b3fa0, #5a2c8f 55%, #171a3a)" },
  { image: "/glass/art/card-4.jpg", gradient: "linear-gradient(165deg, #7c7466, #4c5158 55%, #171b22)" },
  { image: "/glass/art/card-5.jpg", gradient: "linear-gradient(165deg, #665443, #3d3028 55%, #171515)" },
];

const COVER_ART_COUNT = 12;

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** 列表行书封：文章自己的 cover 优先，否则按 slug 稳定分配一张策展书封 */
export function coverArtStyle(slug: string, cover?: string): CSSProperties {
  const fallback = `/glass/art/cover-${(hashSeed(slug) % COVER_ART_COUNT) + 1}.jpg`;
  return { "--cover-gradient": `url(${cover ?? fallback})` } as CSSProperties;
}

/** 推荐卡：传入 image 优先，否则按卡位循环取策展图。渐变垫底，图片作为独立层压到 .85 */
export function cardArtStyle(index: number, image?: string): CSSProperties {
  const art = CARD_ART[index % CARD_ART.length];
  return {
    "--card-gradient": art.gradient,
    "--card-image": `url(${image ?? art.image})`,
  } as CSSProperties;
}

/** hero 背景：文章封面优先，否则用策展图书馆图 */
export function heroArtStyle(cover?: string): CSSProperties {
  return { "--hero-image": `url(${cover ?? HERO_ART})` } as CSSProperties;
}
