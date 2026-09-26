import type { Handle, MixInput, RemixNode } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../theme/tokens.ts';

type CardProps = {
  children?: RemixNode;
  as?: 'article' | 'div' | 'section';
  mix?: MixInput<HTMLElement>;
};

const cardStyle = css({
  background: themeTokens.palette.background.paper,
  border: `1px solid ${themeTokens.palette.divider}`,
  borderRadius: themeTokens.shape.large,
  boxShadow: themeTokens.elevation.low
});

export const Card = (handle: Handle<CardProps>) => {
  return () => {
    const Element = handle.props.as ?? 'div';

    return <Element mix={[cardStyle, handle.props.mix]}>{handle.props.children}</Element>;
  };
};
