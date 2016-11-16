'use strict';
const debug = require('debug')('webapp:register_view');

module.exports = async function loginView(ctx) {
    debug('Entered register view');
    await ctx.render('register', {
        title: 'Webapp Register',
        env: ctx.env,
        enableVue: true,
        csrf: ctx.csrf,
        vueData: {
            message: '',
            registerForm: {
                _csrf: ctx.csrf,
                email: '',
                name: '',
                password: ''
            }
        }
    });
};
