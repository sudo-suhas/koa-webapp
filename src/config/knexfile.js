'use strict';

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
        debug: true,
        pool: { min: 2, max: 5 },
        acquireConnectionTimeout: 10000,
        migrations: {
            directory: 'src/.knex/migrations',
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: 'src/.knex/seeds/dev'
        }
    }

};
