import Link from "next/link";
import DinoRunnerGame from "@/components/dino/DinoRunnerGame";

export default function NotFound() {
  return (
    <main id="main-content" className="min-h-screen bg-[#090909] px-5 pb-12 pt-28 text-white sm:px-8 lg:pt-32">
      <section className="mx-auto w-full max-w-[1080px]">
        <header className="max-w-2xl">
          <p className="font-mono text-xs tabular-nums tracking-[0.32em] text-white/35">
            ERROR 404
          </p>
          <h1 className="mt-5 text-wrap-balance font-heading text-5xl italic leading-[0.92] text-white sm:text-7xl">
            Lost signal. Keep running.
          </h1>
          <p className="mt-5 max-w-lg font-body text-sm font-light leading-7 text-white/52">
            没找到这个页面。你可以回到首页，也可以先把这段路跑完。
          </p>
        </header>
        <DinoRunnerGame compact className="mt-9" />
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="liquid-glass-strong inline-flex items-center justify-center rounded-full px-6 py-3 font-body text-sm text-white transition-colors hover:bg-white/10"
          >
            Back home
          </Link>
          <Link
            href="/#dino-runner"
            className="inline-flex items-center justify-center px-4 py-3 font-body text-sm text-white/52 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            Play on homepage
          </Link>
        </div>
      </section>
    </main>
  );
}
