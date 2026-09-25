import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';
import {
  eyebrowStyle,
  panelStyle,
  primaryButtonStyle,
  quietButtonStyle,
  theme,
  themeTokens
} from '../theme/tokens.ts';
import { ArrowIcon } from '../ui/icons/arrow-icon.tsx';
import { CheckIcon } from '../ui/icons/check-icon.tsx';
import { ClockIcon } from '../ui/icons/clock-icon.tsx';
import { PaymentsIcon } from '../ui/icons/payments-icon.tsx';
import { PlusIcon } from '../ui/icons/plus-icon.tsx';
import { ProjectsIcon } from '../ui/icons/projects-icon.tsx';
import { SparkIcon } from '../ui/icons/spark-icon.tsx';
import { Panel } from '../ui/panel.tsx';
import { SectionHeading } from '../ui/section-heading.tsx';
import { Document } from './document.tsx';
import { ClientRow } from './home/client-row.tsx';
import { Metric } from './home/metric.tsx';
import { PaymentRow } from './home/payment-row.tsx';
import { ProjectRow } from './home/project-row.tsx';
import { Sidebar } from './home/sidebar.tsx';
import { TimeRow } from './home/time-row.tsx';
import { Topbar } from './home/topbar.tsx';
import { TimerWidget } from './public/timer-widget.tsx';

type HomePageProps = {
  csrfToken: string;
  data: Awaited<ReturnType<typeof import('../db/dashboard.ts').getDashboardData>>;
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
              <a href='#new-project' mix={primaryButtonStyle}>
                <PlusIcon />
                New project
              </a>
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
                <Panel>
                  <div mix={css({ padding: `${themeTokens.spacing[5]}` })}>
                    <div
                      mix={css({
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        gap: `${themeTokens.spacing[4]}`,
                        marginBottom: `${themeTokens.spacing[4]}`
                      })}
                    >
                      <div>
                        <p mix={[eyebrowStyle, css({ marginBottom: `${themeTokens.spacing[1]}` })]}>
                          Timer preview
                        </p>
                        <h2
                          mix={css({ margin: 0, fontSize: `${themeTokens.typography.size.body}` })}
                        >
                          What are you working on?
                        </h2>
                      </div>
                      <span
                        mix={css({
                          color: `${themeTokens.palette.text.muted}`,
                          fontSize: `${themeTokens.typography.size.small}`
                        })}
                      >
                        This timer does not save entries yet.
                      </span>
                    </div>
                    <div
                      mix={css({
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1fr) minmax(135px, 0.62fr)',
                        gap: `${themeTokens.spacing[2]}`,
                        marginBottom: `${themeTokens.spacing[4]}`,
                        '@media (max-width: 560px)': { gridTemplateColumns: '1fr' }
                      })}
                    >
                      <label mix={fieldLabelStyle}>
                        <span>Project</span>
                        <select
                          aria-label='Choose a project'
                          mix={fieldStyle}
                          defaultValue={handle.props.data.projectOptions[0]?.id ?? ''}
                        >
                          {handle.props.data.projectOptions.length ? (
                            handle.props.data.projectOptions.map((project) => (
                              <option key={project.id} value={project.id}>
                                {project.client} · {project.name}
                              </option>
                            ))
                          ) : (
                            <option value=''>No active projects</option>
                          )}
                        </select>
                      </label>
                      <label mix={fieldLabelStyle}>
                        <span>Task note</span>
                        <input
                          aria-label='Task note'
                          placeholder='e.g. Build pricing page'
                          mix={fieldStyle}
                        />
                      </label>
                    </div>
                    <div
                      mix={css({
                        borderTop: `1px solid ${themeTokens.palette.divider}`,
                        paddingTop: `${themeTokens.spacing[4]}`
                      })}
                    >
                      <TimerWidget />
                    </div>
                  </div>
                </Panel>

                <Panel>
                  <div mix={cardPaddingStyle}>
                    <SectionHeading
                      eyebrow='Your work'
                      title='Projects'
                      action={
                        <a href='#projects' mix={quietButtonStyle}>
                          All projects <ArrowIcon />
                        </a>
                      }
                    />
                    <div mix={css({ display: 'grid' })}>
                      {handle.props.data.projects.length ? (
                        handle.props.data.projects.map((project) => (
                          <ProjectRow key={project.id} {...project} />
                        ))
                      ) : (
                        <p mix={emptyStateStyle}>Projects you add will appear here.</p>
                      )}
                    </div>
                  </div>
                </Panel>

                <Panel>
                  <div mix={cardPaddingStyle}>
                    <SectionHeading
                      eyebrow='Latest entries'
                      title='Recent time'
                      action={
                        <a href='#time-tracking' mix={quietButtonStyle}>
                          View time <ArrowIcon />
                        </a>
                      }
                    />
                    {handle.props.data.timeEntries.length ? (
                      handle.props.data.timeEntries.map((entry) => (
                        <TimeRow key={entry.id} {...entry} />
                      ))
                    ) : (
                      <p mix={emptyStateStyle}>Logged time will appear here.</p>
                    )}
                  </div>
                </Panel>
              </div>

              <aside mix={css({ display: 'grid', gap: `${themeTokens.spacing[4]}` })}>
                <Panel>
                  <div mix={cardPaddingStyle}>
                    <SectionHeading
                      eyebrow='Money received'
                      title='Recent payments'
                      action={
                        <a href='#payments' mix={quietButtonStyle}>
                          See all <ArrowIcon />
                        </a>
                      }
                    />
                    {handle.props.data.payments.length ? (
                      handle.props.data.payments.map((payment) => (
                        <PaymentRow key={payment.id} {...payment} />
                      ))
                    ) : (
                      <p mix={emptyStateStyle}>
                        Payment records will appear after Stripe is connected.
                      </p>
                    )}
                    <a href='#payments/new' mix={addPaymentStyle}>
                      <PlusIcon /> Record a payment
                    </a>
                  </div>
                </Panel>

                <Panel>
                  <div mix={cardPaddingStyle}>
                    <SectionHeading
                      eyebrow='Good relationships'
                      title='Clients'
                      action={
                        <a href='#clients' mix={quietButtonStyle}>
                          All clients <ArrowIcon />
                        </a>
                      }
                    />
                    {handle.props.data.clients.length ? (
                      handle.props.data.clients.map((client) => (
                        <ClientRow key={client.id} {...client} />
                      ))
                    ) : (
                      <p mix={emptyStateStyle}>Clients you add will appear here.</p>
                    )}
                  </div>
                </Panel>

                <div
                  mix={[
                    panelStyle,
                    css({
                      padding: `${themeTokens.spacing[4]}`,
                      display: 'flex',
                      alignItems: 'start',
                      gap: `${themeTokens.spacing[3]}`,
                      background: `linear-gradient(135deg, ${themeTokens.palette.success.light}, ${themeTokens.palette.background.paper})`
                    })
                  ]}
                >
                  <span
                    mix={css({
                      width: '34px',
                      height: '34px',
                      display: 'grid',
                      placeItems: 'center',
                      flex: '0 0 34px',
                      borderRadius: `${themeTokens.shape.medium}`,
                      background: `${themeTokens.palette.success.light}`,
                      color: `${themeTokens.palette.success.main}`
                    })}
                  >
                    <SparkIcon />
                  </span>
                  <div>
                    <p
                      mix={css({
                        margin: `0 0 ${themeTokens.spacing[1]}`,
                        fontSize: `${themeTokens.typography.size.small}`,
                        fontWeight: `${themeTokens.typography.weight.bold}`
                      })}
                    >
                      A small win adds up
                    </p>
                    <p
                      mix={css({
                        margin: 0,
                        color: `${themeTokens.palette.text.secondary}`,
                        fontSize: `${themeTokens.typography.size.caption}`,
                        lineHeight: 1.55
                      })}
                    >
                      The project totals above use recorded time and the client rates saved with
                      each entry.
                    </p>
                  </div>
                </div>
              </aside>
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

const cardPaddingStyle = css({ padding: `${themeTokens.spacing[5]}` });
const emptyStateStyle = css({
  margin: 0,
  padding: `${themeTokens.spacing[4]} 0`,
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.small}`
});
const fieldLabelStyle = css({
  display: 'grid',
  gap: `${themeTokens.spacing[1]}`,
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.caption}`,
  fontWeight: `${themeTokens.typography.weight.semibold}`
});
const fieldStyle = css({
  width: '100%',
  height: '40px',
  minWidth: 0,
  padding: `0 ${themeTokens.spacing[3]}`,
  border: `1px solid ${themeTokens.palette.divider}`,
  borderRadius: `${themeTokens.shape.small}`,
  background: `${themeTokens.palette.background.paper}`,
  color: `${themeTokens.palette.text.primary}`,
  fontSize: `${themeTokens.typography.size.small}`
});
const addPaymentStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: `${themeTokens.spacing[2]}`,
  width: '100%',
  marginTop: `${themeTokens.spacing[3]}`,
  padding: `${themeTokens.spacing[3]}`,
  border: `1px dashed ${themeTokens.palette.dividerStrong}`,
  borderRadius: `${themeTokens.shape.small}`,
  color: `${themeTokens.palette.success.dark}`,
  fontSize: `${themeTokens.typography.size.small}`,
  fontWeight: `${themeTokens.typography.weight.semibold}`,
  textDecoration: 'none'
});
