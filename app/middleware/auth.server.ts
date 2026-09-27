import { auth, createSessionAuthScheme, requireAuth } from 'remix/middleware/auth';

import { findAuthenticatedUser } from '#app/db/auth.ts';
import type { AuthenticatedUser } from '#app/auth/types/authenticated-user.ts';
import type { SessionAuthValue } from '#app/auth/types/session-auth.ts';

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

export const requireAppAuth = requireAuth<AuthenticatedUser>({
  onFailure: (context) => {
    return Response.redirect(new URL('/login', context.url), 303);
  }
});
