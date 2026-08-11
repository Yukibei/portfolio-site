import { FACTS } from "@/components/evidence/facts";

export const NAV_LINKS = [
  { label: "About", href: "#about", external: false },
  { label: "Projects", href: "#projects", external: false },
  { label: "Resume", href: "/resume.pdf", external: true },
  { label: "Contact", href: "#contact", external: false },
];

export const CONTACT_MAILTO = "mailto:2747028274@qq.com";

// 数字一律取自 evidence/facts.ts（与简历 PDF 同源），此处只决定挑哪三个上 Hero
export const STATS = [
  { value: FACTS.reidMap.value, label: FACTS.reidMap.labelEn },
  { value: FACTS.modulesShipped.value, label: FACTS.modulesShipped.labelEn },
  { value: FACTS.techAwards.value, label: FACTS.techAwards.labelEn },
];
