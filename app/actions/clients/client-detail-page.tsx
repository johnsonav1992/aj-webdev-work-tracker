import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../../theme/tokens.ts';
import { Button } from '../../ui/button.tsx';
import { StatusBadge } from '../../ui/status-badge.tsx';
import { routes } from '../../routes.ts';
import { WorkspaceLayout } from '../workspace/layout.tsx';
import { ClientDetailsPanel } from './client-details-panel.tsx';
import type { ClientDetailData } from './client-detail-types.ts';
import { ClientSummary } from './client-summary.tsx';
import { ClientWork } from './client-work.tsx';

type ClientDetailPageProps = {
  csrfToken: string;
  data: ClientDetailData | null;
};

export const ClientDetailPage = (handle: Handle<ClientDetailPageProps>) => {
  return () => {
    const data = handle.props.data;

    return (
      <WorkspaceLayout
        activePage='clients'
        csrfToken={handle.props.csrfToken}
        pageTitle={data?.client.name ?? 'Client'}
      >
        <div mix={pageStyle}>
          <Button
            href={routes.clients.href()}
            variant='quiet'
            mix={backButtonStyle}
          >
            ← All clients
          </Button>
          {data ? (
            <>
              <header mix={headingStyle}>
                <div>
                  <h1 mix={titleStyle}>{data.client.name}</h1>
                  {data.client.contactName ? (
                    <p mix={contactNameStyle}>{data.client.contactName}</p>
                  ) : null}
                </div>
                <StatusBadge tone={data.client.status === 'active' ? 'green' : 'gray'}>
                  {data.client.status[0]!.toUpperCase() + data.client.status.slice(1)}
                </StatusBadge>
              </header>
              <ClientSummary summary={data.summary} />
              <div mix={contentGridStyle}>
                <ClientWork
                  payments={data.payments}
                  projects={data.projects}
                />
                <ClientDetailsPanel client={data.client} />
              </div>
            </>
          ) : (
            <section mix={notFoundStyle}>
              <h1 mix={notFoundTitleStyle}>Client not found</h1>
              <p mix={notFoundTextStyle}>
                This client may have been removed or you may not have access.
              </p>
            </section>
          )}
        </div>
      </WorkspaceLayout>
    );
  };
};

const pageStyle = css({ paddingTop: `${themeTokens.spacing[5]}` });
const backButtonStyle = css({ marginBottom: `${themeTokens.spacing[5]}` });
const headingStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: `${themeTokens.spacing[4]}`
});
const titleStyle = css({
  margin: 0,
  fontSize: 'clamp(27px, 4vw, 35px)',
  lineHeight: 1.15,
  letterSpacing: '-0.045em',
  overflowWrap: 'anywhere'
});
const contactNameStyle = css({
  margin: `${themeTokens.spacing[1]} 0 0`,
  color: `${themeTokens.palette.text.muted}`,
  fontSize: `${themeTokens.typography.size.small}`
});
const contentGridStyle = css({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.5fr) minmax(280px, 0.85fr)',
  alignItems: 'start',
  gap: `${themeTokens.spacing[4]}`,
  marginTop: `${themeTokens.spacing[4]}`,
  '@media (max-width: 900px)': { gridTemplateColumns: '1fr' }
});
const notFoundStyle = css({
  marginTop: `${themeTokens.spacing[4]}`,
  padding: `${themeTokens.spacing[6]}`,
  border: `1px solid ${themeTokens.palette.divider}`,
  borderRadius: `${themeTokens.shape.large}`,
  background: `${themeTokens.palette.background.paper}`
});
const notFoundTitleStyle = css({ margin: 0, fontSize: `${themeTokens.typography.size.section}` });
const notFoundTextStyle = css({
  margin: `${themeTokens.spacing[2]} 0 0`,
  color: `${themeTokens.palette.text.secondary}`,
  fontSize: `${themeTokens.typography.size.small}`
});
