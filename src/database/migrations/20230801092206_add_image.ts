import { Knex } from 'knex';

import Table from '../../resources/enums/Table';
import { onUpdateTrigger } from '../../utils/knex';

export function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable(Table.IMAGES, (table: Knex.TableBuilder) => {
      table.increments('id').primary();
      table.string('filename').notNullable();
      table.string('path').notNullable();
      table.string('mimetype').notNullable();
      table.integer('size').notNullable();
      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable(Table.PRODUCTS);

      table.timestamps(true, true);
    })
    .then(() => knex.raw(onUpdateTrigger(Table.IMAGES)));
}

export function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(Table.IMAGES);
}
