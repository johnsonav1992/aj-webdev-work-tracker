import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '#app/theme/tokens.ts';
import { ArrowIcon } from '#app/ui/icons/arrow-icon.tsx';
import { Button } from '#app/ui/button.tsx';
import { Card } from '#app/ui/card.tsx';
import { SectionHeading } from '#app/ui/section-heading.tsx';
import type { HomeDashboardData } from '#app/actions/home/types/dashboard.ts';
import { ClientRow } from './client-row.tsx';
import { PaymentRow } from './payment-row.tsx';
import { HomeEmptyState } from './empty-state.tsx';

export type OverviewAsideProps = Pick<HomeDashboardData, 'payments' | 'clients'>;

export const OverviewAside = (handle: Handle<OverviewAsideProps>) => {
  return () => (
    <aside mix={css({ display: 'grid', gap: `${themeTokens.spacing[4]}` })}>
      <Card padding='comfortable'>
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
          <HomeEmptyState>No payments recorded.</HomeEmptyState>
        )}
      </Card>
      <Card padding='comfortable'>
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
          <HomeEmptyState>No clients yet.</HomeEmptyState>
        )}
      </Card>
    </aside>
  );
};
