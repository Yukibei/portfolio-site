import { EXISTING_PROJECTS } from "./existingProjects";
import { NEW_PROJECTS } from "./newProjects";

export type {
  ProjectDecision,
  ProjectLink,
  ProjectMedia,
  ProjectMediaShape,
  ProjectMetric,
  WorkProject,
} from "./types";

export const WORK_PROJECTS = [...NEW_PROJECTS, ...EXISTING_PROJECTS];

export const FEATURED_PROJECTS = WORK_PROJECTS.filter(
  (project) => project.featured,
);

export function getWorkProject(slug: string) {
  return WORK_PROJECTS.find((project) => project.slug === slug);
}
