import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';

import { database } from '../app/db/database.ts';
import { accounts, clients, projects, timeEntries } from '../app/db/schema.ts';

type CsvTimeEntry = {
  workDate: string;
  startedAt: number;
  endedAt: number;
  durationSeconds: number;
  notes: string;
  amountMinor: number;
};

const parseCsv = (source: string) => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < source.length; index++) {
    const character = source[index]!;

    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        field += '"';
        index++;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"') {
      quoted = true;
    } else if (character === ',') {
      row.push(field);
      field = '';
    } else if (character === '\n' || character === '\r') {
      if (character === '\r' && source[index + 1] === '\n') index++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error('The CSV contains an unclosed quoted field.');
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows;
};

const moneyToMinor = (value: string) => {
  const amount = Number(value.replace(/[$,\s]/g, ''));
  if (!Number.isFinite(amount) || amount < 0) throw new Error(`Invalid money amount: ${value}`);
  return Math.round(amount * 100);
};

const parseTimesheetTime = (value: string, fallbackMeridiem?: string) => {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec(value.trim());
  if (!match) throw new Error(`Invalid time: ${value}`);

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = (match[3] ?? fallbackMeridiem)?.toUpperCase();
  if (hour < 1 || hour > 12 || minute > 59 || !meridiem) {
    throw new Error(`Invalid or ambiguous time: ${value}`);
  }

  return (hour % 12) * 60 + minute + (meridiem === 'PM' ? 12 * 60 : 0);
};

const localTimestamp = (date: string, minutesAfterMidnight: number) => {
  const [year, month, day] = date.split('-').map(Number);
  const dateTime = new Date(
    year!,
    month! - 1,
    day!,
    Math.floor(minutesAfterMidnight / 60),
    minutesAfterMidnight % 60
  );
  if (
    Number.isNaN(dateTime.getTime()) ||
    dateTime.getFullYear() !== year ||
    dateTime.getMonth() !== month! - 1 ||
    dateTime.getDate() !== day
  ) {
    throw new Error(`Invalid date: ${date}`);
  }
  return dateTime.getTime();
};

const parseTimesheet = (source: string) => {
  const rows = parseCsv(source.replace(/^\uFEFF/, ''));
  const metadata = new Map<string, string>();

  for (const row of rows) {
    for (let index = 0; index < row.length - 1; index++) {
      const label = row[index]?.trim();
      const value = row[index + 1]?.trim();
      if (label?.endsWith(':') && value) metadata.set(label.slice(0, -1), value);
    }
  }

  const required = (name: string) => {
    const value = metadata.get(name);
    if (!value) throw new Error(`CSV is missing “${name}”.`);
    return value;
  };

  const period = /^(\d{1,2})\/(\d{4})\s*-\s*(\d{1,2})\/(\d{4})$/.exec(required('Billing Period'));
  if (!period) throw new Error('Billing Period must look like M/YYYY - M/YYYY.');

  const startMonth = Number(period[1]);
  const startYear = Number(period[2]);
  const endMonth = Number(period[3]);
  const endYear = Number(period[4]);
  if (startMonth < 1 || startMonth > 12 || endMonth < 1 || endMonth > 12 || endYear < startYear) {
    throw new Error('Billing Period contains an invalid date range.');
  }
  const crossesYear = endYear > startYear || endMonth < startMonth;
  const headerIndex = rows.findIndex(
    (row) => row[0]?.trim() === 'Date' && row[1]?.trim() === 'Task Description'
  );
  if (headerIndex < 0) throw new Error('Could not find the timesheet entry header.');

  const hourlyRateMinor = moneyToMinor(required('Hourly Rate'));
  const hourCap = Number(required('Hour Cap'));
  if (!Number.isFinite(hourCap) || hourCap <= 0)
    throw new Error('Hour Cap must be a positive number.');

  const entries: CsvTimeEntry[] = [];
  for (const row of rows.slice(headerIndex + 1)) {
    if (!row[0]?.trim() || !/^\d{1,2}\/\d{1,2}$/.test(row[0].trim())) continue;

    const [monthText, dayText] = row[0].trim().split('/');
    const month = Number(monthText);
    const day = Number(dayText);
    const year = crossesYear && month < startMonth ? endYear : startYear;
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      throw new Error(`Invalid work date: ${row[0]}`);
    }

    const workDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const start = parseTimesheetTime(row[2] ?? '');
    const end = parseTimesheetTime(row[3] ?? '', /\b(AM|PM)\b/i.exec(row[2] ?? '')?.[1]);
    if (end <= start) throw new Error(`End time must follow start time for ${workDate}: ${row[1]}`);

    const durationSeconds = (end - start) * 60;
    const statedHours = Number(row[4]);
    if (!Number.isFinite(statedHours) || Math.abs(durationSeconds / 3600 - statedHours) > 0.01) {
      throw new Error(`Time values do not match the listed hours for ${workDate}: ${row[1]}`);
    }

    const amountMinor = moneyToMinor(row[5] ?? '');
    const calculatedMinor = Math.round((durationSeconds * hourlyRateMinor) / 3600);
    if (amountMinor !== calculatedMinor) {
      throw new Error(`Listed amount does not match the rate for ${workDate}: ${row[1]}`);
    }

    entries.push({
      workDate,
      startedAt: localTimestamp(workDate, start),
      endedAt: localTimestamp(workDate, end),
      durationSeconds,
      notes: row[1]!.trim(),
      amountMinor
    });
  }

  if (entries.length === 0) throw new Error('The CSV has no time entries.');

  const totalHours = entries.reduce((sum, entry) => sum + entry.durationSeconds, 0) / 3600;
  const totalAmountMinor = entries.reduce((sum, entry) => sum + entry.amountMinor, 0);
  const hourCapMinutes = Math.round(hourCap * 60);
  const invoiceCapMinor = moneyToMinor(required('Max Invoice'));

  return {
    clientName: required('Client Name'),
    projectName: required('Project Name'),
    hourlyRateMinor,
    hourCapMinutes,
    invoiceCapMinor,
    entries,
    totalHours,
    totalAmountMinor
  };
};

const main = async () => {
  const [accountId, csvPath, projectStatus = 'completed', mode] = process.argv.slice(2);
  if (!accountId || !csvPath) {
    throw new Error(
      'Usage: npm run db:import-timesheet -- <account-id> <csv-path> [planned|active|completed|archived] [dry-run]'
    );
  }
  if (!['planned', 'active', 'completed', 'archived'].includes(projectStatus)) {
    throw new Error(`Invalid project status: ${projectStatus}`);
  }
  if (mode && mode !== 'dry-run') throw new Error(`Invalid import option: ${mode}`);

  const account = await database.find(accounts, accountId);
  if (!account) throw new Error(`Workspace not found: ${accountId}`);

  const timesheet = parseTimesheet(await readFile(csvPath, 'utf8'));
  if (mode === 'dry-run') {
    console.log(
      `CSV is valid: ${timesheet.entries.length} entries, ${timesheet.totalHours.toFixed(2)} hours, $${(timesheet.totalAmountMinor / 100).toFixed(2)} work value; project status ${projectStatus}. No data written.`
    );
    return;
  }

  const now = Date.now();
  const clientId = randomUUID();
  const projectId = randomUUID();
  const sortedDates = timesheet.entries.map((entry) => entry.workDate).sort();

  await database.transaction(async (transaction) => {
    const existingClient = await transaction.findOne(clients, {
      where: { account_id: accountId, name: timesheet.clientName }
    });
    const resolvedClientId = existingClient?.id ?? clientId;

    const existingProject = await transaction.findOne(projects, {
      where: { account_id: accountId, client_id: resolvedClientId, name: timesheet.projectName }
    });
    if (existingProject) {
      throw new Error(
        `Project “${timesheet.projectName}” already exists for ${timesheet.clientName}; refusing to duplicate the import.`
      );
    }

    if (!existingClient) {
      await transaction.create(clients, {
        id: clientId,
        account_id: accountId,
        name: timesheet.clientName,
        contact_name: null,
        email: null,
        phone: null,
        notes: null,
        status: 'active',
        hourly_rate_minor: timesheet.hourlyRateMinor,
        currency: 'USD',
        created_at: now,
        updated_at: now
      });
    }

    await transaction.create(projects, {
      id: projectId,
      account_id: accountId,
      client_id: resolvedClientId,
      name: timesheet.projectName,
      description: null,
      notes: null,
      status: projectStatus,
      hour_cap_minutes: timesheet.hourCapMinutes,
      invoice_cap_minor: timesheet.invoiceCapMinor,
      started_on: sortedDates[0]!,
      completed_on: projectStatus === 'completed' ? sortedDates.at(-1)! : null,
      created_at: now,
      updated_at: now
    });

    for (const entry of timesheet.entries) {
      await transaction.create(timeEntries, {
        id: randomUUID(),
        account_id: accountId,
        project_id: projectId,
        work_date: entry.workDate,
        status: 'completed',
        source: 'manual',
        started_at: entry.startedAt,
        ended_at: entry.endedAt,
        duration_seconds: entry.durationSeconds,
        hourly_rate_minor_snapshot: timesheet.hourlyRateMinor,
        currency: 'USD',
        notes: entry.notes,
        created_at: now,
        updated_at: now
      });
    }
  });

  console.log(
    `Imported ${timesheet.entries.length} time entries for ${timesheet.clientName} · ${timesheet.projectName}: ${timesheet.totalHours.toFixed(2)} hours, $${(timesheet.totalAmountMinor / 100).toFixed(2)} work value. No payment record was created.`
  );
};

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
