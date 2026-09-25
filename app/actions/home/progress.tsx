import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../../theme/tokens.ts';

export interface ProgressProps {
  value: number;
}

export const Progress = (handle: Handle<ProgressProps>) => {
  return () => (
    <div
      role='progressbar'
      aria-label='Project progress'
      aria-valuenow={handle.props.value}
      aria-valuemin={0}
      aria-valuemax={100}
      mix={css({
        height: '5px',
        overflow: 'hidden',
        borderRadius: `${themeTokens.shape.pill}`,
        background: `${themeTokens.palette.background.hover}`
      })}
    >
      <span
        style={{ width: `${handle.props.value}%` }}
        mix={css({
          display: 'block',
          height: '100%',
          borderRadius: 'inherit',
          background: `linear-gradient(90deg, ${themeTokens.palette.primary.main}, ${themeTokens.palette.success.main})`
        })}
      />
    </div>
  );
};
