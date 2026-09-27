import { createController } from 'remix/router';
import { Session } from 'remix/session';

import { requireAppAuth } from '#app/middleware/auth.server.ts';
import { routes } from '#app/routes.ts';
import { redirectTo } from './utils/controller-utils.ts';

export const logoutRoutes = { logout: routes.auth.logout };

export const logoutController = createController(logoutRoutes, {
  middleware: [requireAppAuth],
  actions: {
    logout: (context) => {
      const session = context.get(Session);
      session.unset('auth');
      session.regenerateId(true);

      return redirectTo(context, '/login');
    }
  }
});
