import type { Handle, RemixNode } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '#app/theme/tokens.ts';

type HomeEmptyStateProps = {
  children: RemixNode;
};

export const HomeEmptyState = (handle: Handle<HomeEmptyStateProps>) => {
  return () => <p mix={emptyStateStyle}>{handle.props.children}</p>;
};

const emptyStateStyle = css({
  margin: 0,
  padding: `${themeTokens.spacing[4]} 0`,
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.small}`
});
