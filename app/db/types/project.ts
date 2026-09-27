export const projectStatuses = ['active', 'planned', 'completed', 'archived'] as const;
export type ProjectStatus = (typeof projectStatuses)[number];
export const projectStatusFilters = ['all', ...projectStatuses] as const;
export type ProjectStatusFilter = (typeof projectStatusFilters)[number];
