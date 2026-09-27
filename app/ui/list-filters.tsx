import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '#app/theme/tokens.ts';
import { Button } from './button.tsx';

type ListFiltersTab = {
  id: string;
  label: string;
  count: number;
  href: string;
  active: boolean;
};

type ListFiltersHiddenField = {
  name: string;
  value: string;
};

type ListFiltersProps = {
  sectionLabel: string;
  tabsLabel: string;
  tabs: ListFiltersTab[];
  searchAction: string;
  searchLabel: string;
  searchValue: string;
  searchPlaceholder: string;
  hiddenFields?: ListFiltersHiddenField[];
  clearHref?: string;
};

export const ListFilters = (handle: Handle<ListFiltersProps>) => {
  return () => (
    <section
      aria-label={handle.props.sectionLabel}
      mix={containerStyle}
    >
      <nav
        aria-label={handle.props.tabsLabel}
        mix={tabsStyle}
      >
        {handle.props.tabs.map((tab) => (
          <a
            key={tab.id}
            href={tab.href}
            aria-current={tab.active ? 'page' : undefined}
            mix={tabStyle(tab.active)}
          >
            <span>{tab.label}</span>
            <span mix={countStyle}>{tab.count}</span>
          </a>
        ))}
      </nav>
      <form
        action={handle.props.searchAction}
        method='get'
        mix={searchFormStyle}
      >
        {handle.props.hiddenFields?.map((field) => (
          <input
            key={field.name}
            type='hidden'
            name={field.name}
            value={field.value}
          />
        ))}
        <label mix={searchLabelStyle}>
          <span>{handle.props.searchLabel}</span>
          <input
            type='search'
            name='search'
            value={handle.props.searchValue}
            placeholder={handle.props.searchPlaceholder}
            mix={searchInputStyle}
          />
        </label>
        <Button
          type='submit'
          variant='quiet'
        >
          Search
        </Button>
        {handle.props.clearHref ? (
          <a
            href={handle.props.clearHref}
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
