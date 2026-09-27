import { Temporal } from './temporal.ts';

export const formatDate = (value: string | null) => {
  if (!value) return null;

  return Temporal.PlainDate.from(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
