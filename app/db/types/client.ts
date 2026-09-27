export const clientStatuses = ['active', 'archived'] as const;
export type ClientStatus = (typeof clientStatuses)[number];
export const clientStatusFilters = ['all', ...clientStatuses] as const;
export type ClientStatusFilter = (typeof clientStatusFilters)[number];
export const clientSortFields = ['name', 'projects', 'tracked'] as const;
export type ClientSortBy = (typeof clientSortFields)[number];
export type ClientSortDirection = 'asc' | 'desc';
