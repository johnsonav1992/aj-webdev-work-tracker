import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../../theme/tokens.ts';
import { AuthLayout } from './auth-layout.tsx';
import { Button } from '../../ui/button.tsx';
import { GoogleIcon } from '../../ui/icons/google-icon.tsx';

export interface SignupPageProps {
  googleEnabled: boolean;
}

export const SignupPage = (handle: Handle<SignupPageProps>) => {
  return () => (
    <AuthLayout title='Create your account'>
      <Button
        href='/auth/google?returnTo=%2Fsignup'
        data-rmx-document
        variant='quiet'
        mix={css({ width: '100%' })}
      >
        <GoogleIcon />
        Sign up with Google
      </Button>
      {!handle.props.googleEnabled ? (
        <p mix={css({ margin: 0, color: `${themeTokens.palette.text.secondary}` })}>
          Google sign-up is not configured yet. Set the Google OAuth credentials and try again.
        </p>
      ) : null}
      <p
        mix={css({
          margin: `${themeTokens.spacing[5]} 0 0`,
          color: `${themeTokens.palette.text.muted}`,
          fontSize: `${themeTokens.typography.size.small}`,
          textAlign: 'center'
        })}
      >
        Have an account? <a href='/login'>Sign in</a>
      </p>
    </AuthLayout>
  );
};
