import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { quietButtonStyle, themeTokens } from '../../theme/tokens.ts';
import { AuthLayout } from '../../ui/auth-layout.tsx';
import { GoogleIcon } from '../../ui/icons/google-icon.tsx';

export interface SignupPageProps {
  googleEnabled: boolean;
}

export const SignupPage = (handle: Handle<SignupPageProps>) => {
  return () => (
    <AuthLayout title='Create your account' description='Start your private work tracker.'>
      <a
        href='/auth/google?returnTo=%2Fsignup'
        data-rmx-document
        mix={[quietButtonStyle, css({ width: '100%', justifyContent: 'center' })]}
      >
        <GoogleIcon />
        Sign up with Google
      </a>
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
        Already have an account? <a href='/login'>Sign in</a>
      </p>
    </AuthLayout>
  );
};
