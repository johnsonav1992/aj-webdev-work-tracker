import { Auth } from 'remix/middleware/auth';
import { getCsrfToken } from 'remix/middleware/csrf';
import { createController } from 'remix/router';

import { assets } from '#app/assets.ts';
import { requireAppAuth } from '#app/middleware/auth.server.ts';
import { getDashboardData } from '#app/db/dashboard.ts';
import { getClientDetailData } from '#app/db/client-details.ts';
import { getClientsData } from '#app/db/clients.ts';
import { getProjectDetailData } from '#app/db/project-details.ts';
import { getProjectsData } from '#app/db/projects.ts';
import type {
  ClientSortBy,
  ClientSortDirection,
  ClientStatusFilter
} from '#app/db/types/client.ts';
import { clientSortFields, clientStatusFilters } from '#app/db/types/client.ts';
import { projectStatusFilters, type ProjectStatusFilter } from '#app/db/types/project.ts';
import { routes } from '#app/routes.ts';
import { ClientDetailPage } from './clients/components/client-detail-page.tsx';
import { ClientsPage } from './clients/components/clients-page.tsx';
import { HomePage } from './home/components/home-page.tsx';
import { ProjectDetailPage } from './projects/components/project-detail-page.tsx';
import { ProjectsPage } from './projects/components/projects-page.tsx';

export const rootRoutes = {
  home: routes.home,
  clients: routes.clients,
  client: routes.client,
  projects: routes.projects,
  project: routes.project
};

export const assetRoutes = { assets: routes.assets };

export const assetsController = createController(assetRoutes, {
  actions: {
    assets: async (context) => {
      return (await assets.fetch(context.request)) ?? new Response('Not Found', { status: 404 });
    }
  }
});

export default createController(rootRoutes, {
  middleware: [requireAppAuth],
  actions: {
    home: async (context) => {
      const auth = context.get(Auth);
      const data = await getDashboardData(auth.identity.accountId);

      return context.render(
        <HomePage
          csrfToken={getCsrfToken(context)}
          data={data}
        />
      );
    },
    clients: async (context) => {
      const auth = context.get(Auth);

      const requestedStatus = context.url.searchParams.get('status') ?? 'all';
      const status = clientStatusFilters.includes(requestedStatus as ClientStatusFilter)
        ? (requestedStatus as ClientStatusFilter)
        : 'all';
      const search = context.url.searchParams.get('search') ?? '';
      const requestedSort = context.url.searchParams.get('sort') ?? 'name';
      const sortBy = clientSortFields.includes(requestedSort as ClientSortBy)
        ? (requestedSort as ClientSortBy)
        : 'name';
      const sortDirection: ClientSortDirection =
        context.url.searchParams.get('direction') === 'desc' ? 'desc' : 'asc';
      const data = await getClientsData(auth.identity.accountId, {
        status,
        search,
        sortBy,
        sortDirection
      });

      return context.render(
        <ClientsPage
          csrfToken={getCsrfToken(context)}
          data={data}
        />
      );
    },
    client: async (context) => {
      const auth = context.get(Auth);

      const data = await getClientDetailData(auth.identity.accountId, context.params.clientId);

      return context.render(
        <ClientDetailPage
          csrfToken={getCsrfToken(context)}
          data={data}
        />,
        { status: data ? 200 : 404 }
      );
    },
    projects: async (context) => {
      const auth = context.get(Auth);

      const requestedStatus = context.url.searchParams.get('status') ?? 'all';
      const status = projectStatusFilters.includes(requestedStatus as ProjectStatusFilter)
        ? (requestedStatus as ProjectStatusFilter)
        : 'all';
      const search = context.url.searchParams.get('search') ?? '';
      const data = await getProjectsData(auth.identity.accountId, { status, search });

      return context.render(
        <ProjectsPage
          csrfToken={getCsrfToken(context)}
          data={data}
        />
      );
    },
    project: async (context) => {
      const auth = context.get(Auth);

      const data = await getProjectDetailData(auth.identity.accountId, context.params.projectId);

      return context.render(
        <ProjectDetailPage
          csrfToken={getCsrfToken(context)}
          data={data}
        />,
        { status: data ? 200 : 404 }
      );
    }
  }
});
