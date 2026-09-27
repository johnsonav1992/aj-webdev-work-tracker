import { Auth } from 'remix/middleware/auth';
import { createController } from 'remix/router';

import { requireAppAuth } from '#app/middleware/auth.server.ts';
import {
  pauseTimeEntry,
  resumeTimeEntry,
  startTimeEntry,
  stopTimeEntry
} from '#app/db/time-entries.ts';
import { routes } from '#app/routes.ts';

const redirectHome = (context: { url: URL }) =>
  Response.redirect(new URL(routes.home.href(), context.url), 303);

export const timeController = createController(routes.time, {
  middleware: [requireAppAuth],
  actions: {
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
