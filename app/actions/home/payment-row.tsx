import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../../theme/tokens.ts';

type Method = 'Bank transfer' | 'Card' | 'Check' | 'Cash' | 'Other';

export function PaymentRow(
  handle: Handle<{ client: string; project: string; date: string; amount: string; method: Method }>
) {
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
}
