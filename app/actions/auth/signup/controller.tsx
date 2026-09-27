import { Auth } from 'remix/middleware/auth';
import { createController } from 'remix/router';

import { googleAuthProvider } from '#app/auth/auth.server.ts';
import { routes } from '#app/routes.ts';
import { redirectTo } from '#app/actions/auth/utils/controller-utils.ts';
import { SignupPage } from '#app/actions/auth/components/signup-page.tsx';

export const signupController = createController(routes.auth.signup, {
  actions: {
    index: (context) => {
      if (context.get(Auth).ok) return redirectTo(context, '/');

      return context.render(<SignupPage googleEnabled={googleAuthProvider !== null} />);
    },
    action: (context) => redirectTo(context, '/signup')
  }
});
