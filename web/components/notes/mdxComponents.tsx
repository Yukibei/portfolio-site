import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";

type Props<T extends keyof React.JSX.IntrinsicElements> = ComponentPropsWithoutRef<T>;

function Anchor({ href = "", children, ...rest }: Props<"a">) {
  const isInternal = href.startsWith("/");
  const className =
    "font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white";

  if (isInternal) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} target="_blank" rel="noreferrer noopener" {...rest}>
      {children}
    </a>
  );
}

export const mdxComponents = {
  h2: (props: Props<"h2">) => (
    <h2
      className="mt-16 scroll-mt-32 font-heading text-3xl leading-tight text-white first:mt-0 md:text-4xl"
      {...props}
    />
  ),
  h3: (props: Props<"h3">) => (
    <h3 className="mt-10 scroll-mt-32 font-body text-xl font-semibold text-white" {...props} />
  ),
  p: (props: Props<"p">) => (
    <p className="note-copy mt-6 text-pretty font-body font-light text-white/62" {...props} />
  ),
  ul: (props: Props<"ul">) => (
    <ul className="note-copy mt-6 list-disc space-y-2 pl-5 font-body font-light text-white/62 marker:text-white/30" {...props} />
  ),
  ol: (props: Props<"ol">) => (
    <ol className="note-copy mt-6 list-decimal space-y-2 pl-5 font-body font-light text-white/62 marker:text-white/30" {...props} />
  ),
  li: (props: Props<"li">) => <li className="pl-1" {...props} />,
  blockquote: (props: Props<"blockquote">) => (
    <blockquote
      className="note-copy mt-8 border-l-2 border-white/25 pl-5 font-body font-light italic text-white/50"
      {...props}
    />
  ),
  a: Anchor,
  strong: (props: Props<"strong">) => <strong className="font-semibold text-white/85" {...props} />,
  hr: () => <hr className="mt-14 border-white/12" />,
  pre: (props: Props<"pre">) => (
    <pre
      className="mt-8 overflow-x-auto rounded-lg border border-white/12 bg-white/[0.03] p-5 font-mono text-[13px] leading-7 [&_code]:bg-transparent [&_code]:p-0"
      {...props}
    />
  ),
  code: (props: Props<"code">) => (
    <code
      className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[13px] text-white/85"
      {...props}
    />
  ),
  table: (props: Props<"table">) => (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full border-collapse font-body text-sm text-white/62" {...props} />
    </div>
  ),
  th: (props: Props<"th">) => (
    <th
      className="border-b border-white/20 px-3 py-2.5 text-left font-semibold text-white/80"
      {...props}
    />
  ),
  td: (props: Props<"td">) => (
    <td className="border-b border-white/8 px-3 py-2.5 align-top font-light" {...props} />
  ),
  img: ({ alt = "", ...rest }: Props<"img">) => (
    <img className="mt-8 w-full rounded-lg border border-white/12" alt={alt} loading="lazy" {...rest} />
  ),
};
