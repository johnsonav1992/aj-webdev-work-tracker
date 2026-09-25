import type { Handle, RemixNode } from 'remix/ui';
import { css } from 'remix/ui';

import { panelStyle, themeTokens } from '../../theme/tokens.ts';

type Tone = 'green' | 'blue' | 'amber';

export const Metric = (
  handle: Handle<{ label: string; value: string; note: string; icon: RemixNode; tone: Tone }>
) => {
  return () => {
    const iconColor = {
      green: `${themeTokens.palette.success.dark}`,
      blue: `${themeTokens.palette.info.main}`,
      amber: `${themeTokens.palette.warning.main}`
    }[handle.props.tone];
    const iconBackground = {
      green: `${themeTokens.palette.success.light}`,
      blue: `${themeTokens.palette.info.light}`,
      amber: `${themeTokens.palette.warning.light}`
    }[handle.props.tone];

    return (
      <section
        mix={[
          panelStyle,
          css({
            padding: `${themeTokens.spacing[4]}`,
            minWidth: 0,
            '@media (max-width: 480px)': { padding: `${themeTokens.spacing[3]}` }
          })
        ]}
      >
        <div
          mix={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: `${themeTokens.spacing[2]}`,
            marginBottom: `${themeTokens.spacing[3]}`
          })}
        >
          <p
            mix={css({
              margin: 0,
              color: `${themeTokens.palette.text.secondary}`,
              fontSize: `${themeTokens.typography.size.small}`,
              fontWeight: `${themeTokens.typography.weight.semibold}`
            })}
          >
            {handle.props.label}
          </p>
          <span
            mix={css({
              width: '28px',
              height: '28px',
              flex: '0 0 28px',
              display: 'grid',
              placeItems: 'center',
              borderRadius: `${themeTokens.shape.small}`,
              background: iconBackground,
              color: iconColor,
              '@media (max-width: 480px)': { display: 'none' }
            })}
          >
            {handle.props.icon}
          </span>
        </div>
        <p
          mix={css({
            margin: 0,
            fontSize: `${themeTokens.typography.size.metric}`,
            lineHeight: 1.1,
            fontWeight: `${themeTokens.typography.weight.bold}`,
            letterSpacing: '-0.04em',
            fontVariantNumeric: 'tabular-nums',
            '@media (max-width: 480px)': { fontSize: `${themeTokens.typography.size.metricSmall}` }
          })}
        >
          {handle.props.value}
        </p>
        <p
          mix={css({
            margin: `${themeTokens.spacing[2]} 0 0`,
            color: `${themeTokens.palette.text.muted}`,
            fontSize: `${themeTokens.typography.size.caption}`
          })}
        >
          {handle.props.note}
        </p>
      </section>
    );
  };
};
