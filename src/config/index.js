'use strict';

const debug = require('debug')('webapp:config');

const fs = require('fs'),
    path = require('path');

const logDir = path.join(global.appRoot, 'logs');

/**
 * make a log directory, just in case it isn't there.
 */
try {
    if (!fs.existsSync(logDir)) {
        debug('Creating log directory %s', logDir);
        fs.mkdirSync(logDir);
    }
} catch (err) {
    console.error('Could not set up log directory, error was: ', err);
    process.exit(1);
}

const nodeEnv = process.env.NODE_ENV;
debug('Node enviroment - %s', nodeEnv);
let config;
switch (nodeEnv) {

    case 'staging':
        config = require('./staging');
        break;

    case 'production':
        config = require('./production');
        break;

    default: // case 'development':
        config = require('./development');

}

config.env = nodeEnv;

config.joiOptions = {
    abortEarly: false,
    convert: true
};

config.knexfile = require('./knexfile');

config.knexWriter = config.knexfile[nodeEnv];

module.exports = config;
