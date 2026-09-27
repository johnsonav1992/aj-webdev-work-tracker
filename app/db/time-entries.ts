import { randomUUID } from 'node:crypto';

import { Temporal } from '#app/utils/temporal.ts';
import { database } from './database.ts';
import { clients, projects, timeEntries } from './schema.ts';
import { formatDate } from '#app/utils/format-date.ts';
import { formatDuration } from '#app/utils/format-duration.ts';

export const getRunningTimeEntry = async (accountId: string) =>
  database.findOne(timeEntries, {
    where: { account_id: accountId, status: 'running' },
    orderBy: ['started_at', 'asc']
  });

export const createManualTimeEntry = async (
  accountId: string,
  input: { projectId: string; workDate: string; durationSeconds: number; notes: string }
) =>
  database.transaction(async (transaction) => {
    const project = await transaction.findOne(projects, {
      where: { id: input.projectId, account_id: accountId }
    });

    if (!project) return false;

    const client = await transaction.findOne(clients, {
      where: { id: project.client_id, account_id: accountId }
    });

    if (!client) return false;

    const timestamp = Temporal.Now.instant().epochMilliseconds;

    await transaction.create(timeEntries, {
      id: randomUUID(),
      account_id: accountId,
      project_id: project.id,
      work_date: input.workDate,
      status: 'completed',
      source: 'manual',
      started_at: null,
      ended_at: null,
      duration_seconds: input.durationSeconds,
      hourly_rate_minor_snapshot: client.hourly_rate_minor,
      currency: client.currency,
      notes: input.notes.trim() || null,
      created_at: timestamp,
      updated_at: timestamp
    });

    return true;
  });

export const getTimePageData = async (accountId: string) => {
  const [entryRows, projectRows, clientRows] = await Promise.all([
    database.findMany(timeEntries, {
      where: { account_id: accountId },
      orderBy: [
        ['work_date', 'desc'],
        ['created_at', 'desc']
      ]
    }),
    database.findMany(projects, {
      where: { account_id: accountId },
      orderBy: [
        ['started_on', 'desc'],
        ['created_at', 'desc']
      ]
    }),
    database.findMany(clients, {
      where: { account_id: accountId },
      orderBy: ['name', 'asc']
    })
  ]);

  const projectsById = new Map(projectRows.map((project) => [project.id, project]));
  const clientsById = new Map(clientRows.map((client) => [client.id, client]));

  return {
    projectOptions: projectRows.map((project) => ({
      id: project.id,
      label: `${clientsById.get(project.client_id)?.name ?? 'Unknown client'} · ${project.name}`
    })),
    hasRunningEntry: entryRows.some((entry) => entry.status === 'running'),
    entries: entryRows
      .filter((entry) => entry.status === 'completed')
      .map((entry) => {
        const project = projectsById.get(entry.project_id);
        const client = project ? clientsById.get(project.client_id) : undefined;

        return {
          id: entry.id,
          workDate: formatDate(String(entry.work_date)) ?? String(entry.work_date),
          project: project?.name ?? 'Unknown project',
          client: client?.name ?? 'Unknown client',
          duration: formatDuration(entry.duration_seconds ?? 0),
          source: entry.source === 'manual' ? 'Manual' : 'Timer',
          notes: entry.notes?.trim() || '—'
        };
      })
  };
};

export const startTimeEntry = async (accountId: string, projectId: string, notes: string | null) =>
  database.transaction(async (transaction) => {
    const [existingEntry, project] = await Promise.all([
      transaction.findOne(timeEntries, {
        where: { account_id: accountId, status: 'running' }
      }),
      transaction.findOne(projects, {
        where: { id: projectId, account_id: accountId, status: 'active' }
      })
    ]);

    if (existingEntry || !project) return false;

    const client = await transaction.findOne(clients, {
      where: { id: project.client_id, account_id: accountId }
    });

    if (!client) return false;

    const now = Temporal.Now.instant();
    const timestamp = now.epochMilliseconds;

    await transaction.create(timeEntries, {
      id: randomUUID(),
      account_id: accountId,
      project_id: project.id,
      work_date: now.toZonedDateTimeISO(Temporal.Now.timeZoneId()).toPlainDate().toString(),
      status: 'running',
      source: 'timer',
      started_at: timestamp,
      ended_at: null,
      duration_seconds: 0,
      hourly_rate_minor_snapshot: client.hourly_rate_minor,
      currency: client.currency,
      notes: notes?.trim() || null,
      created_at: timestamp,
      updated_at: timestamp
    });

    return true;
  });

export const pauseTimeEntry = async (accountId: string, entryId: string) =>
  database.transaction(async (transaction) => {
    const entry = await transaction.findOne(timeEntries, {
      where: { id: entryId, account_id: accountId, status: 'running' }
    });

    if (!entry || entry.started_at === null) return false;

    const pausedAt = Temporal.Now.instant().epochMilliseconds;
    const segmentSeconds = Math.max(0, Math.floor((pausedAt - entry.started_at) / 1000));

    await transaction.update(timeEntries, entry.id, {
      started_at: null,
      duration_seconds: (entry.duration_seconds ?? 0) + segmentSeconds,
      updated_at: pausedAt
    });

    return true;
  });

export const resumeTimeEntry = async (accountId: string, entryId: string) =>
  database.transaction(async (transaction) => {
    const entry = await transaction.findOne(timeEntries, {
      where: { id: entryId, account_id: accountId, status: 'running' }
    });

    if (!entry || entry.started_at !== null) return false;

    const resumedAt = Temporal.Now.instant().epochMilliseconds;

    await transaction.update(timeEntries, entry.id, {
      started_at: resumedAt,
      updated_at: resumedAt
    });

    return true;
  });

export const stopTimeEntry = async (accountId: string, entryId: string) =>
  database.transaction(async (transaction) => {
    const entry = await transaction.findOne(timeEntries, {
      where: { id: entryId, account_id: accountId, status: 'running' }
    });

    if (!entry) return false;

    const endedAt = Temporal.Now.instant().epochMilliseconds;
    const segmentSeconds =
      entry.started_at === null ? 0 : Math.max(0, Math.floor((endedAt - entry.started_at) / 1000));
    const durationSeconds = (entry.duration_seconds ?? 0) + segmentSeconds;

    await transaction.update(timeEntries, entry.id, {
      status: 'completed',
      started_at: entry.created_at,
      ended_at: endedAt,
      duration_seconds: durationSeconds,
      updated_at: endedAt
    });

    return true;
  });
