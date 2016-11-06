'use strict';

const { util } = require('src/substratum');

/**
 * Callback after passport local strategy
 * @param {Error} err
 * @param {Object|boolean} user
 * @param {Object} info
 * @param {any} ctx
 * @param {string} action
 * @param {boolean} redirection
 * @returns {undefined}
 */
module.exports = function passportCallback(err, user, info, ctx, action, redirection) {
    if (err) {
        // Doesn't work :(
        // ctx.throw(500, 'Error', err);
        util.internalServerError(ctx, 500, err);
        return;
    }

    if (user == null || user === false) {
        // Check number of invalid attempts and show captcha
        ctx.status = 401;
        ctx.body = {
            success: false,
            message: info.message,
            error: false
        };
        return;
    }

    const body = {
        success: true,
        message: `${action} successful!`,
        error: false
    };

    if (redirection === true) {
        let redirectUrl = '/app'; // default path
        if (ctx.session.redirectUrl) {
            redirectUrl = `${ctx.session.redirectUrl}`;
            Reflect.deleteProperty(ctx.session, 'redirectUrl');
        }
        body.response = {
            redirectUrl
        };
    }

    ctx.body = body;
    ctx.login(user);
};
