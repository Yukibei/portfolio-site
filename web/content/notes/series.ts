import type { SeriesDefinition } from "./types";

/**
 * 专栏定义。文章通过 frontmatter 的 series.slug 挂进来，顺序由 series.order 决定。
 * 这里只放元信息：数量少、变动慢，不值得为它引入独立的 MDX 目录。
 */
export const SERIES_DEFINITIONS: SeriesDefinition[] = [
  {
    slug: "portfolio-v2",
    title: "个人站 V2 工程实录",
    summary:
      "把单页个人站重做成分层作品集系统的完整过程：信息架构怎么拆、玻璃界面怎么落地、内容层和本地状态怎么设计。每篇都是这个站点自己的代码。",
    cover: "/hero-poster.jpg",
  },
];
