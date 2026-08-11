import type { Metadata } from "next";
import PageIntro from "@/components/site/PageIntro";
import WorkIndex from "@/components/work/WorkIndex";
import { WORK_PROJECTS } from "@/content/work";

export const metadata: Metadata = {
  title: "Work",
  description: "李怡霖的 AI 应用、Agent、计算机视觉与全栈项目案例。",
};

export default function WorkPage() {
  return (
    <main id="main-content" className="min-h-screen bg-black">
      <PageIntro
        eyebrow={`${WORK_PROJECTS.length.toString().padStart(2, "0")} case studies`}
        title="Selected work."
        description="不把项目压缩成技术栈列表。每个案例都保留问题、角色、技术取舍、结果和可核对的媒体证据。"
      />
      <WorkIndex />
    </main>
  );
}
