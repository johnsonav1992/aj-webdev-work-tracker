import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { quietButtonStyle, themeTokens } from '../../theme/tokens.ts';
import { BellIcon } from '../../ui/icons/bell-icon.tsx';

export const Topbar = (handle: Handle<{ csrfToken: string }>) => {
  return () => (
    <header
      mix={css({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: '35px'
      })}
    >
      <div
        mix={css({
          display: 'flex',
          alignItems: 'center',
          gap: `${themeTokens.spacing[2]}`,
          color: `${themeTokens.palette.text.muted}`,
          fontSize: `${themeTokens.typography.size.small}`
        })}
      >
        <span>Workspace</span>
        <span aria-hidden='true'>/</span>
        <strong
          mix={css({
            color: `${themeTokens.palette.text.secondary}`,
            fontWeight: `${themeTokens.typography.weight.semibold}`
          })}
        >
          Overview
        </strong>
      </div>
      <div mix={css({ display: 'flex', alignItems: 'center', gap: `${themeTokens.spacing[3]}` })}>
        <span
          mix={css({
            padding: `${themeTokens.spacing[2]} ${themeTokens.spacing[3]}`,
            border: `1px solid ${themeTokens.palette.divider}`,
            borderRadius: `${themeTokens.shape.small}`,
            background: `${themeTokens.palette.background.paper}`,
            color: `${themeTokens.palette.text.secondary}`,
            fontSize: `${themeTokens.typography.size.caption}`
          })}
        >
          This week
        </span>
        <button
          type='button'
          aria-label='Notifications'
          mix={css({
            width: '34px',
            height: '34px',
            display: 'grid',
            placeItems: 'center',
            border: `1px solid ${themeTokens.palette.divider}`,
            borderRadius: `${themeTokens.shape.medium}`,
            background: `${themeTokens.palette.background.paper}`,
            color: `${themeTokens.palette.text.secondary}`
          })}
        >
          <BellIcon />
        </button>
        <form method='post' action='/logout'>
          <input type='hidden' name='_csrf' value={handle.props.csrfToken} />
          <button type='submit' mix={quietButtonStyle}>
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
};
