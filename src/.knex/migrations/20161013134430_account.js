exports.up = function up(knex, Promise) {
    return Promise.all([

        knex.schema.createTable('users', (table) => {
            table.increments('id').primary();
            table.string('username').unique();
            table.string('password').notNullable();
            table.string('name').notNullable();
            table.timestamp('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP')); // now(), knex.fn.now()?
            table.timestamp('updated_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            table.engine('InnoDB');
            table.charset('utf8');
        })

    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([

        knex.schema.dropTable('users')

    ]);
};
