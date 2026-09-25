import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { panelStyle, themeTokens } from '../../theme/tokens.ts';
import { ArrowIcon } from '../../ui/icons/arrow-icon.tsx';
import { PlusIcon } from '../../ui/icons/plus-icon.tsx';
import { SparkIcon } from '../../ui/icons/spark-icon.tsx';
import { Button } from '../../ui/button.tsx';
import { Panel } from '../../ui/panel.tsx';
import { SectionHeading } from '../../ui/section-heading.tsx';
import type { HomeDashboardData } from './dashboard-types.ts';
import { ClientRow } from './client-row.tsx';
import { PaymentRow } from './payment-row.tsx';

export type OverviewAsideProps = Pick<HomeDashboardData, 'payments' | 'clients'>;

export const OverviewAside = (handle: Handle<OverviewAsideProps>) => {
  return () => (
    <aside mix={css({ display: 'grid', gap: `${themeTokens.spacing[4]}` })}>
      <Panel>
        <div mix={cardPaddingStyle}>
          <SectionHeading
            eyebrow='Money received'
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
            <p mix={emptyStateStyle}>Payment records will appear after Stripe is connected.</p>
          )}
          <Button
            href='#payments/new'
            variant='quiet'
            mix={addPaymentStyle}
          >
            <PlusIcon /> Record a payment
          </Button>
        </div>
      </Panel>

      <Panel>
        <div mix={cardPaddingStyle}>
          <SectionHeading
            eyebrow='Good relationships'
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
            <p mix={emptyStateStyle}>Clients you add will appear here.</p>
          )}
        </div>
      </Panel>

      <div
        mix={[
          panelStyle,
          css({
            padding: `${themeTokens.spacing[4]}`,
            display: 'flex',
            alignItems: 'start',
            gap: `${themeTokens.spacing[3]}`,
            background: `linear-gradient(135deg, ${themeTokens.palette.success.light}, ${themeTokens.palette.background.paper})`
          })
        ]}
      >
        <span
          mix={css({
            width: '34px',
            height: '34px',
            display: 'grid',
            placeItems: 'center',
            flex: '0 0 34px',
            borderRadius: `${themeTokens.shape.medium}`,
            background: `${themeTokens.palette.success.light}`,
            color: `${themeTokens.palette.success.main}`
          })}
        >
          <SparkIcon />
        </span>
        <div>
          <p
            mix={css({
              margin: `0 0 ${themeTokens.spacing[1]}`,
              fontSize: `${themeTokens.typography.size.small}`,
              fontWeight: `${themeTokens.typography.weight.bold}`
            })}
          >
            A small win adds up
          </p>
          <p
            mix={css({
              margin: 0,
              color: `${themeTokens.palette.text.secondary}`,
              fontSize: `${themeTokens.typography.size.caption}`,
              lineHeight: 1.55
            })}
          >
            The project totals above use recorded time and the client rates saved with each entry.
          </p>
        </div>
      </div>
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

const addPaymentStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: `${themeTokens.spacing[2]}`,
  width: '100%',
  marginTop: `${themeTokens.spacing[3]}`,
  padding: `${themeTokens.spacing[3]}`,
  border: `1px dashed ${themeTokens.palette.dividerStrong}`,
  borderRadius: `${themeTokens.shape.small}`,
  background: 'transparent',
  color: `${themeTokens.palette.success.dark}`,
  fontSize: `${themeTokens.typography.size.small}`,
  fontWeight: `${themeTokens.typography.weight.semibold}`,
  textDecoration: 'none'
});
