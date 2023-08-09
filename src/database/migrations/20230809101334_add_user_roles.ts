import { Knex } from 'knex';

import Table from '../../resources/enums/Table';
import { onUpdateTrigger } from '../../utils/knex';

/**
 * Add user_roles table.
 *
 * @param {Knex} knex
 */
export function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable(Table.USER_ROLES, (table: Knex.TableBuilder) => {
      table.increments('id').primary();

      table.string('name').unique().notNullable();
      table.string('description').nullable();

      table.timestamps(true, true);
    })
    .then(() => knex.raw(onUpdateTrigger(Table.USER_ROLES)));
}

/**
 * Drop user_roles table.
 *
 * @param {Knex} knex
 */
export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(Table.USER_ROLES);
}
