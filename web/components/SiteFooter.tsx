import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SITE_NAV_LINKS } from "./site/navigation";

export default function SiteFooter() {
  return (
    <footer id="contact" className="bg-black px-6 pb-10 pt-20 sm:px-10 lg:px-16 lg:pt-28">
      <div className="mx-auto max-w-[1500px]">
        <p className="font-body text-xs tracking-[0.28em] text-white/38">
          Contact / 随时聊聊
        </p>
        <a
          href="mailto:2747028274@qq.com"
          className="group mt-6 inline-flex flex-wrap items-center gap-3 font-heading text-[clamp(3.3rem,9vw,8.5rem)] italic leading-none tracking-tight text-white transition-colors hover:text-white/68 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          Say hello.
          <ArrowUpRight className="h-[0.48em] w-[0.48em] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
        </a>
        <p className="mt-6 max-w-lg text-pretty font-body text-sm font-light leading-7 text-white/52 sm:text-base">
          AI 应用、Agent 系统与全栈工程。项目合作或岗位沟通，可直接通过邮件联系。
        </p>

        <div className="mt-20 grid gap-8 border-t border-white/10 pt-7 md:grid-cols-[1fr_auto] md:items-end lg:mt-28">
          <div>
            <span className="font-body text-xs tracking-widest text-white/35">
              © 2026 Yiling Li · 李怡霖
            </span>
            <p className="mt-2 font-body text-xs text-white/25">Built with Next.js · Shanghai / Remote</p>
          </div>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {SITE_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-xs text-white/48 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/Yukibei"
              target="_blank"
              rel="noreferrer"
              className="font-body text-xs text-white/48 transition-colors hover:text-white"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
