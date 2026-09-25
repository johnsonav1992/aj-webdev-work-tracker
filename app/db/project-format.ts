import { Temporal } from '../utils/temporal.ts';

export const formatProjectMoney = (minor: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(minor / 100);

export const formatProjectDuration = (seconds: number) => {
  const minutes = Temporal.Duration.from({ seconds })
    .round({ smallestUnit: 'minute', roundingMode: 'halfExpand' })
    .total({ unit: 'minutes' });
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes}m`;

  return remainingMinutes === 0 ? `${hours}h` : `${hours}h ${remainingMinutes}m`;
};

export const formatProjectDate = (value: string | null) => {
  if (!value) return null;

  return Temporal.PlainDate.from(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
