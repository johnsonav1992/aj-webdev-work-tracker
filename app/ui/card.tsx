import type { Handle, MixInput, RemixNode } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '#app/theme/tokens.ts';

type CardProps = {
  children?: RemixNode;
  as?: 'article' | 'div' | 'section';
  mix?: MixInput<HTMLElement>;
  padding?: 'none' | 'compact' | 'comfortable';
};

export const Card = (handle: Handle<CardProps>) => {
  return () => {
    const Element = handle.props.as ?? 'div';

    return (
      <Element mix={[cardStyle, paddingStyles[handle.props.padding ?? 'none'], handle.props.mix]}>
        {handle.props.children}
      </Element>
    );
  };
};

const cardStyle = css({
  background: themeTokens.palette.background.paper,
  border: `1px solid ${themeTokens.palette.divider}`,
  borderRadius: themeTokens.shape.large,
  boxShadow: themeTokens.elevation.low
});
const paddingStyles = {
  none: undefined,
  compact: css({ padding: `${themeTokens.spacing[4]}` }),
  comfortable: css({ padding: `${themeTokens.spacing[5]}` })
};
