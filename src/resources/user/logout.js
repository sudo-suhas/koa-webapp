'use strict';
const debug = require('debug')('webapp:logout');

module.exports = function logout(ctx) {
    debug('Logging out user');
    ctx.logout();
    ctx.redirect('/');
};
