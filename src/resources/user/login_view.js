'use strict';
const debug = require('debug')('webapp:login_view');

module.exports = async function loginView(ctx) {
    debug('Entered login view');
    await ctx.render('login', {
        title: 'Webapp Login',
        env: ctx.env,
        enableVue: true,
        csrf: ctx.csrf,
        // Required? Could make this part of login.js
        vueData: {
            message: '',
            loginForm: {
                _csrf: ctx.csrf,
                email: '',
                password: ''
            }
        }
    });
};
