import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { primaryButtonStyle, quietButtonStyle, themeTokens } from '../../theme/tokens.ts';
import { AuthLayout } from '../../ui/auth-layout.tsx';
import { TextField } from '../../ui/text-field.tsx';

export interface SignupPageProps {
  csrfToken: string;
  token: string;
  invitedEmail: string;
  invitationValid: boolean;
  googleEnabled: boolean;
  error?: 'invalid-invitation' | 'password-too-short' | 'invalid-email';
}

const signupErrorMessage = (error: SignupPageProps['error']) => {
  if (error === 'password-too-short') return 'Use a password with at least 12 characters.';
  if (error === 'invalid-email') return 'Enter a valid email address.';
  if (error === 'invalid-invitation')
    return 'This invitation is invalid, expired, or already used.';
  return null;
};

export const SignupPage = (handle: Handle<SignupPageProps>) => {
  return () => (
    <AuthLayout title='Create your account' description='Use the invitation sent to your email.'>
      {signupErrorMessage(handle.props.error) ? (
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
          {signupErrorMessage(handle.props.error)}
        </p>
      ) : null}
      {handle.props.invitationValid ? (
        <>
          <form
            method='post'
            action='/signup'
            mix={css({ display: 'grid', gap: `${themeTokens.spacing[4]}` })}
          >
            <input type='hidden' name='_csrf' value={handle.props.csrfToken} />
            <input type='hidden' name='token' value={handle.props.token} />
            <TextField
              label='Name'
              name='displayName'
              autoComplete='name'
              required
              maxLength={160}
            />
            <TextField
              label='Invited email'
              name='email'
              type='email'
              autoComplete='email'
              defaultValue={handle.props.invitedEmail}
              readOnly
              required
            />
            <TextField
              label='Password'
              name='password'
              type='password'
              autoComplete='new-password'
              required
              minLength={12}
              maxLength={1024}
            />
            <button type='submit' mix={[primaryButtonStyle, css({ width: '100%' })]}>
              Create account
            </button>
          </form>
          {handle.props.googleEnabled ? (
            <a
              href={`/auth/google?returnTo=${encodeURIComponent(`/signup?token=${handle.props.token}`)}`}
              mix={[
                quietButtonStyle,
                css({
                  width: '100%',
                  justifyContent: 'center',
                  marginTop: `${themeTokens.spacing[3]}`
                })
              ]}
            >
              Sign up with Google
            </a>
          ) : null}
        </>
      ) : (
        <p mix={css({ margin: 0, color: `${themeTokens.palette.text.secondary}` })}>
          Signup is invitation-only. Ask the account owner for an invitation link.
        </p>
      )}
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
