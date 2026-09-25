import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';
import { eyebrowStyle, theme, themeTokens } from '../theme/tokens.ts';
import { CheckIcon } from '../ui/icons/check-icon.tsx';
import { ClockIcon } from '../ui/icons/clock-icon.tsx';
import { PaymentsIcon } from '../ui/icons/payments-icon.tsx';
import { PlusIcon } from '../ui/icons/plus-icon.tsx';
import { ProjectsIcon } from '../ui/icons/projects-icon.tsx';
import { Button } from '../ui/button.tsx';
import { Document } from './document.tsx';
import { Metric } from './home/metric.tsx';
import type { HomeDashboardData } from './home/dashboard-types.ts';
import { OverviewAside } from './home/overview-aside.tsx';
import { Sidebar } from './home/sidebar.tsx';
import { TimerCard } from './home/timer-card.tsx';
import { Topbar } from './home/topbar.tsx';
import { WorkSections } from './home/work-sections.tsx';

type HomePageProps = {
  csrfToken: string;
  data: HomeDashboardData;
};

export const HomePage = (handle: Handle<HomePageProps>) => {
  return () => (
    <Document title='Overview · AJ Workbench'>
      <div mix={theme}>
        <div
          mix={css({
            display: 'grid',
            gridTemplateColumns: '238px minmax(0, 1fr)',
            minHeight: '100vh',
            '@media (max-width: 900px)': { gridTemplateColumns: '1fr' }
          })}
        >
          <Sidebar />
          <main
            mix={css({
              minWidth: 0,
              padding: `${themeTokens.spacing[6]} clamp(${themeTokens.spacing[5]}, 4vw, 54px) 48px`,
              maxWidth: '1600px',
              width: '100%',
              margin: '0 auto'
            })}
          >
            <Topbar csrfToken={handle.props.csrfToken} />
            <div
              mix={css({
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'end',
                gap: `${themeTokens.spacing[4]}`,
                margin: `${themeTokens.spacing[8]} 0 ${themeTokens.spacing[6]}`,
                '@media (max-width: 580px)': { flexDirection: 'column', alignItems: 'start' }
              })}
            >
              <div>
                <p mix={[eyebrowStyle, css({ marginBottom: `${themeTokens.spacing[2]}` })]}>
                  Your freelance workspace
                </p>
                <h1
                  mix={css({
                    margin: 0,
                    fontSize: 'clamp(27px, 4vw, 35px)',
                    lineHeight: 1.15,
                    letterSpacing: '-0.045em'
                  })}
                >
                  Welcome, {handle.props.data.displayName}
                </h1>
                <p
                  mix={css({
                    margin: `${themeTokens.spacing[2]} 0 0`,
                    color: `${themeTokens.palette.text.secondary}`
                  })}
                >
                  Here’s the shape of your work today.
                </p>
              </div>
              <Button
                href='#new-project'
                variant='primary'
              >
                <PlusIcon />
                New project
              </Button>
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
            <footer
              mix={css({
                marginTop: `${themeTokens.spacing[6]}`,
                color: `${themeTokens.palette.text.muted}`,
                fontSize: `${themeTokens.typography.size.caption}`,
                textAlign: 'center'
              })}
            >
              AJ Workbench <span aria-hidden='true'>·</span> Your freelance work, in one place
            </footer>
          </main>
        </div>
      </div>
    </Document>
  );
};
