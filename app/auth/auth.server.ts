import { completeAuth, createCredentialsAuthProvider, createGoogleAuthProvider } from 'remix/auth';

import { findLoginUser } from '#app/db/auth.ts';
import type { AuthenticatedUser } from './types/authenticated-user.ts';

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
