import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../../theme/tokens.ts';
import { Button } from '../../ui/button.tsx';
import { routes } from '../../routes.ts';
import type { ClientsPageData } from './clients-types.ts';

const statuses = ['all', 'active', 'archived'] as const;

const hrefForFilters = (
  status: (typeof statuses)[number],
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
  return () => (
    <section
      aria-label='Filter clients'
      mix={containerStyle}
    >
      <nav
        aria-label='Client status'
        mix={tabsStyle}
      >
        {statuses.map((status) => (
          <a
            key={status}
            href={hrefForFilters(
              status,
              handle.props.filters.search,
              handle.props.filters.sortBy,
              handle.props.filters.sortDirection
            )}
            aria-current={handle.props.filters.status === status ? 'page' : undefined}
            mix={tabStyle(handle.props.filters.status === status)}
          >
            <span>{status === 'all' ? 'All' : status[0]!.toUpperCase() + status.slice(1)}</span>
            <span mix={countStyle}>{handle.props.statusCounts[status]}</span>
          </a>
        ))}
      </nav>
      <form
        action={routes.clients.href()}
        method='get'
        mix={searchFormStyle}
      >
        {handle.props.filters.status !== 'all' ? (
          <input
            type='hidden'
            name='status'
            value={handle.props.filters.status}
          />
        ) : null}
        {handle.props.filters.sortBy !== 'name' ? (
          <input
            type='hidden'
            name='sort'
            value={handle.props.filters.sortBy}
          />
        ) : null}
        {handle.props.filters.sortDirection !== 'asc' ? (
          <input
            type='hidden'
            name='direction'
            value={handle.props.filters.sortDirection}
          />
        ) : null}
        <label mix={searchLabelStyle}>
          <span>Search clients</span>
          <input
            type='search'
            name='search'
            value={handle.props.filters.search}
            placeholder='Client, contact, or email'
            mix={searchInputStyle}
          />
        </label>
        <Button
          type='submit'
          variant='quiet'
        >
          Search
        </Button>
        {handle.props.filters.search ? (
          <a
            href={hrefForFilters(
              handle.props.filters.status,
              '',
              handle.props.filters.sortBy,
              handle.props.filters.sortDirection
            )}
            mix={clearStyle}
          >
            Clear
          </a>
        ) : null}
      </form>
    </section>
  );
};

const containerStyle = css({
  display: 'grid',
  gap: `${themeTokens.spacing[4]}`,
  margin: `${themeTokens.spacing[5]} 0 ${themeTokens.spacing[4]}`
});
const tabsStyle = css({ display: 'flex', flexWrap: 'wrap', gap: `${themeTokens.spacing[2]}` });
const tabStyle = (active: boolean) =>
  css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: `${themeTokens.spacing[2]}`,
    minHeight: '34px',
    padding: `0 ${themeTokens.spacing[3]}`,
    border: `1px solid ${active ? themeTokens.palette.success.light : themeTokens.palette.divider}`,
    borderRadius: `${themeTokens.shape.pill}`,
    background: active
      ? `${themeTokens.palette.success.light}`
      : `${themeTokens.palette.background.paper}`,
    color: active ? `${themeTokens.palette.success.main}` : `${themeTokens.palette.text.secondary}`,
    fontSize: `${themeTokens.typography.size.caption}`,
    fontWeight: `${active ? themeTokens.typography.weight.bold : themeTokens.typography.weight.medium}`,
    textDecoration: 'none',
    '&:hover': { borderColor: `${themeTokens.palette.dividerStrong}` }
  });
const countStyle = css({ opacity: 0.75, fontVariantNumeric: 'tabular-nums' });
const searchFormStyle = css({
  display: 'flex',
  alignItems: 'end',
  flexWrap: 'wrap',
  gap: `${themeTokens.spacing[2]}`
});
const searchLabelStyle = css({
  display: 'grid',
  flex: '1 1 220px',
  maxWidth: '360px',
  gap: `${themeTokens.spacing[1]}`,
  color: `${themeTokens.palette.text.secondary}`,
  fontSize: `${themeTokens.typography.size.caption}`,
  fontWeight: `${themeTokens.typography.weight.semibold}`
});
const searchInputStyle = css({
  width: '100%',
  minHeight: '36px',
  padding: `0 ${themeTokens.spacing[3]}`,
  border: `1px solid ${themeTokens.palette.dividerStrong}`,
  borderRadius: `${themeTokens.shape.large}`,
  background: `${themeTokens.palette.background.paper}`,
  color: `${themeTokens.palette.text.primary}`,
  font: 'inherit'
});
const clearStyle = css({
  minHeight: '36px',
  display: 'inline-flex',
  alignItems: 'center',
  padding: `0 ${themeTokens.spacing[2]}`,
  color: `${themeTokens.palette.text.secondary}`,
  fontSize: `${themeTokens.typography.size.small}`
});
