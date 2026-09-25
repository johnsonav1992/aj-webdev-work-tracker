import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { primaryButtonStyle, quietButtonStyle, themeTokens } from '../../theme/tokens.ts';
import { AuthLayout } from '../../ui/auth-layout.tsx';
import { TextField } from '../../ui/text-field.tsx';
import { GoogleIcon } from '../../ui/icons/google-icon.tsx';

export interface LoginPageProps {
  csrfToken: string;
  googleEnabled: boolean;
  error?: 'invalid-credentials' | 'google-unavailable' | 'google-failed';
}

const errorMessage = (error: LoginPageProps['error']) => {
  if (error === 'invalid-credentials') return 'Email or password is incorrect.';
  if (error === 'google-unavailable') return 'Google sign-in is not configured yet.';
  if (error === 'google-failed') return 'Google sign-in could not be completed. Please try again.';
  return null;
};

export const LoginPage = (handle: Handle<LoginPageProps>) => {
  return () => (
    <AuthLayout title='Welcome back' description='Sign in to your private work tracker.'>
      {errorMessage(handle.props.error) ? (
        <p
          role='alert'
          mix={css({
            margin: `0 0 ${themeTokens.spacing[4]}`,
            padding: `${themeTokens.spacing[2]} ${themeTokens.spacing[3]}`,
            borderRadius: `${themeTokens.shape.small}`,
            background: `${themeTokens.palette.error.light}`,
            color: `${themeTokens.palette.error.dark}`
          })}
        >
          {errorMessage(handle.props.error)}
        </p>
      ) : null}
      <form
        method='post'
        action='/login'
        mix={css({ display: 'grid', gap: `${themeTokens.spacing[4]}` })}
      >
        <input type='hidden' name='_csrf' value={handle.props.csrfToken} />
        <TextField label='Email' name='email' type='email' autoComplete='email' required />
        <TextField
          label='Password'
          name='password'
          type='password'
          autoComplete='current-password'
          required
        />
        <button type='submit' mix={[primaryButtonStyle, css({ width: '100%' })]}>
          Sign in
        </button>
      </form>
      <a
        href='/auth/google'
        data-rmx-document
        mix={[
          quietButtonStyle,
          css({ width: '100%', justifyContent: 'center', marginTop: `${themeTokens.spacing[3]}` })
        ]}
      >
        <GoogleIcon />
        Continue with Google
      </a>
      {!handle.props.googleEnabled ? (
        <p mix={css({ color: `${themeTokens.palette.text.muted}`, textAlign: 'center' })}>
          Google sign-in needs OAuth credentials in the local environment.
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
        New to the tracker? <a href='/signup'>Create your account</a>
      </p>
    </AuthLayout>
  );
};
