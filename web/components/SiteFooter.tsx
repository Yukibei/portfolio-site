import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";

export default function SiteFooter() {
  return (
    <footer
      id="contact"
      className="scroll-mt-24 px-6 pb-10 pt-20 sm:px-10 lg:px-16 lg:pt-28"
    >
      <Reveal>
        <p className="font-inter text-xs uppercase tracking-[0.35em] text-white/40">
          (05) Contact / 随时聊聊
        </p>
        <a
          href="mailto:2747028274@qq.com"
          className="group mt-6 inline-flex flex-wrap items-center gap-3 font-podium text-[clamp(2.2rem,7vw,6rem)] uppercase leading-none tracking-tight text-white transition-colors hover:text-white/70"
        >
          Say Hello.
          <ArrowUpRight className="h-[0.55em] w-[0.55em] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
        </a>
        <p className="mt-5 max-w-md font-inter text-sm leading-relaxed text-white/50 sm:text-base">
          正在寻找 AI 应用 / Agent 开发 / 全栈方向的机会，城市不限。
          <br />
          邮件随时可达：
          <a
            href="mailto:2747028274@qq.com"
            className="text-white underline underline-offset-4 hover:text-white/70"
          >
            2747028274@qq.com
          </a>
        </p>
      </Reveal>

      {/* 页面最底部 70px 内 Reveal 的 whileInView 永不触发，底栏直接渲染 */}
      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 lg:mt-24">
          <span className="font-inter text-xs tracking-widest text-white/40">
            © 2026 Yiling Li · 李怡霖
          </span>
          <div className="flex items-center gap-8">
            <a
              href="https://github.com/Yukibei"
              target="_blank"
              rel="noreferrer"
              className="font-inter text-xs uppercase tracking-widest text-white/60 transition-colors hover:text-white"
            >
              GitHub
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              className="font-inter text-xs uppercase tracking-widest text-white/60 transition-colors hover:text-white"
            >
              Resume
            </a>
            <span className="font-inter text-xs tracking-widest text-white/30">
              Built with Next.js
            </span>
          </div>
        </div>
    </footer>
  );
}
