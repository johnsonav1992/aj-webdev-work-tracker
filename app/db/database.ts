import { resolve } from 'node:path';
import { createSqliteDatabase } from 'remix/data-table/sqlite';

const filename =
  process.env.DATABASE_URL ?? resolve(import.meta.dirname, '../../db/work-tracker.sqlite');

export const database = createSqliteDatabase({
  filename,
  foreignKeys: true,
  busyTimeout: 5000
});
