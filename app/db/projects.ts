import { database } from './database.ts';
import { clients, projects, timeEntries } from './schema.ts';

export type ProjectStatus = 'planned' | 'active' | 'completed' | 'archived';
export type ProjectStatusFilter = ProjectStatus | 'all';

type GetProjectsOptions = {
  search?: string;
  status?: ProjectStatusFilter;
};

const formatMoney = (minor: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(minor / 100);

const formatDuration = (seconds: number) => {
  const minutes = Math.round(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes}m`;

  return remainingMinutes === 0 ? `${hours}h` : `${hours}h ${remainingMinutes}m`;
};

const formatDate = (value: string | null) => {
  if (!value) return null;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${value}T12:00:00Z`));
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

export const getProjectsData = async (accountId: string, options: GetProjectsOptions = {}) => {
  const [clientRows, projectRows, entryRows] = await Promise.all([
    database.findMany(clients, { where: { account_id: accountId }, orderBy: ['name', 'asc'] }),
    database.findMany(projects, {
      where: { account_id: accountId },
      orderBy: [
        ['started_on', 'desc'],
        ['created_at', 'desc']
      ]
    }),
    database.findMany(timeEntries, { where: { account_id: accountId } })
  ]);

  const clientsById = new Map(clientRows.map((client) => [client.id, client]));
  const entriesByProject = new Map<string, typeof entryRows>();

  for (const entry of entryRows) {
    if (entry.status !== 'completed') continue;

    const entries = entriesByProject.get(entry.project_id) ?? [];
    entries.push(entry);
    entriesByProject.set(entry.project_id, entries);
  }

  const projectsWithSummary = projectRows.map((project, index) => {
    const client = clientsById.get(project.client_id);
    const entries = entriesByProject.get(project.id) ?? [];
    const trackedSeconds = entries.reduce(
      (total, entry) => total + (entry.duration_seconds ?? 0),
      0
    );
    const hourlyRate = client?.hourly_rate_minor ?? null;
    const valueMinor = entries.reduce((total, entry) => {
      const rate = entry.hourly_rate_minor_snapshot ?? hourlyRate ?? 0;

      return total + (rate * (entry.duration_seconds ?? 0)) / 3600;
    }, 0);
    const searchText = [project.name, client?.name, project.description]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase();

    return {
      id: project.id,
      name: project.name,
      client: client?.name ?? 'Unknown client',
      initials: initials(client?.name ?? 'Project'),
      status: project.status as ProjectStatus,
      description: project.description?.trim() || null,
      startedOn: formatDate(project.started_on ? String(project.started_on) : null),
      completedOn: formatDate(project.completed_on ? String(project.completed_on) : null),
      trackedTime: formatDuration(trackedSeconds),
      trackedSeconds,
      entryCount: entries.length,
      loggedValue: formatMoney(Math.round(valueMinor), client?.currency ?? 'USD'),
      currency: client?.currency ?? 'USD',
      hourlyRate: hourlyRate === null ? null : formatMoney(hourlyRate, client?.currency ?? 'USD'),
      hourCap: project.hour_cap_minutes,
      invoiceCapMinor: project.invoice_cap_minor,
      progress: project.hour_cap_minutes
        ? Math.min(100, (trackedSeconds / (project.hour_cap_minutes * 60)) * 100)
        : null,
      accent: (['green', 'blue', 'amber'] as const)[index % 3]!,
      searchText
    };
  });

  const search = options.search?.trim().toLocaleLowerCase() ?? '';
  const filteredProjects = projectsWithSummary.filter((project) => {
    const matchesStatus =
      options.status === undefined || options.status === 'all'
        ? true
        : project.status === options.status;

    return matchesStatus && (!search || project.searchText.includes(search));
  });
  const statusCounts = {
    all: projectRows.length,
    planned: projectRows.filter((project) => project.status === 'planned').length,
    active: projectRows.filter((project) => project.status === 'active').length,
    completed: projectRows.filter((project) => project.status === 'completed').length,
    archived: projectRows.filter((project) => project.status === 'archived').length
  };
  const trackedSeconds = [...entriesByProject.values()]
    .flat()
    .reduce((total, entry) => total + (entry.duration_seconds ?? 0), 0);

  return {
    projects: filteredProjects.map(({ searchText: _searchText, ...project }) => project),
    statusCounts,
    metrics: {
      total: projectRows.length,
      active: statusCounts.active,
      completed: statusCounts.completed,
      trackedTime: formatDuration(trackedSeconds)
    },
    filters: { search: options.search?.trim() ?? '', status: options.status ?? 'all' }
  };
};
