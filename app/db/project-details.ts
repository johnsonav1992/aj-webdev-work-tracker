import { database } from './database.ts';
import { formatProjectDate, formatProjectDuration, formatProjectMoney } from './project-format.ts';
import { clients, payments, projects, timeEntries } from './schema.ts';
import type { ProjectStatus } from './projects.ts';
import { Temporal, durationFromSeconds } from '../utils/temporal.ts';

const paymentMethods = {
  bank_transfer: 'Bank transfer',
  card: 'Card',
  check: 'Check',
  cash: 'Cash',
  other: 'Other'
} as const;

export const getProjectDetailData = async (accountId: string, projectId: string) => {
  const project = await database.findOne(projects, {
    where: { account_id: accountId, id: projectId }
  });

  if (!project) return null;

  const [client, entryRows, paymentRows] = await Promise.all([
    database.findOne(clients, {
      where: { account_id: accountId, id: project.client_id }
    }),
    database.findMany(timeEntries, {
      where: { account_id: accountId, project_id: project.id },
      orderBy: [
        ['work_date', 'desc'],
        ['started_at', 'desc']
      ]
    }),
    database.findMany(payments, {
      where: { account_id: accountId, project_id: project.id },
      orderBy: [['paid_on', 'desc']]
    })
  ]);

  const valueByCurrency = new Map<string, number>();
  let trackedDuration = Temporal.Duration.from({ seconds: 0 });

  for (const entry of entryRows) {
    if (entry.status !== 'completed') continue;

    const seconds = entry.duration_seconds ?? 0;
    const rate = entry.hourly_rate_minor_snapshot ?? client?.hourly_rate_minor ?? 0;
    const duration = durationFromSeconds(seconds);
    const value = duration.total({ unit: 'hours' }) * rate;
    const currency = String(entry.currency || client?.currency || 'USD');

    trackedDuration = trackedDuration.add(duration);
    valueByCurrency.set(currency, (valueByCurrency.get(currency) ?? 0) + value);
  }

  const loggedValue = valueByCurrency.size
    ? [...valueByCurrency]
        .map(([currency, value]) => formatProjectMoney(Math.round(value), currency))
        .join(' · ')
    : formatProjectMoney(0, client?.currency ?? 'USD');

  return {
    project: {
      id: project.id,
      name: project.name,
      status: project.status as ProjectStatus,
      description: project.description?.trim() || null,
      notes: project.notes?.trim() || null,
      startedOn: formatProjectDate(project.started_on ? String(project.started_on) : null),
      completedOn: formatProjectDate(project.completed_on ? String(project.completed_on) : null),
      hourCapMinutes: project.hour_cap_minutes,
      invoiceCapMinor: project.invoice_cap_minor
    },
    client: {
      name: client?.name ?? 'Unknown client',
      contactName: client?.contact_name,
      email: client?.email,
      phone: client?.phone,
      hourlyRateMinor: client?.hourly_rate_minor,
      currency: client?.currency ?? 'USD'
    },
    summary: {
      trackedTime: formatProjectDuration(trackedDuration.total({ unit: 'seconds' })),
      trackedSeconds: trackedDuration.total({ unit: 'seconds' }),
      loggedValue,
      entryCount: entryRows.length
    },
    timeEntries: entryRows.map((entry) => ({
      id: entry.id,
      date: formatProjectDate(String(entry.work_date)) ?? String(entry.work_date),
      description: entry.notes?.trim() || 'Work session',
      duration:
        entry.status === 'running' ? 'Running' : formatProjectDuration(entry.duration_seconds ?? 0),
      status: entry.status,
      source: entry.source === 'timer' ? 'Timer' : 'Manual'
    })),
    payments: paymentRows.map((payment) => ({
      id: payment.id,
      date: formatProjectDate(String(payment.paid_on)) ?? String(payment.paid_on),
      amount: formatProjectMoney(payment.amount_minor, payment.currency),
      method: paymentMethods[String(payment.method) as keyof typeof paymentMethods],
      notes: payment.notes?.trim() || null
    }))
  };
};
