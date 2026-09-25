import { Auth } from 'remix/middleware/auth';
import { getCsrfToken } from 'remix/middleware/csrf';
import { createController } from 'remix/router';

import { assets } from '../assets.ts';
import { routes } from '../routes.ts';
import { HomePage } from './home-page.tsx';

export const rootRoutes = { assets: routes.assets, home: routes.home };

const redirectTo = (context: { url: URL }, path: string) =>
  Response.redirect(new URL(path, context.url), 303);

export default createController(rootRoutes, {
  actions: {
    assets: async (context) => {
      return (await assets.fetch(context.request)) ?? new Response('Not Found', { status: 404 });
    },
    home: (context) => {
      if (!context.get(Auth).ok) return redirectTo(context, '/login');
      return context.render(<HomePage csrfToken={getCsrfToken(context)} />);
    }
  }
});
