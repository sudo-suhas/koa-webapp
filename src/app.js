'use strict';
require('babel-register')({
    plugins: ['transform-async-to-generator']
});

const path = require('path');

const debug = require('debug')('webapp:app');

global.appRoot = path.resolve(__dirname, '..');
debug('App root resolved to %s', global.appRoot);

const Koa = require('koa'),
    passport = require('koa-passport');

const router = require('koa-router')();

const substratum = require('./substratum'),
    setupRoutes = require('./routes'),
    setupMiddleware = require('./middleware');

const {logger} = substratum;

const app = new Koa();

setupMiddleware(app, passport, logger);
setupRoutes(app, passport, router);

// log error
app.on('error', (err, ctx) => {
    // logger.error(err);
    logger.error('server error', err, ctx);
});

module.exports = app;
