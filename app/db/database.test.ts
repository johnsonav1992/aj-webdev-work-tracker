import * as assert from 'remix/assert';
import { DatabaseSync } from 'node:sqlite';
import { describe, it } from 'remix/test';
import { createSqliteDatabase } from 'remix/data-table/sqlite';
import { loadMigrations } from 'remix/data-table/migrations/node';

describe('local SQLite database', () => {
  it('creates the work tracker schema and enforces foreign keys', async () => {
    const sqlite = new DatabaseSync(':memory:');
    sqlite.exec('pragma foreign_keys = on');
    const database = createSqliteDatabase(sqlite);

    try {
      const migrations = await loadMigrations(`${import.meta.dirname}/migrations`);
      await database.migrate(migrations);

      const tables = sqlite
        .prepare("select name from sqlite_master where type = 'table'")
        .all()
        .map((row) => row.name);

      assert.ok(tables.includes('accounts'));
      assert.ok(tables.includes('users'));
      assert.ok(tables.includes('clients'));
      assert.ok(tables.includes('projects'));
      assert.ok(tables.includes('time_entries'));
      assert.ok(tables.includes('payments'));
      assert.throws(() => {
        sqlite
          .prepare(
            `insert into clients (
              id, account_id, name, status, currency, created_at, updated_at
            ) values (?, ?, ?, ?, ?, ?, ?)`
          )
          .run('client-id', 'missing-account', 'Example Client', 'active', 'USD', 1, 1);
      });
    } finally {
      sqlite.close();
    }
  });
});
