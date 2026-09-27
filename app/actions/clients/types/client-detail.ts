import type { getClientDetailData } from '#app/db/client-details.ts';

export type ClientDetailData = NonNullable<Awaited<ReturnType<typeof getClientDetailData>>>;
