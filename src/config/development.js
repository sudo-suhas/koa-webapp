'use strict';
const path = require('path');

const bunyan = require('bunyan'),
    redisStore = require('koa-redis'); // https://github.com/koajs/koa-redis

const loadHelpers = require('../substratum/load_helpers');

const config = {};

const { appRoot } = global, logDir = path.join(appRoot, 'logs'),
    pugDir = path.join(appRoot, 'src', 'pug');

config.logger = {
    name: 'webapp',
    streams: [{
        stream: process.stdout,
        level: 'debug'
    }, {
        type: 'rotating-file',
        path: path.join(logDir, 'webapp.log'),
        level: 'info',
        period: '1d', // daily rotation
        count: 3 // keep 3 back copies
    }],
    // WARNING: Determining the call source info is slow. Never use this option in production.
    src: true,
    serializers: bunyan.stdSerializers
};

config.pug = {
    pretty: true,
    debug: true,
    compileDebug: true,
    cache: false,
    basedir: path.join(appRoot, 'views'),
    globals: [
        { _: require('lodash') },
        loadHelpers(path.join(pugDir, 'helpers'))
    ]
};

config.knexReader = {
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'myuser',
        password: 'mypass',
        database: 'my_db',
        timezone: 'utc',
        charset: 'utf8'
    },
    debug: true,
    pool: { min: 2, max: 10 },
    acquireConnectionTimeout: 10000
};

config.logDb = {
    host: 'localhost',
    user: 'myuser',
    password: 'mypass',
    database: 'my_db',
    timezone: 'utc',
    charset: 'utf8'
};

const redisConfig = config.redis = {
    host: '127.0.0.1',
    port: 6379
        // Specify db, password
};

// echo "$(< /dev/urandom tr -dc A-Za-z0-9 | head -c 32)"
config.appKeys = ['7j7voPRVXErLoMzCCBDQBVjqpkXuAzZd', '5UTkz12iWpzNFepKKRiZEEBde4FzQs9S'];

config.session = {
    key: 'bool.sid',
    prefix: 'bool:sess:',
    rolling: 'true',
    store: redisStore(redisConfig),
    cookie: {
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        domain: '',
        secure: false,
        httpOnly: true,
        signed: true
    }
};

module.exports = config;
