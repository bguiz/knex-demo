'use strict';

const config = require('config');
const knex = require('knex');
const righto = require('righto');

const migrations = Object.keys(config.apis)
// .filter((apiName) => {
// 	return apiName === 'api';
// })
.map((apiName) => {
	const apiConfig = config.apis[apiName];
	return Object.assign({ name: apiName }, apiConfig);
}).filter((apiConfig) => {
	return (apiConfig.available === true) &&
		(apiConfig.persist && apiConfig.persist.knex);
}).map((apiConfig) => {
	const knexConfig = apiConfig.persist.knex;
	const knexInstance = knex(knexConfig);
	return {
		name: apiConfig.name,
		knexInstance,
		knexConfig,
	};
});

process.stdout.write('\nKnex migrations commencing\n');
righto.iterate(function* (reject) {
	let err;
	let result;
	for (let i = 0; i < migrations.length; ++i) {
		const migration = migrations[i];
		process.stdout.write(`\nKnex migration for ${migration.name} commencing\n`);
		console.log(migration.knexConfig);
		const migrationErrback = (errback) => {
			migration.knexInstance.migrate
				.latest(migration.knexConfig.migrations)
				.then(() => {
					return migration.knexInstance.seed.run();
				})
				.then((result) => {
					errback(undefined, result);
				})
				.catch(errback);
		}

		[err, result] = yield righto.surely(migrationErrback);
		if (err) {
			process.stderr.write(err.toString());
			process.stderr.write(`\nKnex migration for ${migration.name} failed\n`);
			reject(err);
			return;
		}
		process.stdout.write(`\nKnex migration for ${migration.name} complete\n`);
	}
})((err) => {
	if (err) {
		process.stderr.write(err.toString());
		process.stderr.write('\nKnex migrations failed\n');
		process.exit(-1);
		return;
	}
	process.stdout.write('\nKnex migrations complete\n');
	process.exit(0);
});
