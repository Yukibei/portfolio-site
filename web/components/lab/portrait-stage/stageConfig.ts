export const stageAssets = {
  portrait: "/lab/portrait-stage/portrait-cutout.png",
  portraitFull: "/lab/portrait-stage/portrait-full.png",
  crt: "/lab/portrait-stage/crt-head.png",
  signature: "/lab/portrait-stage/signature-source.png",
} as const;

export const hudStats = [
  { label: "AI AGENT", value: "LangGraph Multi-Agent" },
  { label: "REID", value: "mAP 91.61%" },
  { label: "STACK", value: "Next.js / RAG / Deploy" },
  { label: "MODE", value: "Observable Systems" },
] as const;

export const stageCopy = {
  name: "YILING LI",
  cnName: "李怡霖",
  role: "AI Application / Full-stack / Observable Systems",
  prompt: "move cursor over portrait",
  status: "fluid reveal active",
} as const;
