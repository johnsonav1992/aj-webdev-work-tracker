import type { getClientDetailData } from '../../db/client-details.ts';

export type ClientDetailData = NonNullable<Awaited<ReturnType<typeof getClientDetailData>>>;
