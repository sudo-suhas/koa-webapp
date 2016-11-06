'use strict';

const debug = require('debug')('webapp:dao:user');

const Promise = require('bluebird'); // eslint-disable-line no-shadow

const bcrypt = Promise.promisifyAll(require('bcrypt'));

const { reader, writer } = require('./acc_db_client');

const _USER_COLUMNS = ['username', 'password', 'name'],
    USER_COLUMNS = ['username', 'name'];

/**
 * @param {string} username
 * @param {Array} columns
 * @returns {{username: string, name: string}}
 */
async function _getUser(username, columns) {
    debug('Getting user details for username %s', username);
    let userArr;
    let tries = 0;
    // eslint-disable-next-line
    while (tries < 3) {
        try {
            userArr = await reader.select(columns).from('users').where({ username });
            break;
        } catch (err) {
            tries++;
            if (tries >= 3) {
                throw err;
            }
            debug(err);
        }
    }

    if (userArr && userArr.length > 0) {
        return userArr[0];
    }
    return null;
}

exports.getByUserName = async function getByUserName(username) {
    return await _getUser(username, USER_COLUMNS);
};

exports.verifyCredentials = async function verifyCredentials(username, password) {
    debug('Validating credentials for username %s, password %s', username, password);

    let valid = false,
        message = 'Incorrect username or password';
    const user = await _getUser(username, _USER_COLUMNS);
    debug('User %j', user);
    if (user == null) {
        debug('User not found for username %s', username);
        return { valid, message };
    }
    // https://crackstation.net/hashing-security.htm
    const res = await bcrypt.compareAsync(password, user.password);
    if (res === false) {
        debug('Password %s incorrect for username %s', password, username);
        return { valid, message };
    }
    debug('Credentials valid.');
    Reflect.deleteProperty(user, 'password');
    valid = true;
    message = 'Valid username and password';
    return { user, valid, message };
};

exports.createUser = async function createUser(username, password, name) {
    debug('Creating user account for %s with username %s and password %s', name, username, password);
    // Check and throw for username already exists?
    const salt = await bcrypt.genSaltAsync(10);
    const hash = await bcrypt.hashAsync(password, salt);
    debug('Password hash - %s', hash);
    const user = { username, password: hash, name };
    await writer('users').insert(user);
    Reflect.deleteProperty(user, password);
    return user;
};
