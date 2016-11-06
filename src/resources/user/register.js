'use strict';

const debug = require('debug')('webapp:register');

const passportCallback = require('./passport_callback');

// module.exports = passport => passport.authenticate('local-register', {
//     successRedirect: '/app', // redirect to the secure profile section
//     failureRedirect: '/register', // redirect back to the signup page if there is an error
//     failureFlash: true // allow flash messages
// });

module.exports = passport => async function register(ctx, next) {
    return passport.authenticate('local-register', (err, user, info) => {
        debug('err %j, user %j, info %j', err, user, info);
        passportCallback(err, user, info, ctx, 'Registration', false);
    })(ctx, next);
};
