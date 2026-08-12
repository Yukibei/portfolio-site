import { getWorkProject } from "@/content/work";
import type { DesktopProject } from "../data";
import AppDetails from "./AppDetails";
import NoteDetails from "./NoteDetails";

type ProjectDetailsProps = {
  project: DesktopProject;
};

export default function ProjectDetails({ project }: ProjectDetailsProps) {
  if (project.kind === "note") {
    return (
      <NoteDetails label={project.label} thumbnail={project.thumbnail} note={project.note} />
    );
  }

  if (project.kind === "service") {
    return (
      <AppDetails
        title={project.service.name}
        subtitle={project.service.label}
        summary={project.service.description}
        thumbnail={project.thumbnail}
        thumbnailAspectRatio={project.thumbnailAspectRatio}
        href={project.service.href}
      />
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

  return (
    <AppDetails
      title={work.title}
      subtitle={work.zhTitle}
      summary={work.summary}
      thumbnail={project.thumbnail}
      thumbnailAspectRatio={project.thumbnailAspectRatio}
      href={work.links.at(0)?.href}
    />
  );
}
