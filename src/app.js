'use strict';
require('babel-register')({
    plugins: ['transform-async-to-generator']
});

const debug = require('debug')('webapp:app');

const path = require('path');

global.appRoot = path.resolve(__dirname, '..');
debug('App root resolved to %s', global.appRoot);

const Koa = require('koa'),
    passport = require('koa-passport');

const setupRoutes = require('./routes');

const { logger } = require('./substratum'), { setupMiddleware } = require('./middleware');

const app = new Koa();

setupMiddleware(app, passport, logger);
setupRoutes(app, passport);

// log error
app.on('error', (err, ctx) => {
    // logger.error(err);
    logger.error('server error', err, ctx);
});

module.exports = app;
