import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../../theme/tokens.ts';
import { Panel } from '../../ui/panel.tsx';
import type { ProjectDetailData } from './project-detail-types.ts';

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
          <Panel key={item.label}>
            <div mix={summaryItemStyle}>
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
  '@media (max-width: 560px)': { gridTemplateColumns: '1fr' }
});
const summaryItemStyle = css({ padding: `${themeTokens.spacing[4]}` });
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
