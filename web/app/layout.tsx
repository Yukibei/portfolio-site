import type { Metadata } from "next";
import {
  Anton,
  Barlow,
  Instrument_Serif,
  Inter,
  Sacramento,
  Zhi_Mang_Xing,
} from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/common/SmoothScroll";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/site/SiteNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-inter",
  display: "swap",
});

const barlow = Barlow({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-body-barlow",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-heading-instrument",
  display: "swap",
});

// Anton：大标题展示字体（极粗紧凑无衬线），替换原 Arial Black 回退
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display-anton",
  display: "swap",
});

// 签名字体：中文行草（Zhi Mang Xing）+ 英文手写体（Sacramento）。
// 中文字库较大，preload:false，滚动到人物区终局才按需加载。
const zhiMang = Zhi_Mang_Xing({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-zhimang-src",
  display: "swap",
  preload: false,
});

const sacramento = Sacramento({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sacramento-src",
  display: "swap",
});

const SITE_URL = "https://www.liyilin.xyz";
const SITE_TITLE = "李怡霖 · AI 应用与全栈开发";
// 微信/钉钉转发卡片只显示 title + description + 缩略图，这三行就是求职链路的第一屏
const SITE_DESC =
  "把 AI 能力做成可交付产品：ReID 平台（mAP 91.61%）、LangGraph 多智能体系统、AI Agent 与全栈应用。项目可验证，证据可追问。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · 李怡霖",
  },
  description: SITE_DESC,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Yiling Li Portfolio",
    title: SITE_TITLE,
    description: SITE_DESC,
    locale: "zh_CN",
    // TODO(T0 收尾): 换专属 1200x630 OG 卡片图，当前暂用首屏海报帧
    images: [{ url: "/hero-poster.jpg", width: 1200, height: 630, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ["/hero-poster.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${inter.variable} ${barlow.variable} ${instrumentSerif.variable} ${anton.variable} ${zhiMang.variable} ${sacramento.variable} antialiased`}
    >
      <body className="bg-black" suppressHydrationWarning>
        <a
          href="#main-content"
          className="fixed left-4 top-3 z-[300] -translate-y-20 bg-white px-4 py-2 text-sm text-black transition-transform focus:translate-y-0"
        >
          跳到主要内容
        </a>
        <SmoothScroll />
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
