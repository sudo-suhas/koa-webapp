'use strict';

const debug = require('debug')('webapp:routes:user');

const {user} = require('../resources');

module.exports = function setupUserRoutes(passport, router) {
    debug('Setting up user routes');
    // http://stackoverflow.com/questions/32398120/passport-allow-sign-up-with-name-and-email-address-local-strategy
    // http://stackoverflow.com/questions/29838952/how-to-fix-typeerror-cannot-read-property-authenticate-of-undefined-passportj
    // http://code.runnable.com/VKHrGJKvwo55gHL7/express-passport-js-login-and-register-for-node-js-and-hello-world
    // http://scottksmith.com/blog/2014/05/29/beer-locker-building-a-restful-api-with-node-passport/
    // router.get('/register', user.registerView);
    // TODO: Setup joi validation middleware for register, login
    router.post('/register', user.register(passport));
    // router.get('/login', user.loginView);
    // Is it possible to chain get and post for given route?
    router.post('/login', user.login(passport));
    router.get('/logout', user.logout);
};
