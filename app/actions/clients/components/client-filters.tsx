import type { Handle } from 'remix/ui';

import { formatStatusLabel } from '#app/utils/format-status-label.ts';
import { clientStatusFilters } from '#app/db/types/client.ts';
import { routes } from '#app/routes.ts';
import { ListFilters } from '#app/ui/list-filters.tsx';
import type { ClientsPageData } from '#app/actions/clients/types/clients.ts';

const hrefForFilters = (
  status: (typeof clientStatusFilters)[number],
  search: string,
  sortBy: ClientsPageData['filters']['sortBy'],
  sortDirection: ClientsPageData['filters']['sortDirection']
) => {
  const query = new URLSearchParams();

  if (status !== 'all') query.set('status', status);
  if (search) query.set('search', search);
  if (sortBy !== 'name') query.set('sort', sortBy);
  if (sortDirection !== 'asc') query.set('direction', sortDirection);

  return `${routes.clients.href()}${query.size ? `?${query.toString()}` : ''}`;
};

type ClientFiltersProps = {
  filters: ClientsPageData['filters'];
  statusCounts: ClientsPageData['statusCounts'];
};

export const ClientFilters = (handle: Handle<ClientFiltersProps>) => {
  return () => {
    const { filters, statusCounts } = handle.props;

    return (
      <ListFilters
        sectionLabel='Filter clients'
        tabsLabel='Client status'
        tabs={clientStatusFilters.map((status) => ({
          id: status,
          label: status === 'all' ? 'All' : formatStatusLabel(status),
          count: statusCounts[status],
          href: hrefForFilters(status, filters.search, filters.sortBy, filters.sortDirection),
          active: filters.status === status
        }))}
        searchAction={routes.clients.href()}
        searchLabel='Search clients'
        searchValue={filters.search}
        searchPlaceholder='Client, contact, or email'
        hiddenFields={[
          ...(filters.status === 'all' ? [] : [{ name: 'status', value: filters.status }]),
          ...(filters.sortBy === 'name' ? [] : [{ name: 'sort', value: filters.sortBy }]),
          ...(filters.sortDirection === 'asc'
            ? []
            : [{ name: 'direction', value: filters.sortDirection }])
        ]}
        clearHref={
          filters.search
            ? hrefForFilters(filters.status, '', filters.sortBy, filters.sortDirection)
            : undefined
        }
      />
    );
  };
};
