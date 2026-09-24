import type { Handle, RemixNode } from 'remix/ui'
import { css } from 'remix/ui'

import { TimerWidget } from './public/timer-widget.tsx'
import { Avatar, Panel, SectionHeading, StatusBadge } from '../ui/components.tsx'
import { Document } from './document.tsx'
import { eyebrowStyle, panelStyle, quietButtonStyle, theme } from '../theme/tokens.ts'

const pageStyle = css({
  display: 'grid',
  gridTemplateColumns: '238px minmax(0, 1fr)',
  minHeight: '100vh',
  '@media (max-width: 900px)': { gridTemplateColumns: '1fr' },
})

export function HomePage() {
  return () => (
    <Document title="Overview · AJ Workbench">
      <div mix={theme}>
        <div mix={pageStyle}>
          <Sidebar />
          <main mix={css({ minWidth: 0, padding: '31px clamp(20px, 4vw, 54px) 48px', maxWidth: '1600px', width: '100%', margin: '0 auto' })}>
            <Topbar />
            <div mix={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: '18px', margin: '29px 0 23px', '@media (max-width: 580px)': { flexDirection: 'column', alignItems: 'start' } })}>
              <div>
                <p mix={[eyebrowStyle, css({ marginBottom: '8px' })]}>Wednesday, September 24</p>
                <h1 mix={css({ margin: 0, fontSize: 'clamp(27px, 4vw, 35px)', lineHeight: 1.15, letterSpacing: '-0.045em' })}>Good morning, Alex</h1>
                <p mix={css({ margin: '9px 0 0', color: 'var(--ink-soft)', fontSize: '14px' })}>Here’s the shape of your work today.</p>
              </div>
              <a href="#new-project" mix={quietButtonStyle}><PlusIcon />New project</a>
            </div>

            <div mix={css({ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '13px', marginBottom: '17px', '@media (max-width: 1000px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }, '@media (max-width: 480px)': { gap: '9px' } })}>
              <Metric label="Active projects" value="4" note="Across 3 clients" icon={<StackIcon />} tone="green" />
              <Metric label="Hours this week" value="18.5" note="A steady week so far" icon={<ClockIcon />} tone="blue" />
              <Metric label="Outstanding" value="$3,850" note="Across 3 invoices" icon={<CoinIcon />} tone="amber" />
              <Metric label="Collected this month" value="$6,240" note="September to date" icon={<CheckIcon />} tone="green" />
            </div>

            <div mix={css({ display: 'grid', gridTemplateColumns: 'minmax(0, 1.45fr) minmax(300px, 0.85fr)', gap: '17px', alignItems: 'start', '@media (max-width: 1050px)': { gridTemplateColumns: '1fr' } })}>
              <div mix={css({ display: 'grid', gap: '17px', minWidth: 0 })}>
                <Panel>
                  <div mix={css({ padding: '20px 21px 18px' })}>
                    <div mix={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '15px', marginBottom: '15px' })}>
                      <div>
                        <p mix={[eyebrowStyle, css({ marginBottom: '6px' })]}>Focus session</p>
                        <h2 mix={css({ margin: 0, fontSize: '16px', lineHeight: 1.4 })}>What are you working on?</h2>
                      </div>
                      <span mix={css({ color: 'var(--muted)', fontSize: '12px' })}>Today · 0h 45m tracked</span>
                    </div>
                    <div mix={css({ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(135px, 0.62fr)', gap: '10px', marginBottom: '17px', '@media (max-width: 560px)': { gridTemplateColumns: '1fr' } })}>
                      <label mix={selectLabelStyle}>
                        <span>Project</span>
                        <select aria-label="Choose a project" mix={selectStyle} defaultValue="northstar">
                          <option value="northstar">Northstar Studio · Website refresh</option>
                          <option value="cedar">Cedar &amp; Finch · Booking flow</option>
                          <option value="personal">Unassigned work</option>
                        </select>
                      </label>
                      <label mix={selectLabelStyle}>
                        <span>Task note</span>
                        <input aria-label="Task note" placeholder="e.g. Build pricing page" mix={selectStyle} />
                      </label>
                    </div>
                    <div mix={css({ borderTop: '1px solid var(--line)', paddingTop: '15px' })}>
                      <TimerWidget />
                    </div>
                  </div>
                </Panel>

                <Panel>
                  <div mix={cardPadStyle}>
                    <SectionHeading eyebrow="Keep moving" title="Active projects" action={<a href="#projects" mix={quietButtonStyle}>All projects <ArrowIcon /></a>} />
                    <div mix={css({ display: 'grid' })}>
                      <ProjectRow initials="NS" name="Website refresh" client="Northstar Studio" progress={72} due="Due Oct 4" amount="$4,800" tone="green" />
                      <ProjectRow initials="CF" name="Booking flow" client="Cedar & Finch" progress={46} due="Due Oct 11" amount="$2,200" tone="blue" />
                      <ProjectRow initials="AP" name="Care plan · September" client="Alder Peak Coffee" progress={88} due="Due Sep 30" amount="$650 / mo" tone="amber" last />
                    </div>
                  </div>
                </Panel>

                <Panel>
                  <div mix={cardPadStyle}>
                    <SectionHeading eyebrow="Latest entries" title="Recent time" action={<a href="#time" mix={quietButtonStyle}>View timesheet <ArrowIcon /></a>} />
                    <div mix={css({ display: 'grid' })}>
                      <TimeRow title="Homepage component build" client="Northstar Studio · Website refresh" date="Today, 9:10 AM" duration="1h 35m" tint="green" />
                      <TimeRow title="Mobile booking QA" client="Cedar & Finch · Booking flow" date="Yesterday, 2:20 PM" duration="0h 50m" tint="blue" />
                      <TimeRow title="Monthly content updates" client="Alder Peak Coffee · Care plan" date="Yesterday, 10:05 AM" duration="1h 15m" tint="amber" last />
                    </div>
                  </div>
                </Panel>
              </div>

              <aside mix={css({ display: 'grid', gap: '17px' })}>
                <Panel>
                  <div mix={cardPadStyle}>
                    <SectionHeading eyebrow="Needs a nudge" title="Open invoices" action={<a href="#payments" mix={quietButtonStyle}>See all <ArrowIcon /></a>} />
                    <div mix={css({ display: 'grid' })}>
                      <InvoiceRow client="Northstar Studio" detail="Website refresh · #1042" amount="$2,400" due="Due in 3 days" tone="amber" />
                      <InvoiceRow client="Cedar & Finch" detail="Booking flow · #1039" amount="$1,100" due="9 days overdue" tone="red" />
                      <InvoiceRow client="Alder Peak Coffee" detail="Monthly care · #1044" amount="$350" due="Due Sep 30" tone="gray" last />
                    </div>
                    <a href="#invoice" mix={css({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', width: '100%', marginTop: '15px', padding: '10px', border: '1px dashed #cdd6cf', borderRadius: '9px', color: 'var(--green-dark)', fontSize: '12px', fontWeight: 650, textDecoration: 'none' })}><PlusIcon /> Record a payment</a>
                  </div>
                </Panel>

                <Panel>
                  <div mix={cardPadStyle}>
                    <SectionHeading eyebrow="Good relationships" title="Clients" action={<a href="#clients" mix={quietButtonStyle}>All clients <ArrowIcon /></a>} />
                    <ClientRow initials="NS" name="Northstar Studio" projects="2 active projects" tint="green" value="$4,800" />
                    <ClientRow initials="CF" name="Cedar & Finch" projects="1 active project" tint="blue" value="$2,200" />
                    <ClientRow initials="AP" name="Alder Peak Coffee" projects="Care plan · ongoing" tint="amber" value="$650 / mo" last />
                  </div>
                </Panel>

                <div mix={[panelStyle, css({ padding: '17px 18px', display: 'flex', alignItems: 'start', gap: '12px', background: 'linear-gradient(135deg, #f1f7f2, #ffffff)' })]}>
                  <span mix={css({ width: '34px', height: '34px', display: 'grid', placeItems: 'center', flex: '0 0 34px', borderRadius: '10px', background: 'var(--green-soft)', color: 'var(--green)' })}><SparkIcon /></span>
                  <div><p mix={css({ margin: '0 0 3px', fontSize: '12px', fontWeight: 700 })}>A small win adds up</p><p mix={css({ margin: 0, color: 'var(--ink-soft)', fontSize: '11px', lineHeight: 1.55 })}>Log time as you go and your project totals stay ready for the next invoice.</p></div>
                </div>
              </aside>
            </div>
            <footer mix={css({ marginTop: '25px', color: 'var(--muted)', fontSize: '11px', textAlign: 'center' })}>AJ Workbench <span aria-hidden="true">·</span> Your freelance work, in one place</footer>
          </main>
        </div>
      </div>
    </Document>
  )
}

const cardPadStyle = css({ padding: '19px 20px 18px' })
const selectLabelStyle = css({ display: 'grid', gap: '6px', color: 'var(--muted)', fontSize: '11px', fontWeight: 650 })
const selectStyle = css({ width: '100%', height: '40px', minWidth: 0, padding: '0 11px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff', color: 'var(--ink)', fontSize: '12px', fontWeight: 500 })

function Sidebar() {
  let nav = [
    { label: 'Overview', icon: <GridIcon />, active: true },
    { label: 'Clients', icon: <UsersIcon /> },
    { label: 'Projects', icon: <StackIcon /> },
    { label: 'Time tracking', icon: <ClockIcon /> },
    { label: 'Payments', icon: <CoinIcon />, count: '3' },
  ]
  return () => (
    <aside mix={css({ position: 'sticky', top: 0, alignSelf: 'start', height: '100vh', padding: '23px 15px 17px', borderRight: '1px solid var(--line)', background: '#fbfcfa', display: 'flex', flexDirection: 'column', '@media (max-width: 900px)': { position: 'relative', height: 'auto', padding: '12px 18px', borderRight: 0, borderBottom: '1px solid var(--line)' } })}>
      <a href="#overview" mix={css({ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 7px', color: 'var(--ink)', textDecoration: 'none' })}>
        <span mix={css({ width: '34px', height: '34px', display: 'grid', placeItems: 'center', borderRadius: '10px', background: 'var(--green)', color: '#fff' })}><MarkIcon /></span>
        <span><strong mix={css({ display: 'block', fontSize: '13px', letterSpacing: '-0.02em' })}>AJ Workbench</strong><small mix={css({ display: 'block', marginTop: '1px', color: 'var(--muted)', fontSize: '10px' })}>Freelance workspace</small></span>
      </a>
      <p mix={[eyebrowStyle, css({ margin: '39px 10px 9px', '@media (max-width: 900px)': { display: 'none' } })]}>Workspace</p>
      <nav aria-label="Main navigation" mix={css({ display: 'grid', gap: '4px', '@media (max-width: 900px)': { display: 'flex', overflowX: 'auto', marginTop: '12px' } })}>
        {nav.map((item) => <a key={item.label} href={item.active ? '#overview' : `#${item.label.toLowerCase().replaceAll(' ', '-')}`} aria-current={item.active ? 'page' : undefined} mix={css({ display: 'flex', alignItems: 'center', gap: '11px', minHeight: '39px', padding: '0 10px', borderRadius: '8px', background: item.active ? '#eaf3ed' : 'transparent', color: item.active ? 'var(--green-dark)' : 'var(--ink-soft)', fontSize: '12px', fontWeight: item.active ? 700 : 550, textDecoration: 'none', whiteSpace: 'nowrap', '&:hover': { background: item.active ? '#eaf3ed' : '#f0f3ef' } })}>
          <span mix={css({ display: 'grid', placeItems: 'center', width: '18px' })}>{item.icon}</span>{item.label}{item.count ? <span mix={css({ marginLeft: 'auto', display: 'grid', placeItems: 'center', minWidth: '20px', height: '20px', borderRadius: '6px', background: '#f8eae8', color: 'var(--red)', fontSize: '10px', fontWeight: 700 })}>{item.count}</span> : null}
        </a>)}
      </nav>
      <div mix={css({ marginTop: 'auto', '@media (max-width: 900px)': { display: 'none' } })}>
        <div mix={css({ margin: '0 4px 15px', padding: '13px', border: '1px solid var(--line)', borderRadius: '11px', background: 'white' })}>
          <p mix={css({ margin: '0 0 5px', fontSize: '11px', fontWeight: 700 })}>September summary</p>
          <p mix={css({ margin: '0 0 10px', color: 'var(--muted)', fontSize: '10px' })}>A nice month of focused work.</p>
          <div mix={css({ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-soft)', fontSize: '10px' })}><span>Collected</span><strong mix={css({ color: 'var(--ink)' })}>$6,240</strong></div>
          <div mix={css({ height: '4px', marginTop: '7px', overflow: 'hidden', borderRadius: '99px', background: '#edf0ed' })}><span mix={css({ display: 'block', width: '67%', height: '100%', borderRadius: '99px', background: '#65a27b' })} /></div>
        </div>
        <a href="#settings" mix={css({ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 8px 3px', color: 'var(--ink-soft)', textDecoration: 'none' })}><Avatar initials="AJ" /><span mix={css({ minWidth: 0, flex: 1 })}><strong mix={css({ display: 'block', color: 'var(--ink)', fontSize: '11px' })}>Alex Johnson</strong><small mix={css({ color: 'var(--muted)', fontSize: '10px' })}>Account settings</small></span><MoreIcon /></a>
      </div>
    </aside>
  )
}

function Topbar() {
  return () => <header mix={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '35px' })}>
    <div mix={css({ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: '11px' })}><span>Workspace</span><span aria-hidden="true">/</span><strong mix={css({ color: 'var(--ink-soft)', fontWeight: 600 })}>Overview</strong></div>
    <div mix={css({ display: 'flex', alignItems: 'center', gap: '10px' })}><span mix={css({ padding: '6px 9px', border: '1px solid var(--line)', borderRadius: '8px', background: 'white', color: 'var(--ink-soft)', fontSize: '10px' })}>September 2026</span><button type="button" aria-label="Notifications" mix={css({ width: '34px', height: '34px', display: 'grid', placeItems: 'center', border: '1px solid var(--line)', borderRadius: '9px', background: '#fff', color: 'var(--ink-soft)' })}><BellIcon /></button></div>
  </header>
}

type MetricProps = { label: string; value: string; note: string; icon: RemixNode; tone: 'green' | 'blue' | 'amber' }
function Metric(handle: Handle<MetricProps>) {
  return () => {
    let colors = { green: ['#e7f2ea', '#337454'], blue: ['#eaf1f5', '#53758a'], amber: ['#fbf0df', '#aa762f'] }[handle.props.tone]
    return <section mix={[panelStyle, css({ padding: '15px 15px 14px', minWidth: 0, '@media (max-width: 480px)': { padding: '11px' } })]}>
      <div mix={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '13px' })}><p mix={css({ margin: 0, color: 'var(--ink-soft)', fontSize: '11px', fontWeight: 600, '@media (max-width: 480px)': { fontSize: '10px' } })}>{handle.props.label}</p><span mix={css({ width: '28px', height: '28px', flex: '0 0 28px', display: 'grid', placeItems: 'center', borderRadius: '8px', background: colors[0], color: colors[1], '@media (max-width: 480px)': { display: 'none' } })}>{handle.props.icon}</span></div>
      <p mix={css({ margin: 0, fontSize: '24px', lineHeight: 1.1, fontWeight: 700, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums', '@media (max-width: 480px)': { fontSize: '20px' } })}>{handle.props.value}</p><p mix={css({ margin: '7px 0 0', color: 'var(--muted)', fontSize: '10px' })}>{handle.props.note}</p>
    </section>
  }
}

type ProjectRowProps = { initials: string; name: string; client: string; progress: number; due: string; amount: string; tone: 'green' | 'blue' | 'amber'; last?: boolean }
function ProjectRow(handle: Handle<ProjectRowProps>) {
  return () => <div mix={css({ display: 'grid', gridTemplateColumns: '36px minmax(0, 1fr) 110px auto', gap: '11px', alignItems: 'center', padding: '13px 0', borderTop: '1px solid var(--line)', '@media (max-width: 650px)': { gridTemplateColumns: '36px minmax(0, 1fr) auto' } })}>
    <Avatar initials={handle.props.initials} tint={handle.props.tone} />
    <div mix={css({ minWidth: 0 })}><div mix={css({ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '7px' })}><strong mix={css({ fontSize: '12px' })}>{handle.props.name}</strong><StatusBadge tone={handle.props.tone}>{handle.props.progress === 88 ? 'In review' : 'In progress'}</StatusBadge></div><p mix={css({ margin: '3px 0 0', color: 'var(--muted)', fontSize: '10px' })}>{handle.props.client} <span aria-hidden="true">·</span> {handle.props.due}</p><div mix={css({ display: 'none', marginTop: '8px', '@media (max-width: 650px)': { display: 'block' } })}><Progress value={handle.props.progress} /></div></div>
    <div mix={css({ '@media (max-width: 650px)': { display: 'none' } })}><Progress value={handle.props.progress} /></div>
    <strong mix={css({ fontSize: '11px', textAlign: 'right', whiteSpace: 'nowrap' })}>{handle.props.amount}</strong>
  </div>
}

function Progress(handle: Handle<{ value: number }>) {
  return () => <div aria-label={`${handle.props.value}% complete`} mix={css({ height: '5px', overflow: 'hidden', borderRadius: '99px', background: '#edf0ed' })}><span mix={css({ display: 'block', width: `${handle.props.value}%`, height: '100%', borderRadius: 'inherit', background: 'linear-gradient(90deg, #5b9b73, #78b48b)' })} /></div>
}

function TimeRow(handle: Handle<{ title: string; client: string; date: string; duration: string; tint: 'green' | 'blue' | 'amber'; last?: boolean }>) {
  return () => <div mix={css({ display: 'flex', alignItems: 'center', gap: '11px', padding: '12px 0', borderTop: '1px solid var(--line)' })}>
    <span mix={css({ display: 'grid', placeItems: 'center', width: '32px', height: '32px', flex: '0 0 32px', borderRadius: '9px', background: { green: '#e7f2ea', blue: '#eaf1f5', amber: '#fbf0df' }[handle.props.tint], color: { green: '#337454', blue: '#53758a', amber: '#aa762f' }[handle.props.tint] })}><ClockIcon /></span>
    <div mix={css({ minWidth: 0, flex: 1 })}><strong mix={css({ display: 'block', overflow: 'hidden', fontSize: '11px', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })}>{handle.props.title}</strong><p mix={css({ overflow: 'hidden', margin: '3px 0 0', color: 'var(--muted)', fontSize: '10px', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })}>{handle.props.client} <span aria-hidden="true">·</span> {handle.props.date}</p></div>
    <strong mix={css({ fontSize: '11px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' })}>{handle.props.duration}</strong>
  </div>
}

function InvoiceRow(handle: Handle<{ client: string; detail: string; amount: string; due: string; tone: 'amber' | 'red' | 'gray'; last?: boolean }>) {
  return () => <div mix={css({ padding: '12px 0', borderTop: '1px solid var(--line)' })}>
    <div mix={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '8px' })}><strong mix={css({ fontSize: '11px' })}>{handle.props.client}</strong><strong mix={css({ fontSize: '12px', whiteSpace: 'nowrap' })}>{handle.props.amount}</strong></div>
    <div mix={css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginTop: '3px' })}><span mix={css({ overflow: 'hidden', color: 'var(--muted)', fontSize: '10px', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })}>{handle.props.detail}</span><span mix={css({ color: { amber: '#986a31', red: 'var(--red)', gray: 'var(--muted)' }[handle.props.tone], fontSize: '9px', whiteSpace: 'nowrap' })}>{handle.props.due}</span></div>
  </div>
}

function ClientRow(handle: Handle<{ initials: string; name: string; projects: string; value: string; tint: 'green' | 'blue' | 'amber'; last?: boolean }>) {
  return () => <div mix={css({ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 0', borderTop: '1px solid var(--line)' })}>
    <Avatar initials={handle.props.initials} tint={handle.props.tint} />
    <div mix={css({ minWidth: 0, flex: 1 })}><strong mix={css({ display: 'block', fontSize: '11px' })}>{handle.props.name}</strong><span mix={css({ display: 'block', marginTop: '2px', color: 'var(--muted)', fontSize: '10px' })}>{handle.props.projects}</span></div>
    <strong mix={css({ fontSize: '10px', whiteSpace: 'nowrap' })}>{handle.props.value}</strong>
  </div>
}

function Icon(handle: Handle<{ children?: RemixNode }>) { return () => <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" mix={css({ width: '17px', height: '17px', display: 'block' })}>{handle.props.children}</svg> }
function GridIcon() { return () => <Icon><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Icon> }
function UsersIcon() { return () => <Icon><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></Icon> }
function StackIcon() { return () => <Icon><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></Icon> }
function ClockIcon() { return () => <Icon><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon> }
function CoinIcon() { return () => <Icon><circle cx="12" cy="12" r="9" /><path d="M16 8.5c-.7-.7-1.8-1.1-3.1-1.1-1.8 0-3.1.9-3.1 2.2s1.1 1.9 3.1 2.3c2 .4 3.1 1.1 3.1 2.4s-1.4 2.4-3.3 2.4c-1.4 0-2.7-.5-3.6-1.3M12.5 5.8v12.4" /></Icon> }
function CheckIcon() { return () => <Icon><path d="M20 7 10 17l-5-5" /><path d="M21 12a9 9 0 1 1-5.3-8.2" /></Icon> }
function BellIcon() { return () => <Icon><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></Icon> }
function MarkIcon() { return () => <Icon><path d="M5 18V6l7 7 7-7v12" /></Icon> }
function PlusIcon() { return () => <Icon><path d="M12 5v14M5 12h14" /></Icon> }
function ArrowIcon() { return () => <Icon><path d="M5 12h14M13 6l6 6-6 6" /></Icon> }
function MoreIcon() { return () => <Icon><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></Icon> }
function SparkIcon() { return () => <Icon><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1.1 2.9L23 18l-2.9 1.1L19 22l-1.1-2.9L15 18l2.9-1.1L19 14Z" /></Icon> }
