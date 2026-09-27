import { completeAuth } from '#app/auth/auth.server.ts';

export const redirectTo = (context: { url: URL }, path: string) =>
  Response.redirect(new URL(path, context.url), 303);

export const completeSession = (
  context: Parameters<typeof completeAuth>[0],
  user: { id: string; accountId: string }
) => {
  const session = completeAuth(context);
  session.set('auth', { userId: user.id, accountId: user.accountId });
};
