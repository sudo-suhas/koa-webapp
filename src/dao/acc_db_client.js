'use strict';

const config = require('../config');

const { logger } = require('../substratum');

const reader = require('knex')(config.knexReader),
    writer = require('knex')(config.knexWriter);

exports.reader = reader;
exports.writer = writer;

/**
 * @param {Error} err
 * @param {Object} obj
 */
function logQueryError(err, obj) {
    logger.error(err, obj);
}

reader.on('query-error', logQueryError);
writer.on('query-error', logQueryError);

// http://www.dancorman.com/knex-your-sql-best-friend/
writer.migrate.latest([config.knexfile]);

exports.close = function close() {
    reader.destroy();
    writer.destroy();
};
