import { Auth } from 'remix/middleware/auth';
import { getCsrfToken } from 'remix/middleware/csrf';
import { createController } from 'remix/router';

import { requireAppAuth } from '#app/middleware/auth.server.ts';
import {
  createManualTimeEntry,
  getTimePageData,
  pauseTimeEntry,
  resumeTimeEntry,
  startTimeEntry,
  stopTimeEntry
} from '#app/db/time-entries.ts';
import { routes } from '#app/routes.ts';
import { Temporal } from '#app/utils/temporal.ts';
import { TimePage } from './components/time-page.tsx';

const redirectHome = (context: { url: URL }) =>
  Response.redirect(new URL(routes.home.href(), context.url), 303);

const redirectTimeWithError = (context: { url: URL }, error: 'invalid' | 'project') => {
  const url = new URL(routes.time.index.href(), context.url);
  url.searchParams.set('error', error);

  return Response.redirect(url, 303);
};

const parseManualEntry = (formData: FormData) => {
  const projectId = String(formData.get('projectId') ?? '').trim();
  const rawDate = String(formData.get('workDate') ?? '').trim();
  const rawHours = String(formData.get('hours') ?? '').trim();
  const rawMinutes = String(formData.get('minutes') ?? '').trim();
  const notes = String(formData.get('notes') ?? '')
    .slice(0, 2000)
    .trim();

  if (!projectId || !/^\d+$/.test(rawHours) || !/^\d+$/.test(rawMinutes)) return null;

  let workDate: string;

  try {
    workDate = Temporal.PlainDate.from(rawDate).toString();
  } catch {
    return null;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(rawDate) || workDate !== rawDate) return null;

  const hours = Number(rawHours);
  const minutes = Number(rawMinutes);
  const durationSeconds = (hours * 60 + minutes) * 60;

  if (
    !Number.isSafeInteger(hours) ||
    !Number.isSafeInteger(minutes) ||
    minutes > 59 ||
    durationSeconds < 60 ||
    durationSeconds > 2_147_483_647
  ) {
    return null;
  }

  return { projectId, workDate, durationSeconds, notes };
};

export const timeController = createController(routes.time, {
  middleware: [requireAppAuth],
  actions: {
    index: async (context) => {
      const auth = context.get(Auth);
      const data = await getTimePageData(auth.identity.accountId);
      const requestedError = context.url.searchParams.get('error');
      const error =
        requestedError === 'invalid' || requestedError === 'project' ? requestedError : null;

      return context.render(
        <TimePage
          csrfToken={getCsrfToken(context)}
          today={Temporal.Now.plainDateISO().toString()}
          data={data}
          error={error}
        />
      );
    },
    create: async (context) => {
      const auth = context.get(Auth);
      const input = parseManualEntry(context.get(FormData) ?? new FormData());

      if (!input) return redirectTimeWithError(context, 'invalid');

      const created = await createManualTimeEntry(auth.identity.accountId, input);

      if (!created) return redirectTimeWithError(context, 'project');

      return Response.redirect(new URL(routes.time.index.href(), context.url), 303);
    },
    start: async (context) => {
      const auth = context.get(Auth);

      const formData = context.get(FormData) ?? new FormData();
      const projectId = String(formData.get('projectId') ?? '').trim();
      const notes = String(formData.get('notes') ?? '').slice(0, 2000);

      if (projectId) await startTimeEntry(auth.identity.accountId, projectId, notes);

      return redirectHome(context);
    },
    pause: async (context) => {
      const auth = context.get(Auth);

      const formData = context.get(FormData) ?? new FormData();
      const entryId = String(formData.get('entryId') ?? '').trim();

      if (entryId) await pauseTimeEntry(auth.identity.accountId, entryId);

      return redirectHome(context);
    },
    resume: async (context) => {
      const auth = context.get(Auth);

      const formData = context.get(FormData) ?? new FormData();
      const entryId = String(formData.get('entryId') ?? '').trim();

      if (entryId) await resumeTimeEntry(auth.identity.accountId, entryId);

      return redirectHome(context);
    },
    stop: async (context) => {
      const auth = context.get(Auth);

      const formData = context.get(FormData) ?? new FormData();
      const entryId = String(formData.get('entryId') ?? '').trim();

      if (entryId) await stopTimeEntry(auth.identity.accountId, entryId);

      return redirectHome(context);
    }
  }
});
