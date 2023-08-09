import { Knex } from 'knex';

import Table from '../../resources/enums/Table';
import userRoles from '../data/userRoles.json';

export function seed(knex: Knex): Promise<any> {
  return knex(Table.USER_ROLES).insert(userRoles).onConflict('id').merge();
}
