import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../../theme/tokens.ts';
import { Panel } from '../../ui/panel.tsx';
import type { ClientsPageData } from './clients-types.ts';

type ClientsSummaryProps = {
  metrics: ClientsPageData['metrics'];
};

export const ClientsSummary = (handle: Handle<ClientsSummaryProps>) => {
  return () => {
    const items = [
      { label: 'Total clients', value: handle.props.metrics.total },
      { label: 'Active', value: handle.props.metrics.active },
      { label: 'Archived', value: handle.props.metrics.archived }
    ];

    return (
      <div mix={summaryGridStyle}>
        {items.map((item) => (
          <Panel key={item.label}>
            <div mix={itemStyle}>
              <span mix={labelStyle}>{item.label}</span>
              <strong mix={valueStyle}>{item.value}</strong>
            </div>
          </Panel>
        ))}
      </div>
    );
  };
};

const summaryGridStyle = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: `${themeTokens.spacing[3]}`,
  marginTop: `${themeTokens.spacing[5]}`,
  '@media (max-width: 680px)': { gridTemplateColumns: '1fr' }
});
const itemStyle = css({ padding: `${themeTokens.spacing[4]}` });
const labelStyle = css({
  display: 'block',
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.caption}`
});
const valueStyle = css({
  display: 'block',
  marginTop: `${themeTokens.spacing[2]}`,
  fontSize: `${themeTokens.typography.size.metricSmall}`
});
