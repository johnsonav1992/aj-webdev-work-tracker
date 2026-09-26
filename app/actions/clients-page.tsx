import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../theme/tokens.ts';
import { WorkspaceLayout } from './workspace/layout.tsx';
import { ClientFilters } from './clients/client-filters.tsx';
import { ClientTable } from './clients/client-table.tsx';
import { ClientsSummary } from './clients/clients-summary.tsx';
import type { ClientsPageData } from './clients/clients-types.ts';

type ClientsPageProps = {
  csrfToken: string;
  data: ClientsPageData;
};

export const ClientsPage = (handle: Handle<ClientsPageProps>) => {
  return () => (
    <WorkspaceLayout
      activePage='clients'
      csrfToken={handle.props.csrfToken}
      pageTitle='Clients'
    >
      <div mix={pageStyle}>
        <h1 mix={headingStyle}>Clients</h1>
        <ClientsSummary metrics={handle.props.data.metrics} />
        <ClientFilters
          filters={handle.props.data.filters}
          statusCounts={handle.props.data.statusCounts}
        />
        <ClientTable
          clients={handle.props.data.clients}
          filters={handle.props.data.filters}
          emptyMessage={
            handle.props.data.metrics.total === 0
              ? 'No clients yet. Clients will appear here when they are added.'
              : 'No matching clients. Change the status or search term and try again.'
          }
        />
      </div>
    </WorkspaceLayout>
  );
};

const pageStyle = css({ paddingTop: `${themeTokens.spacing[8]}` });
const headingStyle = css({
  margin: `${themeTokens.spacing[2]} 0 0`,
  fontSize: 'clamp(27px, 4vw, 35px)',
  lineHeight: 1.15,
  letterSpacing: '-0.045em'
});
