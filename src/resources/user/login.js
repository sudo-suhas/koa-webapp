'use strict';

const debug = require('debug')('webapp:login');

const passportCallback = require('./passport_callback');

// module.exports = passport => passport.authenticate('local-login', {
//     successRedirect: '/app', // redirect to the secure profile section
//     failureRedirect: '/login', // redirect back to the signup page if there is an error
//     failureFlash: true // allow flash messages
// });

module.exports = passport => async function login(ctx, next) {
    return passport.authenticate('local-login', (err, user, info) => {
        debug('err %j, user %j, info %j', err, user, info);
        passportCallback(err, user, info, ctx, 'Login', true);
    })(ctx, next);
};
