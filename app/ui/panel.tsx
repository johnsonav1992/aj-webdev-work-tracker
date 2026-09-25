import type { Handle, RemixNode } from 'remix/ui';

import { panelStyle } from '../theme/tokens.ts';

export interface PanelProps {
  children?: RemixNode;
}

export const Panel = (handle: Handle<PanelProps>) => {
  return () => <section mix={panelStyle}>{handle.props.children}</section>;
};
