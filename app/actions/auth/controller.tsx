import { createController } from 'remix/router';
import { Session } from 'remix/session';

import { requireAppAuth } from '../../auth/require-app-auth.ts';
import { routes } from '../../routes.ts';
import { redirectTo } from './controller-utils.ts';

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
