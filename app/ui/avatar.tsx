import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../theme/tokens.ts';

type Tint = 'green' | 'blue' | 'amber';

export const Avatar = (handle: Handle<{ initials: string; tint?: Tint }>) => {
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
          fontWeight: 750
        })}
      >
        {handle.props.initials}
      </span>
    );
  };
};
