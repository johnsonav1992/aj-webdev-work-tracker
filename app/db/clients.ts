import { database } from './database.ts';
import { clients, payments, projects, timeEntries } from './schema.ts';
import { formatProjectDuration, formatProjectMoney } from './project-format.ts';
import { durationFromSeconds, sumTimeDurations } from '../utils/temporal.ts';

export type ClientStatus = 'active' | 'archived';
export type ClientStatusFilter = ClientStatus | 'all';
export type ClientSortBy = 'name' | 'projects' | 'tracked';
export type ClientSortDirection = 'asc' | 'desc';

type GetClientsOptions = {
  search?: string;
  status?: ClientStatusFilter;
  sortBy?: ClientSortBy;
  sortDirection?: ClientSortDirection;
};

const formatMoneyByCurrency = (amounts: Map<string, number>, fallbackCurrency: string) =>
  amounts.size
    ? [...amounts]
        .map(([currency, amount]) => formatProjectMoney(Math.round(amount), currency))
        .join(' · ')
    : formatProjectMoney(0, fallbackCurrency);

export const getClientsData = async (accountId: string, options: GetClientsOptions = {}) => {
  const [clientRows, projectRows, entryRows, paymentRows] = await Promise.all([
    database.findMany(clients, { where: { account_id: accountId }, orderBy: ['name', 'asc'] }),
    database.findMany(projects, { where: { account_id: accountId } }),
    database.findMany(timeEntries, { where: { account_id: accountId } }),
    database.findMany(payments, { where: { account_id: accountId } })
  ]);

  const projectsByClient = new Map<string, typeof projectRows>();
  const projectsById = new Map(projectRows.map((project) => [project.id, project]));

  for (const project of projectRows) {
    const clientProjects = projectsByClient.get(project.client_id) ?? [];
    clientProjects.push(project);
    projectsByClient.set(project.client_id, clientProjects);
  }

  const entriesByClient = new Map<string, typeof entryRows>();

  for (const entry of entryRows) {
    if (entry.status !== 'completed') continue;

    const project = projectsById.get(entry.project_id);
    if (!project) continue;

    const clientEntries = entriesByClient.get(project.client_id) ?? [];
    clientEntries.push(entry);
    entriesByClient.set(project.client_id, clientEntries);
  }

  const paymentsByClient = new Map<string, typeof paymentRows>();

  for (const payment of paymentRows) {
    const clientPayments = paymentsByClient.get(payment.client_id) ?? [];
    clientPayments.push(payment);
    paymentsByClient.set(payment.client_id, clientPayments);
  }

  const clientsWithSummary = clientRows.map((client) => {
    const clientProjects = projectsByClient.get(client.id) ?? [];
    const entries = entriesByClient.get(client.id) ?? [];
    const clientPayments = paymentsByClient.get(client.id) ?? [];
    const trackedTime = sumTimeDurations(entries.map((entry) => entry.duration_seconds ?? 0));
    const loggedValueByCurrency = new Map<string, number>();

    for (const entry of entries) {
      const currency = String(entry.currency || client.currency);
      const rate = entry.hourly_rate_minor_snapshot ?? client.hourly_rate_minor ?? 0;
      const value =
        durationFromSeconds(entry.duration_seconds ?? 0).total({ unit: 'hours' }) * rate;
      loggedValueByCurrency.set(currency, (loggedValueByCurrency.get(currency) ?? 0) + value);
    }

    const paidValueByCurrency = new Map<string, number>();

    for (const payment of clientPayments) {
      paidValueByCurrency.set(
        payment.currency,
        (paidValueByCurrency.get(payment.currency) ?? 0) + payment.amount_minor
      );
    }

    const searchText = [client.name, client.contact_name, client.email, client.phone]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase();

    return {
      id: client.id,
      name: client.name,
      contactName: client.contact_name,
      email: client.email,
      phone: client.phone,
      status: client.status as ClientStatus,
      currency: client.currency,
      hourlyRate:
        client.hourly_rate_minor === null
          ? null
          : formatProjectMoney(client.hourly_rate_minor, client.currency),
      projectCount: clientProjects.length,
      activeProjectCount: clientProjects.filter((project) => project.status === 'active').length,
      trackedTime: formatProjectDuration(trackedTime.total({ unit: 'seconds' })),
      trackedSeconds: trackedTime.total({ unit: 'seconds' }),
      loggedValue: formatMoneyByCurrency(loggedValueByCurrency, client.currency),
      paidValue: formatMoneyByCurrency(paidValueByCurrency, client.currency),
      searchText
    };
  });

  const search = options.search?.trim().toLocaleLowerCase() ?? '';
  const filteredClients = clientsWithSummary.filter((client) => {
    const matchesStatus =
      options.status === undefined || options.status === 'all'
        ? true
        : client.status === options.status;

    return matchesStatus && (!search || client.searchText.includes(search));
  });
  const sortBy = options.sortBy ?? 'name';
  const sortDirection = options.sortDirection ?? 'asc';
  const directionMultiplier = sortDirection === 'asc' ? 1 : -1;

  filteredClients.sort((first, second) => {
    const comparison =
      sortBy === 'projects'
        ? first.projectCount - second.projectCount
        : sortBy === 'tracked'
          ? first.trackedSeconds - second.trackedSeconds
          : first.name.localeCompare(second.name);

    return comparison === 0
      ? first.name.localeCompare(second.name)
      : comparison * directionMultiplier;
  });

  return {
    clients: filteredClients.map(
      ({ searchText: _searchText, trackedSeconds: _trackedSeconds, ...client }) => client
    ),
    statusCounts: {
      all: clientRows.length,
      active: clientRows.filter((client) => client.status === 'active').length,
      archived: clientRows.filter((client) => client.status === 'archived').length
    },
    metrics: {
      total: clientRows.length,
      active: clientRows.filter((client) => client.status === 'active').length,
      archived: clientRows.filter((client) => client.status === 'archived').length
    },
    filters: {
      search: options.search?.trim() ?? '',
      status: options.status ?? 'all',
      sortBy,
      sortDirection
    }
  };
};
