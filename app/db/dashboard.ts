import { database } from './database.ts';
import { accountSettings, clients, payments, projects, timeEntries } from './schema.ts';

type Tone = 'green' | 'blue' | 'amber';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${value}T12:00:00Z`));

const toDateKey = (value: Date) =>
  `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;

const formatMoney = (minor: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(minor / 100);

const formatDuration = (seconds: number) => {
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

const tones: Tone[] = ['green', 'blue', 'amber'];

export const getDashboardData = async (accountId: string, displayName: string | null) => {
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
  const secondsByProject = new Map<string, number>();
  const loggedValueByProject = new Map<string, number>();

  let loggedValueMinor = 0;
  let hoursThisWeekSeconds = 0;
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const weekStartKey = toDateKey(weekStart);

  for (const entry of entryRows) {
    if (entry.status !== 'completed') continue;

    const seconds = entry.duration_seconds ?? 0;
    secondsByProject.set(entry.project_id, (secondsByProject.get(entry.project_id) ?? 0) + seconds);

    const project = projectsById.get(entry.project_id);
    const client = project ? clientsById.get(project.client_id) : undefined;
    const hourlyRate = entry.hourly_rate_minor_snapshot ?? client?.hourly_rate_minor ?? 0;
    const valueMinor = (seconds * hourlyRate) / 3600;
    loggedValueMinor += valueMinor;
    loggedValueByProject.set(
      entry.project_id,
      (loggedValueByProject.get(entry.project_id) ?? 0) + valueMinor
    );

    if (String(entry.work_date) >= weekStartKey) hoursThisWeekSeconds += seconds;
  }

  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
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
    displayName: displayName?.trim().split(/\s+/)[0] || 'there',
    currency,
    metrics: {
      projects: String(projectRows.length),
      projectsNote: projectNote,
      hoursThisWeek: (hoursThisWeekSeconds / 3600).toFixed(1),
      loggedValue: formatMoney(Math.round(loggedValueMinor), currency),
      loggedValueNote: `${formatDuration(entryRows.reduce((sum, entry) => sum + (entry.duration_seconds ?? 0), 0))} tracked`,
      paymentsThisMonth: formatMoney(paymentsThisMonth, currency),
      paymentsNote: 'Stripe payment history will be connected later'
    },
    projectOptions: projectRows
      .filter((project) => project.status === 'active')
      .map((project) => ({
        id: project.id,
        name: project.name,
        client: clientsById.get(project.client_id)?.name ?? 'Unknown client'
      })),
    projects: projectRows.slice(0, 5).map((project, index) => {
      const client = clientsById.get(project.client_id);
      const rate = client?.hourly_rate_minor;
      const spentSeconds = secondsByProject.get(project.id) ?? 0;
      const projectValueMinor = Math.round(loggedValueByProject.get(project.id) ?? 0);
      const progress = project.hour_cap_minutes
        ? Math.min(100, (spentSeconds / (project.hour_cap_minutes * 60)) * 100)
        : null;

      return {
        id: project.id,
        initials: initials(client?.name ?? 'Project'),
        name: project.name,
        client: client?.name ?? 'Unknown client',
        status: project.status as 'planned' | 'active' | 'completed' | 'archived',
        progress,
        timeSummary: project.hour_cap_minutes
          ? `${formatDuration(spentSeconds)} of ${project.hour_cap_minutes / 60}h cap · ${formatMoney(projectValueMinor, currency)} of ${formatMoney(project.invoice_cap_minor ?? 0, currency)} max`
          : `${formatDuration(spentSeconds)} logged`,
        rate:
          rate === null || rate === undefined
            ? 'Rate not set'
            : `${formatMoney(rate, client?.currency ?? currency)} / hour`,
        tone: tones[index % tones.length]!
      };
    }),
    timeEntries: entryRows.slice(0, 5).map((entry, index) => {
      const project = projectsById.get(entry.project_id);
      const client = project ? clientsById.get(project.client_id) : undefined;
      return {
        id: entry.id,
        title: entry.notes?.trim() || 'Work session',
        client: [client?.name, project?.name].filter(Boolean).join(' · '),
        date: formatDate(String(entry.work_date)),
        duration: formatDuration(entry.duration_seconds ?? 0),
        tint: tones[index % tones.length]!
      };
    }),
    payments: paymentRows.slice(0, 3).map((payment) => {
      const client = clientsById.get(payment.client_id);
      const project = payment.project_id ? projectsById.get(payment.project_id) : undefined;
      const methods = {
        bank_transfer: 'Bank transfer',
        card: 'Card',
        check: 'Check',
        cash: 'Cash',
        other: 'Other'
      } as const;

      return {
        id: payment.id,
        client: client?.name ?? 'Unknown client',
        project: project?.name ?? 'General payment',
        amount: formatMoney(payment.amount_minor, payment.currency),
        date: formatDate(String(payment.paid_on)),
        method: methods[String(payment.method) as keyof typeof methods]
      };
    }),
    clients: clientRows.map((client, index) => ({
      id: client.id,
      initials: initials(client.name),
      name: client.name,
      summary: `${clientProjectCounts.get(client.id) ?? 0} ${clientProjectCounts.get(client.id) === 1 ? 'project' : 'projects'}`,
      rate:
        client.hourly_rate_minor === null
          ? 'Rate not set'
          : `${formatMoney(client.hourly_rate_minor, client.currency)} / hr`,
      tint: tones[index % tones.length]!
    }))
  };
};
