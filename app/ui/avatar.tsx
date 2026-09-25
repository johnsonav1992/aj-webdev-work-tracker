import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../theme/tokens.ts';
import type { AccentTone } from '../theme/accent-tone.ts';

export interface AvatarProps {
  initials: string;
  tint?: AccentTone;
}

export const Avatar = (handle: Handle<AvatarProps>) => {
  return () => {
    const tint = handle.props.tint ?? 'green';
    const background = {
      green: `${themeTokens.palette.success.light}`,
      blue: `${themeTokens.palette.info.light}`,
      amber: `${themeTokens.palette.warning.light}`
    }[tint];
    const color = {
      green: `${themeTokens.palette.success.dark}`,
      blue: `${themeTokens.palette.info.dark}`,
      amber: `${themeTokens.palette.warning.dark}`
    }[tint];

    return (
      <span
        aria-hidden='true'
        mix={css({
          width: '36px',
          height: '36px',
          flex: '0 0 36px',
          display: 'grid',
          placeItems: 'center',
          borderRadius: `${themeTokens.shape.medium}`,
          background,
          color,
          fontSize: `${themeTokens.typography.size.small}`,
          fontWeight: `${themeTokens.typography.weight.bold}`
        })}
      >
        {handle.props.initials}
      </span>
    );
  };
};
