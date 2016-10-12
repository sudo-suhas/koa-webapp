'use strict';

const debug = require('debug')('webapp:routes');

const setupUserRoutes = require('./user');

module.exports = function setupRoutes(app, passport, router) {
    debug('Setting up application routes');

    // Register GET/POST, login GET/POST do not need authentication
    // Except logout. So handle it locally in logout
    setupUserRoutes(passport, router);

    // mount root routes
    app.use(router.routes());
    app.use(router.allowedMethods({
        'throw': true,
        notImplemented: () => {
            // TODO: Implement `notImplemented`
            debug('Route not implemented');
        },
        methodNotAllowed: () => {
            // TODO: Implement `methodNotAllowed`
            debug('Method not allowed');
        }
    }));
};
