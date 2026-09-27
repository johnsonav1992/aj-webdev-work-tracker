import { render } from 'remix/middleware/render';
import { staticFiles } from 'remix/middleware/static';
import { createRouter, type MiddlewareContext } from 'remix/router';
import { authMiddleware } from './middleware/auth.server.ts';
import {
  csrfMiddleware,
  formDataMiddleware,
  sessionMiddleware
} from './middleware/session.server.ts';

import controller, { assetRoutes, assetsController, rootRoutes } from './actions/controller.tsx';
import { logoutController, logoutRoutes } from './actions/auth/controller.tsx';
import { googleController } from './actions/auth/google/controller.tsx';
import { loginController } from './actions/auth/login/controller.tsx';
import { signupController } from './actions/auth/signup/controller.tsx';
import { projectCreateController } from './actions/project-create/controller.tsx';
import { timeController } from './actions/time/controller.tsx';
import { assets } from './assets.ts';
import { routes } from './routes.ts';
import { Temporal } from './utils/temporal.ts';
import type { TemporalNamespace } from './utils/temporal/types.ts';

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
router.map(assetRoutes, assetsController);
router.map(routes.auth.login, loginController);
router.map(routes.auth.signup, signupController);
router.map(logoutRoutes, logoutController);
router.map(routes.auth.google, googleController);
router.map(routes.projectCreate, projectCreateController);
router.map(routes.time, timeController);
