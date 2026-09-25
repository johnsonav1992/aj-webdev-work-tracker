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
import {
  createGoogleUserFromInvitation,
  createInvitedUser,
  findGoogleLoginUser,
  findValidInvitation
} from '../db/auth.ts';
import { routes } from '../routes.ts';
import type { AppContext } from '../router.ts';
import { LoginPage } from './auth/login-page.tsx';
import { SignupPage } from './auth/signup-page.tsx';

const redirectTo = (context: { url: URL }, path: string) =>
  Response.redirect(new URL(path, context.url), 303);

const hasValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const loginError = (
  value: string | null
): 'invalid-credentials' | 'google-unavailable' | 'google-failed' | undefined =>
  value === 'invalid-credentials' || value === 'google-unavailable' || value === 'google-failed'
    ? value
    : undefined;

const signupError = (
  value: string | null
): 'invalid-invitation' | 'password-too-short' | 'invalid-email' | undefined =>
  value === 'invalid-invitation' || value === 'password-too-short' || value === 'invalid-email'
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
    index: async (context) => {
      if (context.get(Auth).ok) return redirectTo(context, '/');
      const token = context.url.searchParams.get('token') ?? '';
      const invitation = token ? await findValidInvitation(token) : null;
      return context.render(
        <SignupPage
          csrfToken={getCsrfToken(context)}
          token={token}
          invitedEmail={invitation?.email ?? ''}
          invitationValid={invitation !== null}
          googleEnabled={googleAuthProvider !== null}
          error={signupError(context.url.searchParams.get('error'))}
        />
      );
    },
    action: async (context) => {
      const data = context.get(FormData) ?? new FormData();
      const token = String(data.get('token') ?? '');
      const email = String(data.get('email') ?? '').trim();
      const displayName = String(data.get('displayName') ?? '').trim();
      const password = String(data.get('password') ?? '');

      if (!hasValidEmail(email)) {
        return redirectTo(
          context,
          `/signup?token=${encodeURIComponent(token)}&error=invalid-email`
        );
      }

      if (password.length < 12 || Buffer.byteLength(password, 'utf8') > 1024) {
        return redirectTo(
          context,
          `/signup?token=${encodeURIComponent(token)}&error=password-too-short`
        );
      }

      if (!displayName || displayName.length > 160) {
        return redirectTo(
          context,
          `/signup?token=${encodeURIComponent(token)}&error=invalid-invitation`
        );
      }

      try {
        const user = await createInvitedUser({ token, email, displayName, password });
        completeSession(context, user);
        return redirectTo(context, '/');
      } catch {
        return redirectTo(
          context,
          `/signup?token=${encodeURIComponent(token)}&error=invalid-invitation`
        );
      }
    }
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
        returnTo: context.url.searchParams.get('returnTo') ?? '/login'
      });
    },
    callback: async (context) => {
      if (!googleAuthProvider) return redirectTo(context, '/login?error=google-unavailable');

      try {
        const { result, returnTo } = await finishExternalAuth(googleAuthProvider, context);
        const { profile } = result;

        if (!profile.email || profile.email_verified !== true) {
          return redirectTo(context, '/login?error=google-failed');
        }

        let user = await findGoogleLoginUser(result.account.providerAccountId);

        if (!user) {
          const redirectTarget = returnTo ? new URL(returnTo, appOrigin) : null;
          const token =
            redirectTarget?.pathname === '/signup'
              ? redirectTarget.searchParams.get('token')
              : null;
          if (!token) return redirectTo(context, '/signup?error=invalid-invitation');

          user = await createGoogleUserFromInvitation({
            token,
            email: profile.email,
            displayName: profile.name ?? null,
            providerSubject: result.account.providerAccountId
          });
        }

        completeSession(context, user);
        const target = returnTo ? new URL(returnTo, appOrigin) : null;
        const safeReturnTo =
          target?.origin === appOrigin.origin && target.pathname !== '/signup'
            ? target.pathname
            : '/';
        return redirectTo(context, safeReturnTo);
      } catch {
        return redirectTo(context, '/login?error=google-failed');
      }
    }
  }
});
