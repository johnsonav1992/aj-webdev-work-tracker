import type { Handle, RemixNode } from 'remix/ui'
import { css } from 'remix/ui'

import { eyebrowStyle, panelStyle } from '../theme/tokens.ts'

export function Panel(handle: Handle<{ children?: RemixNode }>) {
  return () => <section mix={panelStyle}>{handle.props.children}</section>
}

export function SectionHeading(
  handle: Handle<{ eyebrow?: string; title: string; action?: RemixNode }>,
) {
  return () => (
    <div mix={css({ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: '16px', marginBottom: '15px' })}>
      <div>
        {handle.props.eyebrow ? <p mix={[eyebrowStyle, css({ marginBottom: '5px' })]}>{handle.props.eyebrow}</p> : null}
        <h2 mix={css({ margin: 0, fontSize: '17px', lineHeight: 1.3, letterSpacing: '-0.025em' })}>{handle.props.title}</h2>
      </div>
      {handle.props.action}
    </div>
  )
}

export function StatusBadge(handle: Handle<{ tone?: 'green' | 'amber' | 'blue' | 'gray'; children: RemixNode }>) {
  return () => {
    let colors = {
      green: { color: 'var(--green-dark)', background: 'var(--green-soft)' },
      amber: { color: '#88531e', background: 'var(--amber-soft)' },
      blue: { color: '#3f6278', background: 'var(--blue-soft)' },
      gray: { color: 'var(--ink-soft)', background: '#eef1ee' },
    }
    return (
      <span mix={css({ display: 'inline-flex', alignItems: 'center', width: 'fit-content', borderRadius: '999px', padding: '4px 9px', fontSize: '11px', fontWeight: 650, lineHeight: 1.4, ...(colors[handle.props.tone ?? 'gray']) })}>
        {handle.props.children}
      </span>
    )
  }
}

export function Avatar(handle: Handle<{ initials: string; tint?: 'green' | 'blue' | 'amber' }>) {
  return () => {
    let background = { green: '#e2f0e7', blue: '#e5eef3', amber: '#f7eddc' }[handle.props.tint ?? 'green']
    let color = { green: '#286044', blue: '#496d83', amber: '#916128' }[handle.props.tint ?? 'green']
    return <span aria-hidden="true" mix={css({ width: '36px', height: '36px', flex: '0 0 36px', display: 'grid', placeItems: 'center', borderRadius: '10px', background, color, fontSize: '11px', fontWeight: 750 })}>{handle.props.initials}</span>
  }
}
