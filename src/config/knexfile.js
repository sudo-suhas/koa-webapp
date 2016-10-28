'use strict';

const path = require('path');

const knexDir = path.resolve(__dirname, '..', '.knex');

module.exports = {

    development: {
        client: 'mysql2',
        connection: {
            host: 'localhost',
            user: 'myuser',
            password: 'mypass',
            database: 'my_db',
            timezone: 'utc',
            charset: 'utf8'
        },
        debug: false,
        pool: { min: 2, max: 5 },
        acquireConnectionTimeout: 10000,
        migrations: {
            directory: path.join(knexDir, 'migrations'),
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: path.join(knexDir, 'seeds', 'dev')
        }
    }

};
