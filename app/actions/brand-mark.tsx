import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../theme/tokens.ts';

type BrandMarkProps = {
  size?: 'small' | 'medium';
};

const sizes = { small: '34px', medium: '42px' } as const;

export const BrandMark = (handle: Handle<BrandMarkProps>) => {
  return () => {
    const size = sizes[handle.props.size ?? 'small'];

    return (
      <img
        src='/aj-web-development-logo.svg'
        alt=''
        aria-hidden='true'
        width={size}
        height={size}
        mix={css({
          display: 'block',
          flex: `0 0 ${size}`,
          width: size,
          height: size,
          objectFit: 'cover',
          borderRadius: `${themeTokens.shape.large}`,
          background: `${themeTokens.palette.background.paper}`,
          border: `1px solid ${themeTokens.palette.divider}`,
          boxShadow: themeTokens.elevation.low
        })}
      />
    );
  };
};
