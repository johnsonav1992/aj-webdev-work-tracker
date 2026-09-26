import { database } from './database.ts';
import { clients, payments, projects, timeEntries } from './schema.ts';
import { formatProjectDate, formatProjectDuration, formatProjectMoney } from './project-format.ts';
import type { ProjectStatus } from './projects.ts';
import { durationFromSeconds, sumTimeDurations } from '../utils/temporal.ts';

const paymentMethods = {
  bank_transfer: 'Bank transfer',
  card: 'Card',
  check: 'Check',
  cash: 'Cash',
  other: 'Other'
} as const;

const formatMoneyByCurrency = (amounts: Map<string, number>, fallbackCurrency: string) =>
  amounts.size
    ? [...amounts]
        .map(([currency, amount]) => formatProjectMoney(Math.round(amount), currency))
        .join(' · ')
    : formatProjectMoney(0, fallbackCurrency);

export const getClientDetailData = async (accountId: string, clientId: string) => {
  const client = await database.findOne(clients, {
    where: { account_id: accountId, id: clientId }
  });

  if (!client) return null;

  const [projectRows, entryRows, paymentRows] = await Promise.all([
    database.findMany(projects, {
      where: { account_id: accountId, client_id: client.id },
      orderBy: [
        ['started_on', 'desc'],
        ['created_at', 'desc']
      ]
    }),
    database.findMany(timeEntries, { where: { account_id: accountId } }),
    database.findMany(payments, {
      where: { account_id: accountId, client_id: client.id },
      orderBy: ['paid_on', 'desc']
    })
  ]);

  const projectIds = new Set(projectRows.map((project) => project.id));
  const clientEntries = entryRows.filter((entry) => projectIds.has(entry.project_id));
  const completedEntries = clientEntries.filter((entry) => entry.status === 'completed');
  const entriesByProject = new Map<string, typeof completedEntries>();
  const loggedValueByCurrency = new Map<string, number>();

  for (const entry of completedEntries) {
    const entries = entriesByProject.get(entry.project_id) ?? [];
    entries.push(entry);
    entriesByProject.set(entry.project_id, entries);

    const currency = String(entry.currency || client.currency);
    const rate = entry.hourly_rate_minor_snapshot ?? client.hourly_rate_minor ?? 0;
    const value = durationFromSeconds(entry.duration_seconds ?? 0).total({ unit: 'hours' }) * rate;
    loggedValueByCurrency.set(currency, (loggedValueByCurrency.get(currency) ?? 0) + value);
  }

  const paidValueByCurrency = new Map<string, number>();

  for (const payment of paymentRows) {
    paidValueByCurrency.set(
      payment.currency,
      (paidValueByCurrency.get(payment.currency) ?? 0) + payment.amount_minor
    );
  }

  const trackedTime = sumTimeDurations(
    completedEntries.map((entry) => entry.duration_seconds ?? 0)
  );

  return {
    client: {
      id: client.id,
      name: client.name,
      contactName: client.contact_name,
      email: client.email,
      phone: client.phone,
      notes: client.notes?.trim() || null,
      status: client.status as 'active' | 'archived',
      hourlyRateMinor: client.hourly_rate_minor,
      currency: client.currency
    },
    summary: {
      projectCount: projectRows.length,
      activeProjectCount: projectRows.filter((project) => project.status === 'active').length,
      timeEntryCount: clientEntries.length,
      trackedTime: formatProjectDuration(trackedTime.total({ unit: 'seconds' })),
      loggedValue: formatMoneyByCurrency(loggedValueByCurrency, client.currency),
      paidValue: formatMoneyByCurrency(paidValueByCurrency, client.currency)
    },
    projects: projectRows.map((project) => {
      const entries = entriesByProject.get(project.id) ?? [];
      const projectDuration = sumTimeDurations(entries.map((entry) => entry.duration_seconds ?? 0));
      const projectValueByCurrency = new Map<string, number>();

      for (const entry of entries) {
        const currency = String(entry.currency || client.currency);
        const rate = entry.hourly_rate_minor_snapshot ?? client.hourly_rate_minor ?? 0;
        const value =
          durationFromSeconds(entry.duration_seconds ?? 0).total({ unit: 'hours' }) * rate;
        projectValueByCurrency.set(currency, (projectValueByCurrency.get(currency) ?? 0) + value);
      }

      return {
        id: project.id,
        name: project.name,
        status: project.status as ProjectStatus,
        startedOn: formatProjectDate(project.started_on ? String(project.started_on) : null),
        completedOn: formatProjectDate(project.completed_on ? String(project.completed_on) : null),
        trackedTime: formatProjectDuration(projectDuration.total({ unit: 'seconds' })),
        loggedValue: formatMoneyByCurrency(projectValueByCurrency, client.currency)
      };
    }),
    payments: paymentRows.map((payment) => ({
      id: payment.id,
      date: formatProjectDate(String(payment.paid_on)) ?? String(payment.paid_on),
      amount: formatProjectMoney(payment.amount_minor, payment.currency),
      method: paymentMethods[String(payment.method) as keyof typeof paymentMethods],
      projectName: projectRows.find((project) => project.id === payment.project_id)?.name ?? null,
      notes: payment.notes?.trim() || null
    }))
  };
};
