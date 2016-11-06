'use strict';
const debug = require('debug')('webapp:login_view');

module.exports = async function loginView(ctx) {
    debug('Entered login view');
    await ctx.render('login', {
        title: 'Webapp Login',
        csrf: ctx.csrf
    });
};
