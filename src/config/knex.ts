import { Knex, knex } from 'knex';

import config from '../config/config';

const dbConfig: Knex.Config = config.db;

export default knex(dbConfig);
