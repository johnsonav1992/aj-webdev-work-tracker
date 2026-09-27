import { createCookie } from 'remix/cookie';
import { csrf } from 'remix/middleware/csrf';
import { formData } from 'remix/middleware/form-data';
import { session } from 'remix/middleware/session';
import { createCookieSessionStorage } from 'remix/session-storage/cookie';

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret && process.env.NODE_ENV === 'production') {
  throw new Error('SESSION_SECRET must be configured in production.');
}

const sessionCookie = createCookie('__aj_workbench_session', {
  secrets: [sessionSecret ?? 'development-only-session-secret-change-before-deployment'],
  httpOnly: true,
  sameSite: 'Lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 14
});

const cookieSessionStorage = createCookieSessionStorage();

export const sessionMiddleware = session(sessionCookie, cookieSessionStorage);
export const formDataMiddleware = formData();
export const csrfMiddleware = csrf({ allowMissingOrigin: false });
