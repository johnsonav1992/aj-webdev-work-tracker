import { Auth } from 'remix/middleware/auth';
import { createController } from 'remix/router';

import { googleAuthProvider } from '../../../auth/auth.server.ts';
import { routes } from '../../../routes.ts';
import { redirectTo } from '../controller-utils.ts';
import { SignupPage } from '../signup-page.tsx';

export const signupController = createController(routes.auth.signup, {
  actions: {
    index: (context) => {
      if (context.get(Auth).ok) return redirectTo(context, '/');

      return context.render(<SignupPage googleEnabled={googleAuthProvider !== null} />);
    },
    action: (context) => redirectTo(context, '/signup')
  }
});
