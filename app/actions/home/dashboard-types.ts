export type HomeDashboardData = Awaited<
  ReturnType<typeof import('../../db/dashboard.ts').getDashboardData>
>;
