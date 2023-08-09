import { Knex } from 'knex';

import Table from '../../resources/enums/Table';
import { onUpdateTrigger } from '../../utils/knex';

export function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable(Table.USERS, (table: Knex.TableBuilder) => {
      table.increments('id').primary();
      table.string('name', 128).notNullable();
      table.string('email', 128).unique().notNullable();
      table.string('password', 128).notNullable();

      table.timestamps(true, true);
    })
    .then(() => knex.raw(onUpdateTrigger(Table.USERS)));
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(Table.USERS);
}
