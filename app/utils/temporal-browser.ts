import type { TemporalNamespace } from './temporal-types.ts';

type TemporalGlobal = typeof globalThis & { Temporal?: TemporalNamespace };

const getTemporal = () => {
  const temporal = (globalThis as TemporalGlobal).Temporal;

  if (!temporal) {
    throw new Error('This browser does not support the Temporal API.');
  }

  return temporal;
};

export const Temporal = new Proxy({} as TemporalNamespace, {
  get: (_target, property) => {
    return Reflect.get(getTemporal(), property);
  }
});
