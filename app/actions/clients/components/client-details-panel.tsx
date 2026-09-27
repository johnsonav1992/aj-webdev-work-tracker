import type { Handle, RemixNode } from 'remix/ui';
import { css } from 'remix/ui';

import { formatCurrency } from '#app/utils/format-currency.ts';
import { formatStatusLabel } from '#app/utils/format-status-label.ts';
import { themeTokens } from '#app/theme/tokens.ts';
import { Card } from '#app/ui/card.tsx';
import { SectionHeading } from '#app/ui/section-heading.tsx';
import { StatusBadge } from '#app/ui/status-badge.tsx';
import type { ClientDetailData } from '#app/actions/clients/types/client-detail.ts';

type ClientDetailsPanelProps = {
  client: ClientDetailData['client'];
};

export const ClientDetailsPanel = (handle: Handle<ClientDetailsPanelProps>) => {
  return () => (
    <Card
      as='section'
      padding='comfortable'
    >
      <SectionHeading title='Client details' />
      <div mix={statusStyle}>
        <span mix={labelStyle}>Status</span>
        <StatusBadge tone={handle.props.client.status === 'active' ? 'green' : 'gray'}>
          {formatStatusLabel(handle.props.client.status)}
        </StatusBadge>
      </div>
      {handle.props.client.contactName ? (
        <DetailRow label='Contact'>{handle.props.client.contactName}</DetailRow>
      ) : null}
      {handle.props.client.email ? (
        <DetailRow label='Email'>
          <a href={`mailto:${handle.props.client.email}`}>{handle.props.client.email}</a>
        </DetailRow>
      ) : null}
      {handle.props.client.phone ? (
        <DetailRow label='Phone'>
          <a href={`tel:${handle.props.client.phone}`}>{handle.props.client.phone}</a>
        </DetailRow>
      ) : null}
      <DetailRow label='Hourly rate'>
        {handle.props.client.hourlyRateMinor === null
          ? 'Not set'
          : `${formatCurrency(handle.props.client.hourlyRateMinor, handle.props.client.currency)} / hour`}
      </DetailRow>
      {handle.props.client.notes ? (
        <div mix={notesStyle}>
          <span mix={labelStyle}>Notes</span>
          <p>{handle.props.client.notes}</p>
        </div>
      ) : null}
    </Card>
  );
};

type DetailRowProps = {
  label: string;
  children: RemixNode;
};

const DetailRow = (handle: Handle<DetailRowProps>) => {
  return () => (
    <div mix={detailRowStyle}>
      <span mix={labelStyle}>{handle.props.label}</span>
      <div mix={valueStyle}>{handle.props.children}</div>
    </div>
  );
};

const detailRowStyle = css({
  display: 'grid',
  gridTemplateColumns: '100px minmax(0, 1fr)',
  gap: `${themeTokens.spacing[3]}`,
  padding: `${themeTokens.spacing[3]} 0`,
  borderTop: `1px solid ${themeTokens.palette.divider}`,
  '& a': { color: `${themeTokens.palette.primary.main}`, overflowWrap: 'anywhere' }
});
const statusStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `0 0 ${themeTokens.spacing[3]}`
});
const labelStyle = css({
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.caption}`
});
const valueStyle = css({
  color: `${themeTokens.palette.text.primary}`,
  fontSize: `${themeTokens.typography.size.small}`,
  overflowWrap: 'anywhere'
});
const notesStyle = css({
  display: 'grid',
  gap: `${themeTokens.spacing[2]}`,
  marginTop: `${themeTokens.spacing[3]}`,
  paddingTop: `${themeTokens.spacing[3]}`,
  borderTop: `1px solid ${themeTokens.palette.divider}`,
  '& p': { margin: 0, whiteSpace: 'pre-wrap', fontSize: `${themeTokens.typography.size.small}` }
});
