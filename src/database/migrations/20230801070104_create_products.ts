import { Knex } from 'knex';

import Table from '../../resources/enums/Table';
import { onUpdateTrigger } from '../../utils/knex';

export function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable(Table.PRODUCTS, (table: Knex.TableBuilder) => {
      table.increments('id').primary();
      table.string('title', 500).notNullable();
      table.integer('price').notNullable();
      table.integer('quantity').notNullable().defaultTo(0);
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable(Table.USERS);

      table.timestamps(true, true);
    })
    .then(() => knex.raw(onUpdateTrigger(Table.PRODUCTS)));
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(Table.PRODUCTS);
}
