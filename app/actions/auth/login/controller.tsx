import { verifyCredentials } from 'remix/auth';
import { Auth } from 'remix/middleware/auth';
import { getCsrfToken } from 'remix/middleware/csrf';
import { createController } from 'remix/router';

import { googleAuthProvider, passwordAuthProvider } from '#app/auth/auth.server.ts';
import { routes } from '#app/routes.ts';
import { LoginPage } from '#app/actions/auth/components/login-page.tsx';
import { completeSession, redirectTo } from '#app/actions/auth/utils/controller-utils.ts';

const loginError = (
  value: string | null
): 'invalid-credentials' | 'google-unavailable' | 'google-failed' | undefined =>
  value === 'invalid-credentials' || value === 'google-unavailable' || value === 'google-failed'
    ? value
    : undefined;

export const loginController = createController(routes.auth.login, {
  actions: {
    index: (context) => {
      if (context.get(Auth).ok) return redirectTo(context, '/');

      return context.render(
        <LoginPage
          csrfToken={getCsrfToken(context)}
          googleEnabled={googleAuthProvider !== null}
          error={loginError(context.url.searchParams.get('error'))}
        />
      );
    },
    action: async (context) => {
      const user = await verifyCredentials(passwordAuthProvider, context);

      if (!user) return redirectTo(context, '/login?error=invalid-credentials');

      completeSession(context, user);

      return redirectTo(context, '/');
    }
  }
});
