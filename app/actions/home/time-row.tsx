import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../../theme/tokens.ts';
import { ClockIcon } from '../../ui/icons/clock-icon.tsx';

type Tint = 'green' | 'blue' | 'amber';

export const TimeRow = (
  handle: Handle<{ title: string; client: string; date: string; duration: string; tint: Tint }>
) => {
  return () => {
    const background = {
      green: `${themeTokens.palette.success.light}`,
      blue: `${themeTokens.palette.info.light}`,
      amber: `${themeTokens.palette.warning.light}`
    }[handle.props.tint];
    const color = {
      green: `${themeTokens.palette.success.dark}`,
      blue: `${themeTokens.palette.info.main}`,
      amber: `${themeTokens.palette.warning.main}`
    }[handle.props.tint];

    return (
      <div
        mix={css({
          display: 'flex',
          alignItems: 'center',
          gap: `${themeTokens.spacing[3]}`,
          padding: `${themeTokens.spacing[3]} 0`,
          borderTop: `1px solid ${themeTokens.palette.divider}`
        })}
      >
        <span
          mix={css({
            display: 'grid',
            placeItems: 'center',
            width: '32px',
            height: '32px',
            flex: '0 0 32px',
            borderRadius: `${themeTokens.shape.medium}`,
            background,
            color
          })}
        >
          <ClockIcon />
        </span>
        <div mix={css({ minWidth: 0, flex: 1 })}>
          <strong
            mix={css({
              display: 'block',
              overflow: 'hidden',
              fontSize: `${themeTokens.typography.size.small}`,
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            })}
          >
            {handle.props.title}
          </strong>
          <p
            mix={css({
              overflow: 'hidden',
              margin: `${themeTokens.spacing[1]} 0 0`,
              color: `${themeTokens.palette.text.muted}`,
              fontSize: `${themeTokens.typography.size.caption}`,
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            })}
          >
            {handle.props.client} <span aria-hidden='true'>·</span> {handle.props.date}
          </p>
        </div>
        <strong
          mix={css({
            fontSize: `${themeTokens.typography.size.small}`,
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap'
          })}
        >
          {handle.props.duration}
        </strong>
      </div>
    );
  };
};
