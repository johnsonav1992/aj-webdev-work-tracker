import type { Handle, RemixNode } from 'remix/ui';

import { panelStyle } from '../theme/tokens.ts';

export const Panel = (handle: Handle<{ children?: RemixNode }>) => {
  return () => <section mix={panelStyle}>{handle.props.children}</section>;
};
