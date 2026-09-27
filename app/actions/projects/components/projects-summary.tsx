import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '#app/theme/tokens.ts';
import { CheckIcon } from '#app/ui/icons/check-icon.tsx';
import { ClockIcon } from '#app/ui/icons/clock-icon.tsx';
import { ProjectsIcon } from '#app/ui/icons/projects-icon.tsx';
import { Card } from '#app/ui/card.tsx';
import type { ProjectsPageData } from '#app/actions/projects/types/projects.ts';

type ProjectsSummaryProps = {
  metrics: ProjectsPageData['metrics'];
};

export const ProjectsSummary = (handle: Handle<ProjectsSummaryProps>) => {
  return () => {
    const items = [
      { label: 'Total projects', value: handle.props.metrics.total, icon: <ProjectsIcon /> },
      { label: 'Active now', value: handle.props.metrics.active, icon: <ClockIcon /> },
      { label: 'Completed', value: handle.props.metrics.completed, icon: <CheckIcon /> },
      { label: 'Time tracked', value: handle.props.metrics.trackedTime, icon: <ClockIcon /> }
    ];

    return (
      <div mix={summaryGridStyle}>
        {items.map((item) => (
          <Card
            key={item.label}
            padding='compact'
            mix={metricStyle}
          >
            <span mix={iconStyle}>{item.icon}</span>
            <div>
              <p mix={labelStyle}>{item.label}</p>
              <strong mix={valueStyle}>{item.value}</strong>
            </div>
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
  '@media (max-width: 1000px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }
});
const metricStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: `${themeTokens.spacing[3]}`
});
const iconStyle = css({
  display: 'grid',
  placeItems: 'center',
  width: '36px',
  height: '36px',
  flex: '0 0 36px',
  borderRadius: `${themeTokens.shape.large}`,
  background: `${themeTokens.palette.background.subtle}`,
  color: `${themeTokens.palette.primary.main}`
});
const labelStyle = css({
  margin: 0,
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.caption}`
});
const valueStyle = css({
  display: 'block',
  marginTop: `${themeTokens.spacing[1]}`,
  fontSize: `${themeTokens.typography.size.metricSmall}`
});
