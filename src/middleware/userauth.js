'use strict';
const debug = require('debug')('webapp:middleware:userauth');

// TODO: Check that the regex is not vulnerable
const authRegex = /^(?!(\/login|\/register)).*$/i;
/**
 * @param {Object} ctx
 * @param {Function} next
 * @returns {Promise}
 */
module.exports = async function userauth(ctx, next) {
    debug('Entered userauth middleware');
    if (authRegex.test(ctx.path)) {
        debug('Path requires authentication');
        if (ctx.isAuthenticated()) {
            return await next();
        }
        return ctx.redirect('/login');
    }
    debug('Path does not require authentication');
    return await next();
};
