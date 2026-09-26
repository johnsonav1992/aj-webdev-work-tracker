import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../../theme/tokens.ts';
import type { DataTableColumn } from '../../ui/data-table.tsx';
import { createDataTable } from '../../ui/data-table.tsx';
import { Avatar } from '../../ui/avatar.tsx';
import { StatusBadge } from '../../ui/status-badge.tsx';
import { routes } from '../../routes.ts';
import type { ClientCardData, ClientsPageData } from './clients-types.ts';

const sortHref = (
  sortBy: ClientsPageData['filters']['sortBy'],
  filters: ClientsPageData['filters']
) => {
  const query = new URLSearchParams();

  if (filters.status !== 'all') query.set('status', filters.status);
  if (filters.search) query.set('search', filters.search);

  const direction = filters.sortBy === sortBy && filters.sortDirection === 'asc' ? 'desc' : 'asc';
  query.set('sort', sortBy);
  query.set('direction', direction);

  return `${routes.clients.href()}?${query.toString()}`;
};

const columnsFor = (filters: ClientsPageData['filters']): DataTableColumn<ClientCardData>[] => [
  {
    id: 'client',
    header: 'Client',
    rowHeader: true,
    minWidth: '240px',
    sort: {
      href: sortHref('name', filters),
      label: 'client name',
      direction:
        filters.sortBy === 'name'
          ? filters.sortDirection === 'asc'
            ? 'ascending'
            : 'descending'
          : undefined
    },
    renderCell: (client) => {
      const initials = client.name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');

      return (
        <a
          href={routes.client.href({ clientId: client.id })}
          mix={clientLinkStyle}
        >
          <Avatar initials={initials || '?'} />
          <span mix={clientIdentityStyle}>
            <strong>{client.name}</strong>
            <span>{client.contactName ?? client.email ?? 'No contact details'}</span>
          </span>
        </a>
      );
    }
  },
  {
    id: 'projects',
    header: 'Projects',
    align: 'end',
    sort: {
      href: sortHref('projects', filters),
      label: 'project count',
      direction:
        filters.sortBy === 'projects'
          ? filters.sortDirection === 'asc'
            ? 'ascending'
            : 'descending'
          : undefined
    },
    renderCell: (client) => (
      <span>
        {client.projectCount}
        {client.activeProjectCount ? ` · ${client.activeProjectCount} active` : ''}
      </span>
    )
  },
  {
    id: 'tracked',
    header: 'Time tracked',
    align: 'end',
    sort: {
      href: sortHref('tracked', filters),
      label: 'tracked time',
      direction:
        filters.sortBy === 'tracked'
          ? filters.sortDirection === 'asc'
            ? 'ascending'
            : 'descending'
          : undefined
    },
    renderCell: (client) => client.trackedTime
  },
  {
    id: 'logged',
    header: 'Work logged',
    align: 'end',
    renderCell: (client) => client.loggedValue
  },
  {
    id: 'paid',
    header: 'Payments',
    align: 'end',
    renderCell: (client) => client.paidValue
  },
  {
    id: 'rate',
    header: 'Hourly rate',
    align: 'end',
    renderCell: (client) => (client.hourlyRate ? `${client.hourlyRate} / hr` : 'Not set')
  },
  {
    id: 'status',
    header: 'Status',
    renderCell: (client) => (
      <StatusBadge tone={client.status === 'active' ? 'green' : 'gray'}>
        {client.status[0]!.toUpperCase() + client.status.slice(1)}
      </StatusBadge>
    )
  }
];

const ClientDataTable = createDataTable<ClientCardData>();

type ClientTableProps = {
  clients: ClientsPageData['clients'];
  filters: ClientsPageData['filters'];
  emptyMessage: string;
};

export const ClientTable = (handle: Handle<ClientTableProps>) => {
  return () => (
    <ClientDataTable
      ariaLabel='Clients'
      caption='Clients and their project, time, and payment summaries'
      columns={columnsFor(handle.props.filters)}
      rows={handle.props.clients}
      getRowId={(client) => client.id}
      emptyMessage={handle.props.emptyMessage}
      stickyHeader
    />
  );
};

const clientLinkStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: `${themeTokens.spacing[3]}`,
  color: `${themeTokens.palette.text.primary}`,
  textDecoration: 'none',
  '&:hover strong': { color: `${themeTokens.palette.primary.main}` },
  '&:focus-visible': {
    outline: `2px solid ${themeTokens.palette.primary.main}`,
    outlineOffset: '2px',
    borderRadius: `${themeTokens.shape.large}`
  }
});
const clientIdentityStyle = css({
  display: 'grid',
  gap: `${themeTokens.spacing[1]}`,
  minWidth: 0,
  '& strong': { fontWeight: `${themeTokens.typography.weight.semibold}` },
  '& span': {
    color: `${themeTokens.palette.text.muted}`,
    fontSize: `${themeTokens.typography.size.caption}`,
    fontWeight: `${themeTokens.typography.weight.medium}`,
    overflowWrap: 'anywhere'
  }
});
