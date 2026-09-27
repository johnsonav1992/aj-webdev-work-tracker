import { database } from './database.ts';
import { accountSettings, clients, payments, projects, timeEntries } from './schema.ts';
import { accentTones } from '#app/theme/tokens.ts';
import { Temporal, durationFromSeconds, sumTimeDurations } from '#app/utils/temporal.ts';
import type { TemporalDuration } from '#app/utils/temporal/types.ts';
import { formatCurrency } from '#app/utils/format-currency.ts';
import { formatDate } from '#app/utils/format-date.ts';
import { formatDuration } from '#app/utils/format-duration.ts';
import { formatInitials } from '#app/utils/format-initials.ts';
import { formatPaymentMethodLabel } from '#app/utils/payment-method-label.ts';

export const getDashboardData = async (accountId: string) => {
  const [clientRows, projectRows, entryRows, paymentRows, currencySetting] = await Promise.all([
    database.findMany(clients, {
      where: { account_id: accountId },
      orderBy: ['name', 'asc']
    }),
    database.findMany(projects, {
      where: { account_id: accountId },
      orderBy: [
        ['started_on', 'desc'],
        ['created_at', 'desc']
      ]
    }),
    database.findMany(timeEntries, {
      where: { account_id: accountId },
      orderBy: [
        ['work_date', 'desc'],
        ['started_at', 'desc']
      ]
    }),
    database.findMany(payments, {
      where: { account_id: accountId },
      orderBy: ['paid_on', 'desc']
    }),
    database.findOne(accountSettings, {
      where: { account_id: accountId, key: 'default_currency' }
    })
  ]);

  const currency = currencySetting ? (JSON.parse(currencySetting.value_json) as string) : 'USD';
  const clientsById = new Map(clientRows.map((client) => [client.id, client]));
  const projectsById = new Map(projectRows.map((project) => [project.id, project]));
  const runningEntry = entryRows.find((entry) => entry.status === 'running');
  const secondsByProject = new Map<string, TemporalDuration>();
  const loggedValueByProject = new Map<string, number>();

  let loggedValueMinor = 0;
  let hoursThisWeek = Temporal.Duration.from({ seconds: 0 });
  const today = Temporal.Now.plainDateISO();
  const weekStartKey = today.subtract({ days: today.dayOfWeek - 1 }).toString();

  for (const entry of entryRows) {
    if (entry.status !== 'completed') continue;

    const seconds = entry.duration_seconds ?? 0;
    const duration = durationFromSeconds(seconds);
    secondsByProject.set(
      entry.project_id,
      (secondsByProject.get(entry.project_id) ?? Temporal.Duration.from({ seconds: 0 })).add(
        duration
      )
    );

    const project = projectsById.get(entry.project_id);
    const client = project ? clientsById.get(project.client_id) : undefined;
    const hourlyRate = entry.hourly_rate_minor_snapshot ?? client?.hourly_rate_minor ?? 0;
    const valueMinor = duration.total({ unit: 'hours' }) * hourlyRate;
    loggedValueMinor += valueMinor;
    loggedValueByProject.set(
      entry.project_id,
      (loggedValueByProject.get(entry.project_id) ?? 0) + valueMinor
    );

    if (String(entry.work_date) >= weekStartKey) hoursThisWeek = hoursThisWeek.add(duration);
  }

  const currentMonth = today.toString().slice(0, 7);
  const paymentsThisMonth = paymentRows
    .filter((payment) => String(payment.paid_on).startsWith(currentMonth))
    .reduce((sum, payment) => sum + payment.amount_minor, 0);
  const clientProjectCounts = new Map<string, number>();

  for (const project of projectRows) {
    clientProjectCounts.set(
      project.client_id,
      (clientProjectCounts.get(project.client_id) ?? 0) + 1
    );
  }

  const completedProjects = projectRows.filter((project) => project.status === 'completed').length;
  const projectNote = completedProjects
    ? `${completedProjects} completed · ${clientRows.length} ${clientRows.length === 1 ? 'client' : 'clients'}`
    : `Across ${clientRows.length} ${clientRows.length === 1 ? 'client' : 'clients'}`;

  return {
    currency,
    metrics: {
      projects: String(projectRows.length),
      projectsNote: projectNote,
      hoursThisWeek: hoursThisWeek.total({ unit: 'hours' }).toFixed(1),
      loggedValue: formatCurrency(Math.round(loggedValueMinor), currency),
      loggedValueNote: `${formatDuration(sumTimeDurations(entryRows.map((entry) => entry.duration_seconds ?? 0)).total({ unit: 'seconds' }))} tracked`,
      paymentsThisMonth: formatCurrency(paymentsThisMonth, currency),
      paymentsNote: 'Stripe sync is not connected'
    },
    projectOptions: projectRows
      .filter((project) => project.status === 'active')
      .map((project) => ({
        id: project.id,
        name: project.name,
        client: clientsById.get(project.client_id)?.name ?? 'Unknown client'
      })),
    activeTimer: runningEntry
      ? {
          id: runningEntry.id,
          projectId: runningEntry.project_id,
          project: projectsById.get(runningEntry.project_id)?.name ?? 'Unknown project',
          client:
            clientsById.get(projectsById.get(runningEntry.project_id)?.client_id ?? '')?.name ??
            'Unknown client',
          startedAt: runningEntry.started_at,
          durationSeconds: runningEntry.duration_seconds ?? 0,
          notes: runningEntry.notes
        }
      : null,
    projects: projectRows.slice(0, 5).map((project, index) => {
      const client = clientsById.get(project.client_id);
      const rate = client?.hourly_rate_minor;
      const spentDuration =
        secondsByProject.get(project.id) ?? Temporal.Duration.from({ seconds: 0 });
      const spentSeconds = spentDuration.total({ unit: 'seconds' });
      const projectValueMinor = Math.round(loggedValueByProject.get(project.id) ?? 0);
      const hourCapDuration = Temporal.Duration.from({ minutes: project.hour_cap_minutes ?? 0 });
      const progress = project.hour_cap_minutes
        ? Math.min(100, (spentSeconds / hourCapDuration.total({ unit: 'seconds' })) * 100)
        : null;

      return {
        id: project.id,
        initials: formatInitials(client?.name ?? 'Project'),
        name: project.name,
        client: client?.name ?? 'Unknown client',
        status: project.status as 'planned' | 'active' | 'completed' | 'archived',
        progress,
        timeSummary: project.hour_cap_minutes
          ? `${formatDuration(spentDuration.total({ unit: 'seconds' }))} of ${hourCapDuration.total({ unit: 'hours' })}h cap · ${formatCurrency(projectValueMinor, currency)} of ${formatCurrency(project.invoice_cap_minor ?? 0, currency)} max`
          : `${formatDuration(spentDuration.total({ unit: 'seconds' }))} logged`,
        rate:
          rate === null || rate === undefined
            ? 'Rate not set'
            : `${formatCurrency(rate, client?.currency ?? currency)} / hour`,
        tone: accentTones[index % accentTones.length]!
      };
    }),
    timeEntries: entryRows.slice(0, 5).map((entry, index) => {
      const project = projectsById.get(entry.project_id);
      const client = project ? clientsById.get(project.client_id) : undefined;

      return {
        id: entry.id,
        title: entry.notes?.trim() || 'Work session',
        client: [client?.name, project?.name].filter(Boolean).join(' · '),
        date: formatDate(String(entry.work_date)) ?? String(entry.work_date),
        duration: formatDuration(entry.duration_seconds ?? 0),
        tint: accentTones[index % accentTones.length]!
      };
    }),
    payments: paymentRows.slice(0, 3).map((payment) => {
      const client = clientsById.get(payment.client_id);
      const project = payment.project_id ? projectsById.get(payment.project_id) : undefined;

      return {
        id: payment.id,
        client: client?.name ?? 'Unknown client',
        project: project?.name ?? 'General payment',
        amount: formatCurrency(payment.amount_minor, payment.currency),
        date: formatDate(String(payment.paid_on)) ?? String(payment.paid_on),
        method: formatPaymentMethodLabel(String(payment.method))
      };
    }),
    clients: clientRows.map((client, index) => ({
      id: client.id,
      initials: formatInitials(client.name),
      name: client.name,
      summary: `${clientProjectCounts.get(client.id) ?? 0} ${clientProjectCounts.get(client.id) === 1 ? 'project' : 'projects'}`,
      rate:
        client.hourly_rate_minor === null
          ? 'Rate not set'
          : `${formatCurrency(client.hourly_rate_minor, client.currency)} / hr`,
      tint: accentTones[index % accentTones.length]!
    }))
  };
};
