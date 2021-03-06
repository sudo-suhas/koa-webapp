'use strict';
const fs = require('fs'),
    path = require('path');

const bunyan = require('bunyan'),
    redisStore = require('koa-redis');

const loadHelpers = require('../substratum/load_helpers');

const config = {};

const {appRoot} = global,
    logDir = path.join(appRoot, 'logs'),
    pugDir = path.join(appRoot, 'src', 'pug');

/**
 * make a log directory, just in case it isn't there.
 */
try {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
} catch (err) {
    console.error('Could not set up log directory, error was: ', err);
    process.exit(1);
}

config.logger = {
    name: 'webapp',
    streams: [{
        stream: process.stdout,
        level: 'debug'
    }, {
        type: 'rotating-file',
        path: path.join(logDir, 'webapp.log'),
        level: 'info',
        period: '1d',   // daily rotation
        count: 3        // keep 3 back copies
    }],
    serializers: bunyan.stdSerializers
};

config.pug = {
    pretty: true,
    debug: true,
    compileDebug: true,
    cache: false,
    basedir: path.join(appRoot, 'views'),
    globals: [
        {_: require('lodash')},
        loadHelpers(path.join(pugDir, 'helpers'))
    ]
};

const redisConfig = config.redis = {
    host: '127.0.0.1',
    port: 6379
    // Specify db, password
};

// echo "$(< /dev/urandom tr -dc A-Za-z0-9 | head -c 32)"
config.appKeys = ['4bNw69367lUftqWia5e6HQ0F3AGYaAha', 'jr7ne1kyalQlLcVbwAamiFbVMHoar6bz'];

config.session = {
    key: 'bool.sid',
    prefix: 'bool:sess:',
    rolling: 'true',
    store: redisStore(redisConfig),
    cookie: {
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        domain: '',
        secure: true,
        httpOnly: true,
        signed: true
    }
};

config.joiOptions = {
    abortEarly: false,
    convert: true
};

module.exports = config;
