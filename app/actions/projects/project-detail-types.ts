import type { getProjectDetailData } from '../../db/project-details.ts';

export type ProjectDetailData = NonNullable<Awaited<ReturnType<typeof getProjectDetailData>>>;
