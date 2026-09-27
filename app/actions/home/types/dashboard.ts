export type HomeDashboardData = Awaited<
  ReturnType<typeof import('#app/db/dashboard.ts').getDashboardData>
>;
