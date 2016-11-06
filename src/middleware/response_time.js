'use strict';
const debug = require('debug')('webapp:middleware:response_time');

/**
 * Add X-Response-Time header field.
 *
 * @return {Function}
 * @api public
 */
// src code - https://github.com/koajs/koa-rt
module.exports = function responseTime({ timer = Date, headerName = 'X-Response-Time' } = {}) {
    return async function responseTimeMiddleware(ctx, next) {
        const start = timer.now();
        await next();
        const delta = timer.now() - start;
        ctx.set(headerName, delta);
        debug('Time taken for response - %s ms', delta);
    };
};
