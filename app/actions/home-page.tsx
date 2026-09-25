import { css } from 'remix/ui'
import {
  eyebrowStyle,
  panelStyle,
  primaryButtonStyle,
  quietButtonStyle,
  theme,
  themeTokens,
} from '../theme/tokens.ts'
import { ArrowIcon } from '../ui/icons/arrow-icon.tsx'
import { CheckIcon } from '../ui/icons/check-icon.tsx'
import { ClockIcon } from '../ui/icons/clock-icon.tsx'
import { PaymentsIcon } from '../ui/icons/payments-icon.tsx'
import { PlusIcon } from '../ui/icons/plus-icon.tsx'
import { ProjectsIcon } from '../ui/icons/projects-icon.tsx'
import { SparkIcon } from '../ui/icons/spark-icon.tsx'
import { Panel } from '../ui/panel.tsx'
import { SectionHeading } from '../ui/section-heading.tsx'
import { Document } from './document.tsx'
import { ClientRow } from './home/client-row.tsx'
import { Metric } from './home/metric.tsx'
import { PaymentRow } from './home/payment-row.tsx'
import { ProjectRow } from './home/project-row.tsx'
import { Sidebar } from './home/sidebar.tsx'
import { TimeRow } from './home/time-row.tsx'
import { Topbar } from './home/topbar.tsx'
import { TimerWidget } from './public/timer-widget.tsx'

export function HomePage() {
  return () => (
    <Document title="Overview · AJ Workbench">
      <div mix={theme}>
        <div
          mix={css({
            display: 'grid',
            gridTemplateColumns: '238px minmax(0, 1fr)',
            minHeight: '100vh',
            '@media (max-width: 900px)': { gridTemplateColumns: '1fr' },
          })}
        >
          <Sidebar />
          <main
            mix={css({
              minWidth: 0,
              padding: `${themeTokens.spacing[6]} clamp(${themeTokens.spacing[5]}, 4vw, 54px) 48px`,
              maxWidth: '1600px',
              width: '100%',
              margin: '0 auto',
            })}
          >
            <Topbar />
            <div
              mix={css({
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'end',
                gap: `${themeTokens.spacing[4]}`,
                margin: `${themeTokens.spacing[8]} 0 ${themeTokens.spacing[6]}`,
                '@media (max-width: 580px)': { flexDirection: 'column', alignItems: 'start' },
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
                    letterSpacing: '-0.045em',
                  })}
                >
                  Good morning, Alex
                </h1>
                <p
                  mix={css({
                    margin: `${themeTokens.spacing[2]} 0 0`,
                    color: `${themeTokens.palette.text.secondary}`,
                  })}
                >
                  Here’s the shape of your work today.
                </p>
              </div>
              <a href="#new-project" mix={primaryButtonStyle}>
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
                '@media (max-width: 480px)': { gap: `${themeTokens.spacing[2]}` },
              })}
            >
              <Metric
                label="Active projects"
                value="4"
                note="Across 3 clients"
                icon={<ProjectsIcon />}
                tone="green"
              />
              <Metric
                label="Hours this week"
                value="18.5"
                note="A steady week so far"
                icon={<ClockIcon />}
                tone="blue"
              />
              <Metric
                label="Work logged"
                value="$6,240"
                note="Value of tracked time"
                icon={<CheckIcon />}
                tone="green"
              />
              <Metric
                label="Payments this month"
                value="$3,850"
                note="Manually recorded"
                icon={<PaymentsIcon />}
                tone="amber"
              />
            </div>

            <div
              mix={css({
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.45fr) minmax(300px, 0.85fr)',
                gap: `${themeTokens.spacing[4]}`,
                alignItems: 'start',
                '@media (max-width: 1050px)': { gridTemplateColumns: '1fr' },
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
                        marginBottom: `${themeTokens.spacing[4]}`,
                      })}
                    >
                      <div>
                        <p mix={[eyebrowStyle, css({ marginBottom: `${themeTokens.spacing[1]}` })]}>
                          Focus session
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
                          fontSize: `${themeTokens.typography.size.small}`,
                        })}
                      >
                        Today · 0h 45m tracked
                      </span>
                    </div>
                    <div
                      mix={css({
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1fr) minmax(135px, 0.62fr)',
                        gap: `${themeTokens.spacing[2]}`,
                        marginBottom: `${themeTokens.spacing[4]}`,
                        '@media (max-width: 560px)': { gridTemplateColumns: '1fr' },
                      })}
                    >
                      <label mix={fieldLabelStyle}>
                        <span>Project</span>
                        <select
                          aria-label="Choose a project"
                          mix={fieldStyle}
                          defaultValue="northstar"
                        >
                          <option value="northstar">Northstar Studio · Website refresh</option>
                          <option value="cedar">Cedar &amp; Finch · Booking flow</option>
                          <option value="personal">Unassigned work</option>
                        </select>
                      </label>
                      <label mix={fieldLabelStyle}>
                        <span>Task note</span>
                        <input
                          aria-label="Task note"
                          placeholder="e.g. Build pricing page"
                          mix={fieldStyle}
                        />
                      </label>
                    </div>
                    <div
                      mix={css({
                        borderTop: `1px solid ${themeTokens.palette.divider}`,
                        paddingTop: `${themeTokens.spacing[4]}`,
                      })}
                    >
                      <TimerWidget />
                    </div>
                  </div>
                </Panel>

                <Panel>
                  <div mix={cardPaddingStyle}>
                    <SectionHeading
                      eyebrow="Keep moving"
                      title="Active projects"
                      action={
                        <a href="#projects" mix={quietButtonStyle}>
                          All projects <ArrowIcon />
                        </a>
                      }
                    />
                    <div mix={css({ display: 'grid' })}>
                      <ProjectRow
                        initials="NS"
                        name="Website refresh"
                        client="Northstar Studio"
                        progress={72}
                        due="Due Oct 4"
                        rate="$125 / hour"
                        tone="green"
                      />
                      <ProjectRow
                        initials="CF"
                        name="Booking flow"
                        client="Cedar & Finch"
                        progress={46}
                        due="Due Oct 11"
                        rate="$110 / hour"
                        tone="blue"
                      />
                      <ProjectRow
                        initials="AP"
                        name="Portfolio updates"
                        client="Alder Peak Coffee"
                        progress={88}
                        due="In progress"
                        rate="$95 / hour"
                        tone="amber"
                      />
                    </div>
                  </div>
                </Panel>

                <Panel>
                  <div mix={cardPaddingStyle}>
                    <SectionHeading
                      eyebrow="Latest entries"
                      title="Recent time"
                      action={
                        <a href="#time-tracking" mix={quietButtonStyle}>
                          View time <ArrowIcon />
                        </a>
                      }
                    />
                    <TimeRow
                      title="Homepage component build"
                      client="Northstar Studio · Website refresh"
                      date="Today, 9:10 AM"
                      duration="1h 35m"
                      tint="green"
                    />
                    <TimeRow
                      title="Mobile booking QA"
                      client="Cedar & Finch · Booking flow"
                      date="Yesterday, 2:20 PM"
                      duration="0h 50m"
                      tint="blue"
                    />
                  </div>
                </Panel>
              </div>

              <aside mix={css({ display: 'grid', gap: `${themeTokens.spacing[4]}` })}>
                <Panel>
                  <div mix={cardPaddingStyle}>
                    <SectionHeading
                      eyebrow="Money received"
                      title="Recent payments"
                      action={
                        <a href="#payments" mix={quietButtonStyle}>
                          See all <ArrowIcon />
                        </a>
                      }
                    />
                    <PaymentRow
                      client="Northstar Studio"
                      project="Website refresh"
                      amount="$1,200"
                      date="Sep 22"
                      method="Bank transfer"
                    />
                    <PaymentRow
                      client="Cedar & Finch"
                      project="Booking flow"
                      amount="$850"
                      date="Sep 18"
                      method="Card"
                    />
                    <PaymentRow
                      client="Alder Peak Coffee"
                      project="Portfolio updates"
                      amount="$450"
                      date="Sep 12"
                      method="Check"
                    />
                    <a href="#payments/new" mix={addPaymentStyle}>
                      <PlusIcon /> Record a payment
                    </a>
                  </div>
                </Panel>

                <Panel>
                  <div mix={cardPaddingStyle}>
                    <SectionHeading
                      eyebrow="Good relationships"
                      title="Clients"
                      action={
                        <a href="#clients" mix={quietButtonStyle}>
                          All clients <ArrowIcon />
                        </a>
                      }
                    />
                    <ClientRow
                      initials="NS"
                      name="Northstar Studio"
                      summary="2 active projects"
                      tint="green"
                      rate="$125 / hr"
                    />
                    <ClientRow
                      initials="CF"
                      name="Cedar & Finch"
                      summary="1 active project"
                      tint="blue"
                      rate="$110 / hr"
                    />
                    <ClientRow
                      initials="AP"
                      name="Alder Peak Coffee"
                      summary="1 active project"
                      tint="amber"
                      rate="$95 / hr"
                    />
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
                      background: `linear-gradient(135deg, ${themeTokens.palette.success.light}, ${themeTokens.palette.background.paper})`,
                    }),
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
                      color: `${themeTokens.palette.success.main}`,
                    })}
                  >
                    <SparkIcon />
                  </span>
                  <div>
                    <p
                      mix={css({
                        margin: `0 0 ${themeTokens.spacing[1]}`,
                        fontSize: `${themeTokens.typography.size.small}`,
                        fontWeight: `${themeTokens.typography.weight.bold}`,
                      })}
                    >
                      A small win adds up
                    </p>
                    <p
                      mix={css({
                        margin: 0,
                        color: `${themeTokens.palette.text.secondary}`,
                        fontSize: `${themeTokens.typography.size.caption}`,
                        lineHeight: 1.55,
                      })}
                    >
                      Log time as you go. Your client rates stay attached to the work you complete.
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
                textAlign: 'center',
              })}
            >
              AJ Workbench <span aria-hidden="true">·</span> Your freelance work, in one place
            </footer>
          </main>
        </div>
      </div>
    </Document>
  )
}

const cardPaddingStyle = css({ padding: `${themeTokens.spacing[5]}` })
const fieldLabelStyle = css({
  display: 'grid',
  gap: `${themeTokens.spacing[1]}`,
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.caption}`,
  fontWeight: `${themeTokens.typography.weight.semibold}`,
})
const fieldStyle = css({
  width: '100%',
  height: '40px',
  minWidth: 0,
  padding: `0 ${themeTokens.spacing[3]}`,
  border: `1px solid ${themeTokens.palette.divider}`,
  borderRadius: `${themeTokens.shape.small}`,
  background: `${themeTokens.palette.background.paper}`,
  color: `${themeTokens.palette.text.primary}`,
  fontSize: `${themeTokens.typography.size.small}`,
})
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
  textDecoration: 'none',
})
