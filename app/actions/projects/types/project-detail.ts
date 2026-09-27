import type { getProjectDetailData } from '#app/db/project-details.ts';

export type ProjectDetailData = NonNullable<Awaited<ReturnType<typeof getProjectDetailData>>>;
