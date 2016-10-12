'use strict';
const debug = require('debug')('webapp:login');

module.exports = function login(passport) {
    return (ctx, next) => {
        debug('Trying to login user');
        // Use {
        //     successRedirect: '/app',
        //         failureRedirect: '/login'
        // } instead of custom handle?
        // redirect to login on failure
        // https://github.com/rkusa/koa-passport/issues/35
        // Use failureFlash
        // Read this - http://stackoverflow.com/questions/15711127/express-passport-node-js-error-handling
        // passport.authenticate('local-signup', {
        //     successRedirect : '/profile', // redirect to the secure profile section
        //     failureRedirect : '/signup', // redirect back to the signup page if there is an error
        //     failureFlash : true // allow flash messages
        // })
        // Add successFlash here?
        return passport.authenticate('local-login', (err, user, info, status) => {
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
