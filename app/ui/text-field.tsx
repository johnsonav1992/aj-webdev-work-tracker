import type { Handle } from 'remix/ui';
import { css } from 'remix/ui';

import { themeTokens } from '../theme/tokens.ts';

interface TextFieldProps {
  label: string;
  name: string;
  type?: 'email' | 'password' | 'text';
  autoComplete?: string;
  defaultValue?: string;
  readOnly?: boolean;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}

export const TextField = (handle: Handle<TextFieldProps>) => {
  const sharedInputProps = {
    name: handle.props.name,
    autoComplete: handle.props.autoComplete,
    defaultValue: handle.props.defaultValue,
    readOnly: handle.props.readOnly,
    required: handle.props.required,
    minLength: handle.props.minLength,
    maxLength: handle.props.maxLength,
    mix: css({
      width: '100%',
      minHeight: '42px',
      padding: `${themeTokens.spacing[2]} ${themeTokens.spacing[3]}`,
      border: `1px solid ${themeTokens.palette.dividerStrong}`,
      borderRadius: `${themeTokens.shape.small}`,
      background: `${themeTokens.palette.background.paper}`,
      color: `${themeTokens.palette.text.primary}`
    })
  };

  return () => (
    <label
      mix={css({
        display: 'grid',
        gap: `${themeTokens.spacing[1]}`,
        color: `${themeTokens.palette.text.secondary}`,
        fontSize: `${themeTokens.typography.size.small}`,
        fontWeight: `${themeTokens.typography.weight.semibold}`
      })}
    >
      <span>{handle.props.label}</span>
      {handle.props.type === 'email' ? (
        <input
          type='email'
          {...sharedInputProps}
        />
      ) : handle.props.type === 'password' ? (
        <input
          type='password'
          {...sharedInputProps}
        />
      ) : (
        <input
          type='text'
          {...sharedInputProps}
        />
      )}
    </label>
  );
};
