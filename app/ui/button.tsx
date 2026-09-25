import type { Handle, MixInput, RemixNode } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../theme/tokens.ts';

export interface ButtonProps {
  children: RemixNode;
  variant?: 'primary' | 'quiet';
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  'aria-label'?: string;
  'data-rmx-document'?: boolean;
  mix?: MixInput<HTMLElement>;
}

const variants = {
  quiet: css({
    appearance: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: `${themeTokens.spacing[2]}`,
    minHeight: '38px',
    padding: `${themeTokens.spacing[2]} ${themeTokens.spacing[3]}`,
    border: `1px solid ${themeTokens.palette.divider}`,
    borderRadius: `${themeTokens.shape.small}`,
    background: `${themeTokens.palette.background.paper}`,
    color: `${themeTokens.palette.text.primary}`,
    fontWeight: `${themeTokens.typography.weight.semibold}`,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background 140ms ease, border-color 140ms ease',
    '&:hover': {
      background: `${themeTokens.palette.background.subtle}`,
      borderColor: `${themeTokens.palette.dividerStrong}`
    }
  }),
  primary: css({
    appearance: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: `${themeTokens.spacing[2]}`,
    minHeight: '40px',
    padding: '9px 14px',
    border: `1px solid ${themeTokens.palette.primary.main}`,
    borderRadius: `${themeTokens.shape.small}`,
    background: `${themeTokens.palette.primary.main}`,
    color: `${themeTokens.palette.primary.contrastText}`,
    fontWeight: `${themeTokens.typography.weight.semibold}`,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background 140ms ease, border-color 140ms ease, transform 140ms ease',
    '&:hover': {
      background: `${themeTokens.palette.primary.dark}`,
      borderColor: `${themeTokens.palette.primary.dark}`
    },
    '&:active': { transform: 'translateY(1px)' }
  })
};

export const Button = (handle: Handle<ButtonProps>) => {
  return () => {
    const mix = [variants[handle.props.variant ?? 'quiet'], handle.props.mix];
    const sharedProps = {
      'aria-label': handle.props['aria-label'],
      disabled: handle.props.disabled,
      mix
    };

    return handle.props.href ? (
      <a
        href={handle.props.href}
        data-rmx-document={handle.props['data-rmx-document']}
        {...sharedProps}
      >
        {handle.props.children}
      </a>
    ) : (
      <button
        type={handle.props.type ?? 'button'}
        {...sharedProps}
      >
        {handle.props.children}
      </button>
    );
  };
};
