import type { getClientsData } from '#app/db/clients.ts';

export type ClientsPageData = Awaited<ReturnType<typeof getClientsData>>;
export type ClientCardData = ClientsPageData['clients'][number];
