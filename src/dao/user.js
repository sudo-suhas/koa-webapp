'use strict';

const debug = require('debug')('webapp:dao:user');

const Promise = require('bluebird'); // eslint-disable-line no-shadow

const bcrypt = Promise.promisifyAll(require('bcrypt'));

/**
 * @param {string} username
 * @returns {{username: *, password: *}}
 */
async function getByUserNameInternal(username) {
    // Use different account for reading and writing to database?
    debug('Getting user details for username %s', username);
    const salt = await bcrypt.genSaltAsync(10);
    const hash = await bcrypt.hashAsync(username, salt);
    return {
        username,
        password: hash
    };
}

exports.getByUserName = async function getByUserName(username) {
    const user = await getByUserNameInternal(username);
    // Never expose password outside of this module
    Reflect.deleteProperty(user, 'password');
    return user;
};

exports.verifyCredentials = async function verifyCredentials(username, password) {
    debug('Validating credentials for username %s, password %s', username, password);

    let valid = false,
        message = 'Incorrect username or password';

    const user = await getByUserNameInternal(username);

    if (user == null) {
        debug('User not found for username %s', username);
        return {valid, message};
    }

    // https://crackstation.net/hashing-security.htm
    const res = await bcrypt.compareAsync(password, user.password);

    if (res === false) {
        debug('Password %s incorrect for username %s', password, username);
        return {valid, message};
    }

    debug('Credentials valid.');
    Reflect.deleteProperty(user, 'password');
    valid = true;
    message = 'Valid username and password';
    return {user, valid, message};
};

exports.createUser = async function createUser(username, password, name) {
    debug('Creating user account for %s with username %s and password %s', name, username, password);
};
