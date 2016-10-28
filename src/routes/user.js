'use strict';

const debug = require('debug')('webapp:routes:user');

const {
    user: {
        register,
        registerView,
        login,
        loginView,
        logout
    }
} = require('../resources');

const {
    loginSchema
} = require('../schemas');

const { validate } = require('../middleware');

module.exports = function setupUserRoutes(passport, router) {
    debug('Setting up user routes');
    //
    //
    //
    // http://scottksmith.com/blog/2014/05/29/beer-locker-building-a-restful-api-with-node-passport/
    // TODO: Setup joi validation middleware for register, login
    // https://github.com/rkusa/koa-passport/issues/35
    router.post('/register', register(passport));
    router.get('/register', registerView);
    router.get('/login', loginView);
    // Is it possible to chain get and post for given route?
    // Read this - http://stackoverflow.com/questions/15711127/express-passport-node-js-error-handling
    router.post('/login', validate(loginSchema), login(passport));
    router.get('/logout', logout);
};
