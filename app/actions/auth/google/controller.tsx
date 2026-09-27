import { finishExternalAuth, startExternalAuth } from 'remix/auth';
import { createController } from 'remix/router';

import { appOrigin, googleAuthProvider } from '../../../auth/auth.server.ts';
import { createGoogleUser, findGoogleLoginUser } from '../../../db/auth.ts';
import { routes } from '../../../routes.ts';
import { completeSession, redirectTo } from '../controller-utils.ts';

export const googleController = createController(routes.auth.google, {
  actions: {
    start: (context) => {
      if (!googleAuthProvider) return redirectTo(context, '/login?error=google-unavailable');

      return startExternalAuth(googleAuthProvider, context, {
        returnTo: context.url.searchParams.get('returnTo') ?? '/'
      });
    },
    callback: async (context) => {
      if (!googleAuthProvider) return redirectTo(context, '/login?error=google-unavailable');

      let stage = 'provider callback';

      try {
        const { result, returnTo } = await finishExternalAuth(googleAuthProvider, context);
        const { profile } = result;

        stage = 'verified Google profile';

        if (!profile.email || profile.email_verified !== true) {
          return redirectTo(context, '/login?error=google-failed');
        }

        stage = 'find or create account';
        const user =
          (await findGoogleLoginUser(result.account.providerAccountId)) ??
          (await createGoogleUser({
            email: profile.email,
            displayName: profile.name ?? null,
            providerSubject: result.account.providerAccountId
          }));

        stage = 'complete app session';
        completeSession(context, user);
        const target = returnTo ? new URL(returnTo, appOrigin) : null;
        const safeReturnTo =
          target?.origin === appOrigin.origin && target.pathname !== '/signup'
            ? target.pathname
            : '/';

        return redirectTo(context, safeReturnTo);
      } catch (error) {
        const details =
          error instanceof Error
            ? error.message
                .replace(/https?:\/\/\S+/gi, '[url]')
                .replace(
                  /(code|state|client_secret|access_token|id_token)=[^\s&]+/gi,
                  '$1=[redacted]'
                )
                .slice(0, 200)
            : 'unknown error';
        console.error(`[google-auth] Callback failed at ${stage}: ${details}`);

        return redirectTo(context, '/login?error=google-failed');
      }
    }
  }
});
