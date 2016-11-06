'use strict';

const debug = require('debug')('webapp:auth');

const LocalStrategy = require('passport-local').Strategy;

module.exports = function setupAuth(app, passport) {
    // http://toon.io/understanding-passportjs-authentication-flow/
    debug('Setting up auth for passport');
    const userDao = app.context.dao.user;

    /**
     * @param {string} username
     * @param {string} password
     * @param {Function} done
     */
    async function loginVerify(username, password, done) {
        debug('Entered local strategy verification for login');
        // TODO: Check if user is already logged in and take appropriate action
        try {
            const { user, valid, message } = await userDao.verifyCredentials(username, password);
            debug('Validation result from user dao : valid - %s, user %j, message %s', valid, user, message);
            if (valid === true) {
                done(null, user);
            } else {
                done(null, false, { message });
            }
        } catch (err) {
            done(err);
        }
    }

    /**
     * @param {Object} req
     * @param {string} username
     * @param {string} password
     * @param {Function} done
     */
    async function registerVerify(req, username, password, done) {
        debug('Entered local strategy verification for register');
        // TODO: Check if user is already logged in and take appropriate action
        try {
            if (await userDao.getByUserName(username) != null) {
                debug('User with username %s already registered', username);
                // TODO: Use req to flash message here
                done(null, false, { message: 'User already exists with given username' });
            } else {
                const name = req.body.name;
                const user = await userDao.createUser(username, password, name);
                Reflect.deleteProperty(req.body, 'password');
                done(null, user);
            }
        } catch (err) {
            done(err);
        }
    }

    // Probably better to serialize and deserialize entire object of user to avoid DB calls
    // http://stackoverflow.com/questions/28691215/when-is-the-serialize-and-deserialize-passport-method-called-what-does-it-exact
    // http://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
    passport.serializeUser((user, done) => {
        debug('Serializing user %j', user);
        done(null, user.username);
    });

    // This has a negative impact on performance because we need to make a db call
    // for each deserialize. Also, we might need to store more than just the user
    // details in session. If we simply store everything in session, it could be a
    // problem for sensitive data.
    passport.deserializeUser((username, done) => {
        debug('Deserializing user for id %j', username);
        try {
            const user = userDao.getByUserName(username);
            done(null, user);
        } catch (err) {
            done(err);
        }

    });

    // https://github.com/rkusa/koa-passport-example/issues/2
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: false
    }, loginVerify));

    passport.use('local-register', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, registerVerify));
};
