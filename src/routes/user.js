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
    loginSchema,
    registerSchema
} = require('../schemas');

const { validate } = require('../middleware');

module.exports = function setupUserRoutes(passport, router) {
    debug('Setting up user routes');
    // http://scottksmith.com/blog/2014/05/29/beer-locker-building-a-restful-api-with-node-passport/
    // https://github.com/rkusa/koa-passport/issues/35
    router
        .get('/register', registerView)
        .post('/register', validate(registerSchema), register(passport));

    // Read this - http://stackoverflow.com/questions/15711127/express-passport-node-js-error-handling
    router
        .get('/login', loginView)
        .post('/login', validate(loginSchema), login(passport));

    router.get('/logout', logout);
};
