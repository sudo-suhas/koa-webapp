'use strict';

const path = require('path');

const debug = require('debug')('webapp:middleware');

const redis = require('redis'),
    session = require('koa-generic-session'), // https://github.com/koajs/generic-session
    favicon = require('koa-favicon'),
    compress = require('koa-compress'),
    stylus = require('koa-stylus'),
    serve = require('koa-static'),
    convert = require('koa-convert'),
    CSRF = require('koa-csrf').default,
    ratelimit = require('koa-ratelimit'),
    views = require('koa-views'),
    onerror = require('koa-onerror'),
    bodyParser = require('koa-bodyparser'),
    bunyanLogger = require('koa-bunyan-logger'),
    helmet = require('koa-helmet');

const responseTime = require('./response_time'),
    userauth = require('./userauth'),
    config = require('../config'),
    setupAuth = require('../auth'),
    validate = require('./validate');

exports.setupMiddleware = function setupMiddleware(app, passport, logger) {
    debug('Setting up helper middleware');
    app.context.dao = require('../dao');
    app.context.logger = logger;
    app.context.env = config.env;

    // TODO: Pass appropriate options to onerror
    onerror(app);

    app.use(responseTime());

    const ratelimitConfig = config.ratelimit;
    debug('Ratelimit config %j', ratelimitConfig);
    // redis needs to be managed so that it can be shutdown
    ratelimitConfig.db = redis.createClient(ratelimitConfig.redis);
    app.use(convert(ratelimit(ratelimitConfig)));

    // Configure security carefully
    app.use(helmet(config.helmet));

    app.use(compress());

    const { appRoot } = global, publicRoot = path.join(appRoot, 'public');
    app.use(favicon(path.join(publicRoot, 'favicon.ico')));
    app.use(convert(stylus(publicRoot)));
    app.use(serve(publicRoot));

    app.use(bunyanLogger(logger));
    app.use(bunyanLogger.requestIdContext());
    app.use(bunyanLogger.requestLogger());

    app.use(bodyParser({
        limit: '1mb'
    }));

    app.keys = config.appKeys;
    debug('Session config %j', config.session);
    app.use(convert(session(config.session)));

    app.use(new CSRF());

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

// joi validation midleware
exports.validate = validate;
