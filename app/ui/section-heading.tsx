import type { Handle, RemixNode } from 'remix/ui';
import { css } from 'remix/ui';

import { eyebrowStyle, themeTokens } from '../theme/tokens.ts';

export const SectionHeading = (
  handle: Handle<{ eyebrow?: string; title: string; action?: RemixNode }>
) => {
  return () => (
    <div
      mix={css({
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'space-between',
        gap: `${themeTokens.spacing[4]}`,
        marginBottom: '15px'
      })}
    >
      <div>
        {handle.props.eyebrow ? (
          <p mix={[eyebrowStyle, css({ marginBottom: '5px' })]}>{handle.props.eyebrow}</p>
        ) : null}
        <h2
          mix={css({
            margin: 0,
            fontSize: `${themeTokens.typography.size.section}`,
            lineHeight: 1.3,
            letterSpacing: '-0.025em'
          })}
        >
          {handle.props.title}
        </h2>
      </div>
      {handle.props.action}
    </div>
  );
};
