import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '#app/theme/tokens.ts';

type ProgressBarProps = {
  label: string;
  value: number;
  variant?: 'solid' | 'gradient';
};

export const ProgressBar = (handle: Handle<ProgressBarProps>) => {
  return () => (
    <div
      role='progressbar'
      aria-label={handle.props.label}
      aria-valuenow={Math.round(handle.props.value)}
      aria-valuemin={0}
      aria-valuemax={100}
      mix={trackStyle}
    >
      <span
        style={{ width: `${handle.props.value}%` }}
        mix={fillStyle(handle.props.variant ?? 'solid')}
      />
    </div>
  );
};

const trackStyle = css({
  display: 'block',
  overflow: 'hidden',
  height: '5px',
  borderRadius: `${themeTokens.shape.pill}`,
  background: `${themeTokens.palette.background.hover}`
});
const fillStyle = (variant: 'solid' | 'gradient') =>
  css({
    display: 'block',
    height: '100%',
    borderRadius: 'inherit',
    background:
      variant === 'gradient'
        ? `linear-gradient(90deg, ${themeTokens.palette.primary.main}, ${themeTokens.palette.success.main})`
        : `${themeTokens.palette.primary.main}`
  });
