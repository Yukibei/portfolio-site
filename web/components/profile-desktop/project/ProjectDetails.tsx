import { getWorkProject } from "@/content/work";
import type { DesktopProject } from "../data";
import NoteDetails from "./NoteDetails";
import WorkDetails from "./WorkDetails";

type ProjectDetailsProps = {
  project: DesktopProject;
};

export default function ProjectDetails({ project }: ProjectDetailsProps) {
  if (project.kind === "note") {
    return (
      <NoteDetails label={project.label} thumbnail={project.thumbnail} note={project.note} />
    );
  }

  const work = getWorkProject(project.slug);

  if (!work) {
    return (
      <p style={{ margin: 0, color: "#b23", fontSize: 14, lineHeight: 1.8 }}>
        {`桌面项目 ${project.label} 指向的内容 slug「${project.slug}」在 content/work 中不存在。`}
      </p>
    );
  }

  return <WorkDetails project={work} />;
}
