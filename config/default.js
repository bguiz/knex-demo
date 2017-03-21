'use strict';

const path = require('path');

module.exports = {
	apis: {
		api: {
			available: true,
			persist: {
				knex: {
					client: 'postgresql',
					pool: {
						min: 2,
						max: 10
					},
					debug: true,
					migrations: {
						tableName: 'knex_migrations',
						directory: path.resolve(__dirname, '../packages/api/persist/migrations'),
					},
					seeds: {
						directory: path.resolve(__dirname, '../packages/api/persist/seeds'),
					},
					connection: {
						password: 'api',
						user: 'api',
						name: 'api'
					}
				}
			}
		}
	}
};
