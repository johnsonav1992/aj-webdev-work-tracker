import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../../theme/tokens.ts';
import { ArrowIcon } from '../../ui/icons/arrow-icon.tsx';
import { Button } from '../../ui/button.tsx';
import { Card } from '../../ui/card.tsx';
import { SectionHeading } from '../../ui/section-heading.tsx';
import type { HomeDashboardData } from './dashboard-types.ts';
import { ClientRow } from './client-row.tsx';
import { PaymentRow } from './payment-row.tsx';

export type OverviewAsideProps = Pick<HomeDashboardData, 'payments' | 'clients'>;

export const OverviewAside = (handle: Handle<OverviewAsideProps>) => {
  return () => (
    <aside mix={css({ display: 'grid', gap: `${themeTokens.spacing[4]}` })}>
      <Card>
        <div mix={cardPaddingStyle}>
          <SectionHeading
            eyebrow='Transactions'
            title='Recent payments'
            action={
              <Button
                href='#payments'
                variant='quiet'
              >
                See all <ArrowIcon />
              </Button>
            }
          />
          {handle.props.payments.length ? (
            handle.props.payments.map((payment) => (
              <PaymentRow
                key={payment.id}
                {...payment}
              />
            ))
          ) : (
            <p mix={emptyStateStyle}>No payments recorded.</p>
          )}
        </div>
      </Card>
      <Card>
        <div mix={cardPaddingStyle}>
          <SectionHeading
            eyebrow='Directory'
            title='Clients'
            action={
              <Button
                href='#clients'
                variant='quiet'
              >
                All clients <ArrowIcon />
              </Button>
            }
          />
          {handle.props.clients.length ? (
            handle.props.clients.map((client) => (
              <ClientRow
                key={client.id}
                {...client}
              />
            ))
          ) : (
            <p mix={emptyStateStyle}>No clients yet.</p>
          )}
        </div>
      </Card>
    </aside>
  );
};

const cardPaddingStyle = css({ padding: `${themeTokens.spacing[5]}` });

const emptyStateStyle = css({
  margin: 0,
  padding: `${themeTokens.spacing[4]} 0`,
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.small}`
});
