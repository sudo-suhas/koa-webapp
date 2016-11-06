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
        debug('Path %s requires authentication', ctx.path);
        if (ctx.isAuthenticated()) {
            return await next();
        }
        if (ctx.method === 'GET' && ctx.path !== '/logout') {
            ctx.session.redirectUrl = ctx.url;
        }
        return ctx.redirect('/login');
    }
    debug('Path %s does not require authentication', ctx.path);
    await next();
};
