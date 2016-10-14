'use strict';

const path = require('path');

const debug = require('debug')('webapp:middleware');

const session = require('koa-generic-session'), // https://github.com/koajs/generic-session
    serve = require('koa-static'),
    convert = require('koa-convert'),
    views = require('koa-views'),
    onerror = require('koa-onerror'),
    bodyParser = require('koa-bodyparser'),
    bunyanLogger = require('koa-bunyan-logger'),
    helmet = require('koa-helmet');

const config = require('../config'),
    setupAuth = require('../auth'),
    userauth = require('./userauth'),
    koaStylus = require('./koa_stylus');

exports.setupMiddleware = function setupMiddleware(app, passport, logger) {
    debug('Setting up helper middleware');
    app.context.dao = require('../dao');
    app.context.logger = logger;

    // TODO: Pass appropriate options to onerror
    onerror(app);

    // Configure security carefully
    // https://github.com/krakenjs/lusca/issues/42
    // https://nodesecurity.io/opensource
    // https://blog.liftsecurity.io/2015/01/21/tooling
    // https://github.com/koajs/koa-lusca
    // https://www.npmjs.com/package/xss-filters
    app.use(helmet());

    const { appRoot } = global, publicRoot = path.join(appRoot, 'public');
    app.use(koaStylus(publicRoot));
    app.use(serve(publicRoot));

    app.use(bunyanLogger(logger));
    app.use(bunyanLogger.requestIdContext());
    app.use(bunyanLogger.requestLogger());

    app.use(bodyParser());

    app.keys = config.appKeys;
    debug('Session config %j', config.session);
    app.use(convert(session(config.session)));

    // Setup flash
    // https://github.com/theverything/koa-connect-flash

    setupAuth(app, passport);
    app.use(passport.initialize());
    app.use(passport.session());

    // try to use https://github.com/koajs/userauth here?
    // Require authentication for now
    app.use(userauth);

    debug('Pug config %j', config.pug);
    app.use(views(path.join(appRoot, 'views'), {
        extension: 'pug',
        options: config.pug
    }));
};

// Setup joi validation midleware
