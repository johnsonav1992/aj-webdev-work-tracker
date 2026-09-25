import { render } from 'remix/middleware/render';
import { staticFiles } from 'remix/middleware/static';
import { createRouter, type MiddlewareContext } from 'remix/router';
import {
  csrfMiddleware,
  authMiddleware,
  formDataMiddleware,
  sessionMiddleware
} from './auth/auth.server.ts';

import controller, { rootRoutes } from './actions/controller.tsx';
import {
  googleController,
  loginController,
  logoutAction,
  signupController
} from './actions/auth-controller.tsx';
import { assets } from './assets.ts';
import { routes } from './routes.ts';
import { Temporal } from './utils/temporal.ts';
import type { TemporalNamespace } from './utils/temporal-types.ts';

type TemporalGlobal = typeof globalThis & { Temporal?: TemporalNamespace };

(globalThis as TemporalGlobal).Temporal ??= Temporal;

const renderMiddleware = render({ assets });
const staticMiddleware = staticFiles('./public', { index: false });
export type AppContext = MiddlewareContext<
  [
    typeof staticMiddleware,
    typeof sessionMiddleware,
    typeof formDataMiddleware,
    typeof csrfMiddleware,
    typeof authMiddleware,
    typeof renderMiddleware
  ]
>;

declare module 'remix/router' {
  interface RouterTypes {
    context: AppContext;
  }
}

export const router = createRouter<AppContext>({
  middleware: [
    staticMiddleware,
    sessionMiddleware,
    formDataMiddleware,
    csrfMiddleware,
    authMiddleware,
    renderMiddleware
  ]
});

router.map(rootRoutes, controller);
router.map(routes.auth.login, loginController);
router.map(routes.auth.signup, signupController);
router.map(routes.auth.logout, logoutAction);
router.map(routes.auth.google, googleController);
