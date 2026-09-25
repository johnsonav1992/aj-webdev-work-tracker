import type { Handle, RemixNode } from 'remix/ui'
import { css } from 'remix/ui'

import { themeTokens } from '../theme/tokens.ts'

type Tone = 'green' | 'amber' | 'blue' | 'gray'

export function StatusBadge(handle: Handle<{ tone?: Tone; children: RemixNode }>) {
  return () => {
    const colors = {
      green: {
        color: `${themeTokens.palette.success.dark}`,
        background: `${themeTokens.palette.success.light}`,
      },
      amber: {
        color: `${themeTokens.palette.warning.dark}`,
        background: `${themeTokens.palette.warning.light}`,
      },
      blue: {
        color: `${themeTokens.palette.info.dark}`,
        background: `${themeTokens.palette.info.light}`,
      },
      gray: {
        color: `${themeTokens.palette.text.secondary}`,
        background: `${themeTokens.palette.background.hover}`,
      },
    }

    return (
      <span
        mix={css({
          display: 'inline-flex',
          alignItems: 'center',
          width: 'fit-content',
          borderRadius: `${themeTokens.shape.pill}`,
          padding: `${themeTokens.spacing[1]} 9px`,
          fontSize: `${themeTokens.typography.size.small}`,
          fontWeight: `${themeTokens.typography.weight.semibold}`,
          lineHeight: 1.4,
          ...colors[handle.props.tone ?? 'gray'],
        })}
      >
        {handle.props.children}
      </span>
    )
  }
}
