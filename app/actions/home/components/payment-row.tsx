import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '#app/theme/tokens.ts';

export interface PaymentRowProps {
  client: string;
  project: string;
  date: string;
  amount: string;
  method: string;
}

export const PaymentRow = (handle: Handle<PaymentRowProps>) => {
  return () => (
    <div
      mix={css({
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        gap: `${themeTokens.spacing[2]}`,
        padding: `${themeTokens.spacing[3]} 0`,
        borderTop: `1px solid ${themeTokens.palette.divider}`
      })}
    >
      <div mix={css({ minWidth: 0 })}>
        <strong mix={css({ display: 'block', fontSize: `${themeTokens.typography.size.small}` })}>
          {handle.props.client}
        </strong>
        <span
          mix={css({
            display: 'block',
            marginTop: `${themeTokens.spacing[1]}`,
            color: `${themeTokens.palette.text.muted}`,
            fontSize: `${themeTokens.typography.size.caption}`
          })}
        >
          {handle.props.project} · {handle.props.date} · {handle.props.method}
        </span>
      </div>
      <strong mix={css({ fontSize: `${themeTokens.typography.size.small}`, whiteSpace: 'nowrap' })}>
        {handle.props.amount}
      </strong>
    </div>
  );
};
