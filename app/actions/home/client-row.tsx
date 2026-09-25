import type { Handle } from 'remix/ui'
import { css } from 'remix/ui'

import { themeTokens } from '../../theme/tokens.ts'
import { Avatar } from '../../ui/avatar.tsx'

type Tint = 'green' | 'blue' | 'amber'

export function ClientRow(
  handle: Handle<{ initials: string; name: string; summary: string; rate: string; tint: Tint }>,
) {
  return () => (
    <div
      mix={css({
        display: 'flex',
        alignItems: 'center',
        gap: `${themeTokens.spacing[3]}`,
        padding: `${themeTokens.spacing[3]} 0`,
        borderTop: `1px solid ${themeTokens.palette.divider}`,
      })}
    >
      <Avatar initials={handle.props.initials} tint={handle.props.tint} />
      <div mix={css({ minWidth: 0, flex: 1 })}>
        <strong mix={css({ display: 'block', fontSize: `${themeTokens.typography.size.small}` })}>
          {handle.props.name}
        </strong>
        <span
          mix={css({
            display: 'block',
            marginTop: `${themeTokens.spacing[1]}`,
            color: `${themeTokens.palette.text.muted}`,
            fontSize: `${themeTokens.typography.size.caption}`,
          })}
        >
          {handle.props.summary}
        </span>
      </div>
      <strong
        mix={css({ fontSize: `${themeTokens.typography.size.caption}`, whiteSpace: 'nowrap' })}
      >
        {handle.props.rate}
      </strong>
    </div>
  )
}
