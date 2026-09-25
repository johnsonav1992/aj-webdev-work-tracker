import { Temporal as PolyfillTemporal } from '@js-temporal/polyfill';
import type { TemporalNamespace } from './temporal-types.ts';

type TemporalGlobal = typeof globalThis & { Temporal?: TemporalNamespace };

// Keep the implementation choice here so app code can move to the native global without edits.
export const Temporal: TemporalNamespace =
  (globalThis as TemporalGlobal).Temporal ?? PolyfillTemporal;

export const durationFromSeconds = (seconds: number) => Temporal.Duration.from({ seconds });

export const sumTimeDurations = (durationsInSeconds: Iterable<number>) => {
  let total = Temporal.Duration.from({ seconds: 0 });

  for (const seconds of durationsInSeconds) {
    total = total.add(durationFromSeconds(seconds));
  }

  return total;
};
