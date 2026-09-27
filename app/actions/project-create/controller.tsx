import { getCsrfToken } from 'remix/middleware/csrf';
import { createController } from 'remix/router';

import { Auth } from 'remix/middleware/auth';
import { requireAppAuth } from '../../auth/require-app-auth.ts';
import { createActiveProject, getActiveClientsForProjectForm } from '../../db/projects.ts';
import { routes } from '../../routes.ts';
import { ProjectCreatePage } from '../projects/project-create-page.tsx';

const redirectWithError = (context: { url: URL }, error: 'invalid' | 'client') =>
  Response.redirect(
    new URL(`${routes.projectCreate.index.href()}?error=${error}`, context.url),
    303
  );

export const projectCreateController = createController(routes.projectCreate, {
  middleware: [requireAppAuth],
  actions: {
    index: async (context) => {
      const auth = context.get(Auth);

      const clients = await getActiveClientsForProjectForm(auth.identity.accountId);
      const requestedError = context.url.searchParams.get('error');
      const error =
        requestedError === 'invalid' || requestedError === 'client' ? requestedError : null;

      return context.render(
        <ProjectCreatePage
          csrfToken={getCsrfToken(context)}
          clients={clients}
          error={error}
        />
      );
    },
    action: async (context) => {
      const auth = context.get(Auth);

      const formData = context.get(FormData) ?? new FormData();
      const clientId = String(formData.get('clientId') ?? '').trim();
      const name = String(formData.get('name') ?? '').trim();
      const description = String(formData.get('description') ?? '').slice(0, 4000);

      if (!name || name.length > 200) return redirectWithError(context, 'invalid');

      const projectId = await createActiveProject(auth.identity.accountId, {
        clientId,
        name,
        description
      });

      if (!projectId) return redirectWithError(context, 'client');

      return Response.redirect(new URL(routes.project.href({ projectId }), context.url), 303);
    }
  }
});
