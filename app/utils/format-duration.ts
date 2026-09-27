import { Temporal } from './temporal.ts';

export const formatDuration = (seconds: number) => {
  const minutes = Temporal.Duration.from({ seconds })
    .round({ smallestUnit: 'minute', roundingMode: 'halfExpand' })
    .total({ unit: 'minutes' });
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes}m`;

  return remainingMinutes === 0 ? `${hours}h` : `${hours}h ${remainingMinutes}m`;
};
