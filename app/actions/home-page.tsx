import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';
import { themeTokens } from '../theme/tokens.ts';
import { CheckIcon } from '../ui/icons/check-icon.tsx';
import { ClockIcon } from '../ui/icons/clock-icon.tsx';
import { PaymentsIcon } from '../ui/icons/payments-icon.tsx';
import { ProjectsIcon } from '../ui/icons/projects-icon.tsx';
import { WorkspaceLayout } from './workspace/layout.tsx';
import { Metric } from './home/metric.tsx';
import type { HomeDashboardData } from './home/dashboard-types.ts';
import { OverviewAside } from './home/overview-aside.tsx';
import { TimerCard } from './home/timer-card.tsx';
import { WorkSections } from './home/work-sections.tsx';

type HomePageProps = {
  csrfToken: string;
  data: HomeDashboardData;
};

export const HomePage = (handle: Handle<HomePageProps>) => {
  return () => (
    <WorkspaceLayout
      activePage='overview'
      csrfToken={handle.props.csrfToken}
      pageTitle='Overview'
    >
      <div mix={css({ margin: `${themeTokens.spacing[8]} 0 ${themeTokens.spacing[6]}` })}>
        <h1
          mix={css({
            margin: 0,
            fontSize: 'clamp(27px, 4vw, 35px)',
            lineHeight: 1.15,
            letterSpacing: '-0.045em'
          })}
        >
          Overview
        </h1>
      </div>
      <div
        mix={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: `${themeTokens.spacing[3]}`,
          marginBottom: `${themeTokens.spacing[4]}`,
          '@media (max-width: 1000px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
          '@media (max-width: 480px)': { gap: `${themeTokens.spacing[2]}` }
        })}
      >
        <Metric
          label='Projects'
          value={handle.props.data.metrics.projects}
          note={handle.props.data.metrics.projectsNote}
          icon={<ProjectsIcon />}
          tone='green'
        />
        <Metric
          label='Hours this week'
          value={handle.props.data.metrics.hoursThisWeek}
          note='Logged since Monday'
          icon={<ClockIcon />}
          tone='blue'
        />
        <Metric
          label='Work logged'
          value={handle.props.data.metrics.loggedValue}
          note={handle.props.data.metrics.loggedValueNote}
          icon={<CheckIcon />}
          tone='green'
        />
        <Metric
          label='Payments this month'
          value={handle.props.data.metrics.paymentsThisMonth}
          note={handle.props.data.metrics.paymentsNote}
          icon={<PaymentsIcon />}
          tone='amber'
        />
      </div>
      <div
        mix={css({
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.45fr) minmax(300px, 0.85fr)',
          gap: `${themeTokens.spacing[4]}`,
          alignItems: 'start',
          '@media (max-width: 1050px)': { gridTemplateColumns: '1fr' }
        })}
      >
        <div mix={css({ display: 'grid', gap: `${themeTokens.spacing[4]}`, minWidth: 0 })}>
          <TimerCard projectOptions={handle.props.data.projectOptions} />
          <WorkSections
            projects={handle.props.data.projects}
            timeEntries={handle.props.data.timeEntries}
          />
        </div>
        <OverviewAside
          payments={handle.props.data.payments}
          clients={handle.props.data.clients}
        />
      </div>
    </WorkspaceLayout>
  );
};
