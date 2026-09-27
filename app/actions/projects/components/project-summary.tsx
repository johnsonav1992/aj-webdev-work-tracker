import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '#app/theme/tokens.ts';
import { Card } from '#app/ui/card.tsx';
import type { ProjectDetailData } from '#app/actions/projects/types/project-detail.ts';

type ProjectSummaryProps = {
  summary: ProjectDetailData['summary'];
};

export const ProjectSummary = (handle: Handle<ProjectSummaryProps>) => {
  return () => {
    const items = [
      { label: 'Time tracked', value: handle.props.summary.trackedTime },
      { label: 'Work value', value: handle.props.summary.loggedValue },
      { label: 'Time entries', value: handle.props.summary.entryCount }
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
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: `${themeTokens.spacing[3]}`,
  marginTop: `${themeTokens.spacing[5]}`,
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
