import type { Handle, RemixNode } from 'remix/ui';
import { css } from 'remix/ui';

import { panelStyle, themeTokens } from '../theme/tokens.ts';

type DataTableAlignment = 'start' | 'center' | 'end';
type DataTableDensity = 'comfortable' | 'compact';
type DataTableSortDirection = 'ascending' | 'descending';

export type DataTableColumn<Row> = {
  id: string;
  header: string;
  renderCell: (row: Row) => RemixNode;
  align?: DataTableAlignment;
  width?: string;
  minWidth?: string;
  rowHeader?: boolean;
  sort?: {
    href: string;
    label: string;
    direction?: DataTableSortDirection;
  };
};

export const createDataTable = <Row,>() => {
  type DataTableProps = {
    ariaLabel: string;
    columns: DataTableColumn<Row>[];
    rows: Row[];
    getRowId: (row: Row) => string;
    emptyMessage: string;
    caption?: string;
    density?: DataTableDensity;
    stickyHeader?: boolean;
  };

  const DataTableForRow = (handle: Handle<DataTableProps>) => {
    return () => (
      <div mix={[panelStyle, tableFrameStyle]}>
        <div
          role='region'
          aria-label={handle.props.ariaLabel}
          tabIndex={0}
          mix={tableOverflowStyle}
        >
          <table mix={tableStyle}>
            {handle.props.caption ? (
              <caption mix={visuallyHiddenStyle}>{handle.props.caption}</caption>
            ) : null}
            <thead mix={handle.props.stickyHeader ? stickyHeaderStyle : undefined}>
              <tr>
                {handle.props.columns.map((column) => (
                  <th
                    key={column.id}
                    scope='col'
                    aria-sort={column.sort?.direction ?? undefined}
                    mix={columnStyle(
                      column.align,
                      column.width,
                      column.minWidth,
                      handle.props.density
                    )}
                  >
                    {column.sort ? (
                      <a
                        href={column.sort.href}
                        aria-label={`Sort by ${column.sort.label}`}
                        mix={sortLinkStyle}
                      >
                        <span>{column.header}</span>
                        <span
                          aria-hidden='true'
                          mix={sortIndicatorStyle}
                        >
                          {column.sort.direction === 'ascending'
                            ? '↑'
                            : column.sort.direction === 'descending'
                              ? '↓'
                              : '↕'}
                        </span>
                      </a>
                    ) : (
                      column.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {handle.props.rows.length ? (
                handle.props.rows.map((row) => (
                  <tr key={handle.props.getRowId(row)}>
                    {handle.props.columns.map((column) => {
                      const Cell = column.rowHeader ? 'th' : 'td';

                      return (
                        <Cell
                          key={column.id}
                          scope={column.rowHeader ? 'row' : undefined}
                          mix={columnStyle(
                            column.align,
                            column.width,
                            column.minWidth,
                            handle.props.density
                          )}
                        >
                          {column.renderCell(row)}
                        </Cell>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={handle.props.columns.length}
                    mix={emptyCellStyle}
                  >
                    {handle.props.emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return DataTableForRow;
};

const tableFrameStyle = css({ overflow: 'hidden' });

const tableOverflowStyle = css({
  overflowX: 'auto',
  maxWidth: '100%',
  '&:focus-visible': {
    outline: `2px solid ${themeTokens.palette.primary.main}`,
    outlineOffset: '2px'
  }
});
const tableStyle = css({
  width: '100%',
  minWidth: '740px',
  borderCollapse: 'separate',
  borderSpacing: 0,
  textAlign: 'left',
  fontSize: `${themeTokens.typography.size.small}`,
  '& th': {
    color: `${themeTokens.palette.text.muted}`,
    fontSize: `${themeTokens.typography.size.caption}`,
    fontWeight: `${themeTokens.typography.weight.semibold}`
  },
  '& thead th': {
    background: `${themeTokens.palette.background.paper}`,
    borderBottom: `1px solid ${themeTokens.palette.dividerStrong}`
  },
  '& tbody td, & tbody th': {
    borderBottom: `1px solid ${themeTokens.palette.divider}`,
    color: `${themeTokens.palette.text.secondary}`
  },
  '& tbody tr:last-child td, & tbody tr:last-child th': { borderBottom: 0 },
  '& tbody tr:hover td, & tbody tr:hover th': {
    background: `${themeTokens.palette.background.hover}`
  },
  '& tbody th': {
    color: `${themeTokens.palette.text.primary}`,
    fontWeight: `${themeTokens.typography.weight.semibold}`
  }
});
const stickyHeaderStyle = css({
  position: 'sticky',
  top: 0,
  zIndex: 1
});
const columnStyle = (
  align: DataTableAlignment = 'start',
  width?: string,
  minWidth?: string,
  density: DataTableDensity = 'comfortable'
) =>
  css({
    width,
    minWidth,
    padding: `${density === 'compact' ? themeTokens.spacing[2] : themeTokens.spacing[3]} ${themeTokens.spacing[4]}`,
    textAlign: align === 'start' ? 'left' : align === 'end' ? 'right' : 'center',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap'
  });
const sortLinkStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: `${themeTokens.spacing[2]}`,
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': { color: `${themeTokens.palette.text.primary}` },
  '&:focus-visible': {
    outline: `2px solid ${themeTokens.palette.primary.main}`,
    outlineOffset: '2px',
    borderRadius: `${themeTokens.shape.large}`
  }
});
const sortIndicatorStyle = css({
  minWidth: '1ch',
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.caption}`
});
const emptyCellStyle = css({
  padding: `${themeTokens.spacing[8]} ${themeTokens.spacing[4]}`,
  color: `${themeTokens.palette.text.muted}`,
  textAlign: 'center'
});
const visuallyHiddenStyle = css({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0
});
