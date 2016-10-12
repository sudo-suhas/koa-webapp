'use strict';
const debug = require('debug')('webapp:register');

module.exports = function register(passport) {
    return (ctx, next) => {
        debug('Trying to register user');
        // Use {
        //     successRedirect: '/app',
        //         failureRedirect: '/register'
        // } instead of custom handle?
        // redirect to register on failure
        // https://github.com/rkusa/koa-passport/issues/35
        // Use failureFlash
        return passport.authenticate('local-register', (err, user, info, status) => {
            debug('err %j, user %j, info %j, status %j', err, user, info, status);
            if (err != null || user == null || user === false) {
                ctx.status = 401;
                ctx.body = { success: false };
            } else {
                ctx.body = { success: true };
                return ctx.login(user);
            }
        })(ctx, next);
    };
};
