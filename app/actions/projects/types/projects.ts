import type { getProjectsData } from '#app/db/projects.ts';

export type ProjectsPageData = Awaited<ReturnType<typeof getProjectsData>>;
export type ProjectCardData = ProjectsPageData['projects'][number];
