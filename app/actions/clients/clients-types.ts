import type { getClientsData } from '../../db/clients.ts';

export type ClientsPageData = Awaited<ReturnType<typeof getClientsData>>;
export type ClientCardData = ClientsPageData['clients'][number];
