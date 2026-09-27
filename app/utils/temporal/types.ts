import { Temporal as TemporalApi } from '@js-temporal/polyfill';

export type TemporalNamespace = typeof TemporalApi;
export type TemporalDuration = TemporalApi.Duration;
export type TemporalPlainTime = TemporalApi.PlainTime;
