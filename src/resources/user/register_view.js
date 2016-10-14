'use strict';
const debug = require('debug')('webapp:register_view');

module.exports = async function loginView(ctx) {
    debug('Entered register view');
    await ctx.render('register', { title: 'Register' });
};
