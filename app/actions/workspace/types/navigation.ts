import type { RemixNode } from 'remix/ui';

export type NavItem = {
  label: string;
  href: string;
  icon: RemixNode;
  active?: boolean;
};
