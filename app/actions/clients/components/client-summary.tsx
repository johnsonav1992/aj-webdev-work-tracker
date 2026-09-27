import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '#app/theme/tokens.ts';
import { Card } from '#app/ui/card.tsx';
import type { ClientDetailData } from '#app/actions/clients/types/client-detail.ts';

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
          <Card
            key={item.label}
            padding='compact'
          >
            <span mix={labelStyle}>{item.label}</span>
            <strong mix={valueStyle}>{item.value}</strong>
          </Card>
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
