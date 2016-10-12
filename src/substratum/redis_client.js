'use strict';
// eslint-disable-next-line
const Promise = require('bluebird'),
    redis = Promise.promisifyAll(require('redis'));

const config = require('../config'),
    logger = require('./logger');

const client = redis.createClient(config.redis);

let clientReady = false; // eslint-disable-line no-unused-vars

client.on('ready', () => {
    clientReady = true;
    logger.info('Redis client now ready.');
});

/**
 * @param {Error} err
 */
function onRedisClientError(err) {
    logger.error(err);
    clientReady = false;
}

client.on('error', onRedisClientError);

/**
 *
 */
exports.close = function close() {
    clientReady = false;
    client.end(true);
    client.unref();
};
