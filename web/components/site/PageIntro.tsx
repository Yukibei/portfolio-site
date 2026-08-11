import type { ReactNode } from "react";

export default function PageIntro({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
}) {
  return (
    <header className="border-b border-white/10 pb-12 pt-36 md:pb-16 md:pt-44">
      <div className="mx-auto grid max-w-[1500px] gap-10 px-6 md:px-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end lg:px-16">
        <div>
          <p className="font-body text-[11px] uppercase tracking-[0.3em] text-white/38">
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-5xl text-wrap-balance font-heading text-[clamp(4rem,10vw,9rem)] italic leading-[0.82] tracking-tight text-white">
            {title}
          </h1>
        </div>
        <div>
          <p className="max-w-md text-pretty font-body text-sm font-light leading-7 text-white/58 md:text-base">
            {description}
          </p>
          {aside ? <div className="mt-6">{aside}</div> : null}
        </div>
      </div>
    </header>
  );
}
