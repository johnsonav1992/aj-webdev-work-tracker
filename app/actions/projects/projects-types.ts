import type { getProjectsData } from '../../db/projects.ts';

export type ProjectsPageData = Awaited<ReturnType<typeof getProjectsData>>;
export type ProjectCardData = ProjectsPageData['projects'][number];
