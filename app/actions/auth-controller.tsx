import { finishExternalAuth, startExternalAuth, verifyCredentials } from 'remix/auth';
import { Auth } from 'remix/middleware/auth';
import { getCsrfToken } from 'remix/middleware/csrf';
import { createController } from 'remix/router';
import { Session } from 'remix/session';

import {
  appOrigin,
  completeAuth,
  googleAuthProvider,
  passwordAuthProvider
} from '../auth/auth.server.ts';
import { createGoogleUser, findGoogleLoginUser } from '../db/auth.ts';
import { routes } from '../routes.ts';
import type { AppContext } from '../router.ts';
import { LoginPage } from './auth/login-page.tsx';
import { SignupPage } from './auth/signup-page.tsx';

const redirectTo = (context: { url: URL }, path: string) =>
  Response.redirect(new URL(path, context.url), 303);

const loginError = (
  value: string | null
): 'invalid-credentials' | 'google-unavailable' | 'google-failed' | undefined =>
  value === 'invalid-credentials' || value === 'google-unavailable' || value === 'google-failed'
    ? value
    : undefined;

const completeSession = (
  context: Parameters<typeof completeAuth>[0],
  user: { id: string; accountId: string }
) => {
  const session = completeAuth(context);
  session.set('auth', { userId: user.id, accountId: user.accountId });
};

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

export const signupController = createController(routes.auth.signup, {
  actions: {
    index: (context) => {
      if (context.get(Auth).ok) return redirectTo(context, '/');
      return context.render(
        <SignupPage
          googleEnabled={googleAuthProvider !== null}
        />
      );
    },
    action: (context) => redirectTo(context, '/signup')
  }
});

export const logoutAction = (context: AppContext) => {
  const session = context.get(Session);
  session.unset('auth');
  session.regenerateId(true);
  return redirectTo(context, '/login');
};

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
                .replace(/(code|state|client_secret|access_token|id_token)=[^\s&]+/gi, '$1=[redacted]')
                .slice(0, 200)
            : 'unknown error';
        console.error(`[google-auth] Callback failed at ${stage}: ${details}`);
        return redirectTo(context, '/login?error=google-failed');
      }
    }
  }
});
