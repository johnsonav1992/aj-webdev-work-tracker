import { requireAuth } from 'remix/middleware/auth';

import type { AuthenticatedUser } from '../db/auth.ts';

export const requireAppAuth = requireAuth<AuthenticatedUser>({
  onFailure: (context) => {
    return Response.redirect(new URL('/login', context.url), 303);
  }
});
