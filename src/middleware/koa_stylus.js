'use strict';
const debug = require('debug')('webapp:middleware:koa_stylus');

const stylus = require('stylus');

/**
 * @param {object} options
 * @returns {Function}
 */
module.exports = function koaStylus(options) {
    const middleware = stylus.middleware(options);

    function compile(req, res) {
        return callback => {
            middleware(req, res, callback);
        };
    }

    return async function stylusMiddleware(ctx, next) {
        debug('Entered koaStylus middleware');
        compile(ctx.req, ctx.res);
        return await next();
    };
};
