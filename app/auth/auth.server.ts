import { completeAuth, createCredentialsAuthProvider, createGoogleAuthProvider } from 'remix/auth';
import { createCookie } from 'remix/cookie';
import { csrf } from 'remix/middleware/csrf';
import { auth, createSessionAuthScheme } from 'remix/middleware/auth';
import { formData } from 'remix/middleware/form-data';
import { session } from 'remix/middleware/session';
import { createCookieSessionStorage } from 'remix/session-storage/cookie';

import { findAuthenticatedUser, findLoginUser, type AuthenticatedUser } from '../db/auth.ts';

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret && process.env.NODE_ENV === 'production') {
  throw new Error('SESSION_SECRET must be configured in production.');
}

export const sessionCookie = createCookie('__aj_workbench_session', {
  secrets: [sessionSecret ?? 'development-only-session-secret-change-before-deployment'],
  httpOnly: true,
  sameSite: 'Lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 14
});

export const cookieSessionStorage = createCookieSessionStorage();
export const sessionMiddleware = session(sessionCookie, cookieSessionStorage);
export const formDataMiddleware = formData();
export const csrfMiddleware = csrf({ allowMissingOrigin: false });

interface SessionAuthValue {
  userId: string;
  accountId: string;
}

const isSessionAuthValue = (value: unknown): value is SessionAuthValue => {
  if (typeof value !== 'object' || value === null) return false;
  return (
    'userId' in value &&
    typeof value.userId === 'string' &&
    'accountId' in value &&
    typeof value.accountId === 'string'
  );
};

export const authMiddleware = auth({
  schemes: [
    createSessionAuthScheme<AuthenticatedUser, SessionAuthValue>({
      read: (session) => {
        const value = session.get('auth');
        return isSessionAuthValue(value) ? value : null;
      },
      verify: ({ userId, accountId }) => findAuthenticatedUser(userId, accountId),
      invalidate: (session) => session.unset('auth')
    })
  ]
});

export const passwordAuthProvider = createCredentialsAuthProvider<
  { email: string; password: string },
  AuthenticatedUser
>({
  parse: (context) => {
    const data = context.get(FormData) ?? new FormData();
    return {
      email: String(data.get('email') ?? ''),
      password: String(data.get('password') ?? '')
    };
  },
  verify: ({ email, password }) => findLoginUser(email, password)
});

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (Boolean(googleClientId) !== Boolean(googleClientSecret)) {
  throw new Error(
    'Configure both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable Google login.'
  );
}

const defaultAppOrigin = `http://localhost:${process.env.PORT ?? '44100'}`;
export const appOrigin = new URL(process.env.APP_ORIGIN ?? defaultAppOrigin);

export const googleAuthProvider =
  googleClientId && googleClientSecret
    ? createGoogleAuthProvider({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        redirectUri: new URL('/auth/google/callback', appOrigin),
        scopes: ['openid', 'email', 'profile']
      })
    : null;

export { completeAuth };
