import { Auth } from 'remix/middleware/auth';
import { getCsrfToken } from 'remix/middleware/csrf';
import { createController } from 'remix/router';

import { assets } from '../assets.ts';
import { getDashboardData } from '../db/dashboard.ts';
import { getClientDetailData } from '../db/client-details.ts';
import {
  getClientsData,
  type ClientSortBy,
  type ClientSortDirection,
  type ClientStatusFilter
} from '../db/clients.ts';
import { getProjectDetailData } from '../db/project-details.ts';
import { getProjectsData, type ProjectStatusFilter } from '../db/projects.ts';
import { routes } from '../routes.ts';
import { ClientDetailPage } from './clients/client-detail-page.tsx';
import { ClientsPage } from './clients-page.tsx';
import { HomePage } from './home-page.tsx';
import { ProjectDetailPage } from './projects/project-detail-page.tsx';
import { ProjectsPage } from './projects-page.tsx';

export const rootRoutes = {
  assets: routes.assets,
  home: routes.home,
  clients: routes.clients,
  client: routes.client,
  projects: routes.projects,
  project: routes.project
};

const projectStatuses: ProjectStatusFilter[] = [
  'all',
  'planned',
  'active',
  'completed',
  'archived'
];
const clientStatuses: ClientStatusFilter[] = ['all', 'active', 'archived'];
const clientSortFields: ClientSortBy[] = ['name', 'projects', 'tracked'];

const redirectTo = (context: { url: URL }, path: string) =>
  Response.redirect(new URL(path, context.url), 303);

export default createController(rootRoutes, {
  actions: {
    assets: async (context) => {
      return (await assets.fetch(context.request)) ?? new Response('Not Found', { status: 404 });
    },
    home: async (context) => {
      const auth = context.get(Auth);

      if (!auth.ok) return redirectTo(context, '/login');

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

      if (!auth.ok) return redirectTo(context, '/login');

      const requestedStatus = context.url.searchParams.get('status') ?? 'all';
      const status = clientStatuses.includes(requestedStatus as ClientStatusFilter)
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

      if (!auth.ok) return redirectTo(context, '/login');

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

      if (!auth.ok) return redirectTo(context, '/login');

      const requestedStatus = context.url.searchParams.get('status') ?? 'all';
      const status = projectStatuses.includes(requestedStatus as ProjectStatusFilter)
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

      if (!auth.ok) return redirectTo(context, '/login');

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
