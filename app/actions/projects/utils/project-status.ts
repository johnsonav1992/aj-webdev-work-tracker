import type { ProjectStatus } from '#app/db/types/project.ts';
import type { StatusBadgeTone } from '#app/ui/types/status-badge.ts';

export const projectStatusTone: Record<ProjectStatus, StatusBadgeTone> = {
  planned: 'amber',
  active: 'blue',
  completed: 'green',
  archived: 'gray'
};
