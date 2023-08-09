import { Knex } from 'knex';
import Table from '../../resources/enums/Table';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(Table.USERS, (table: Knex.TableBuilder) => {
    table
      .integer('role_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(Table.USER_ROLES)
      .defaultTo(2);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(Table.USERS, (table) => {
    table.dropColumn('role_id');
  });
}
