import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../../theme/tokens.ts';
import { Panel } from '../../ui/panel.tsx';
import type { ClientDetailData } from './client-detail-types.ts';

type ClientSummaryProps = {
  summary: ClientDetailData['summary'];
};

export const ClientSummary = (handle: Handle<ClientSummaryProps>) => {
  return () => {
    const items = [
      { label: 'Projects', value: handle.props.summary.projectCount },
      { label: 'Time tracked', value: handle.props.summary.trackedTime },
      { label: 'Work logged', value: handle.props.summary.loggedValue },
      { label: 'Payments recorded', value: handle.props.summary.paidValue }
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
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: `${themeTokens.spacing[3]}`,
  marginTop: `${themeTokens.spacing[5]}`,
  '@media (max-width: 1000px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  '@media (max-width: 560px)': { gridTemplateColumns: '1fr' }
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
  fontSize: `${themeTokens.typography.size.metricSmall}`,
  overflowWrap: 'anywhere'
});
