import type { Handle } from 'remix/ui';

import { formatStatusLabel } from '#app/utils/format-status-label.ts';
import { projectStatusFilters } from '#app/db/types/project.ts';
import { routes } from '#app/routes.ts';
import { ListFilters } from '#app/ui/list-filters.tsx';
import type { ProjectsPageData } from '#app/actions/projects/types/projects.ts';

const hrefForFilters = (status: (typeof projectStatusFilters)[number], search: string) => {
  const query = new URLSearchParams();

  if (status !== 'all') query.set('status', status);
  if (search) query.set('search', search);

  return `${routes.projects.href()}${query.size ? `?${query.toString()}` : ''}`;
};

type ProjectFiltersProps = {
  filters: ProjectsPageData['filters'];
  statusCounts: ProjectsPageData['statusCounts'];
};

export const ProjectFilters = (handle: Handle<ProjectFiltersProps>) => {
  return () => {
    const { filters, statusCounts } = handle.props;

    return (
      <ListFilters
        sectionLabel='Filter projects'
        tabsLabel='Project status'
        tabs={projectStatusFilters.map((status) => ({
          id: status,
          label: status === 'all' ? 'All' : formatStatusLabel(status),
          count: statusCounts[status],
          href: hrefForFilters(status, filters.search),
          active: filters.status === status
        }))}
        searchAction={routes.projects.href()}
        searchLabel='Search projects'
        searchValue={filters.search}
        searchPlaceholder='Project or client'
        hiddenFields={filters.status === 'all' ? [] : [{ name: 'status', value: filters.status }]}
        clearHref={filters.search ? hrefForFilters(filters.status, '') : undefined}
      />
    );
  };
};
