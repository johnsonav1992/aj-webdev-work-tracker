import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../../theme/tokens.ts';
import { Button } from '../../ui/button.tsx';

export interface WorkspaceTopbarProps {
  csrfToken: string;
  pageTitle: string;
}

export const WorkspaceTopbar = (handle: Handle<WorkspaceTopbarProps>) => {
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
          {handle.props.pageTitle}
        </strong>
      </div>
      <div mix={css({ display: 'flex', alignItems: 'center', gap: `${themeTokens.spacing[3]}` })}>
        <form
          method='post'
          action='/logout'
          data-rmx-document
        >
          <input
            type='hidden'
            name='_csrf'
            value={handle.props.csrfToken}
          />
          <Button
            type='submit'
            variant='quiet'
          >
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
};
