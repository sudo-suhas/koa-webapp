'use strict';

const doT = require('dot');

const DEFAULT = 1000,
    INVALID_VALUE = 1001,
    INVALID_PATTERN = 1002,
    MISSING_VALUE = 1003,
    CONN_ERROR = 2000;

/* eslint-disable func-style*/
/**
 * Generate doT compatible interpolation string
 * @param {string} field
 * @returns {string} interpolation representation for doT
 */
const iDot = function dotInterpolate(field) {
    return `{{=it.${field}}}`;
};

/**
 * Generate doT compatible interpolation string with single quotes
 * @param {string} field
 * @returns {string} interpolation representation for doT
 */
const iDotQ = function dotInterpolateQuoted(field) {
    return `'${iDot(field)}'`;
};
/* eslint-enable func-style*/

const errPathStr = iDotQ('err.path');

const ERROR_CODE_MAP = {
    UNKNOWN: DEFAULT,
    'joi-string.regex.name': INVALID_PATTERN,
    'joi-string.email': INVALID_VALUE,
    'joi-any.required': MISSING_VALUE,
    'joi-string.min': INVALID_VALUE,
    ECONNREFUSED: CONN_ERROR,
    ER_NO_DEFAULT_FOR_FIELD: INVALID_VALUE
};

const ERROR_MESSAGES = {};
ERROR_MESSAGES[DEFAULT] = doT.template('Something went wrong.');
ERROR_MESSAGES[CONN_ERROR] = doT.template('Connection error.');
ERROR_MESSAGES[INVALID_VALUE] = doT.template(`Input for ${errPathStr} not valid.`);
ERROR_MESSAGES[INVALID_PATTERN] = doT.template(`Input for ${errPathStr} does not match required pattern.`);
ERROR_MESSAGES[MISSING_VALUE] = doT.template(`Input for field ${errPathStr} is required.`);

const ADDITIONAL_INFO = {};
ADDITIONAL_INFO['string.min'] = doT.template(`Input for ${errPathStr} too short.` +
    ` ${errPathStr} needs to be at least ${iDot('err.context.limit')} characters long`);
ADDITIONAL_INFO['string.regex.name'] = doT.template(`${errPathStr} should satisfy ${iDotQ('err.context.name')}`);

exports.DEFAULT_ERR_CODE = DEFAULT;
exports.ERROR_CODE_MAP = ERROR_CODE_MAP;
exports.ADDITIONAL_INFO = ADDITIONAL_INFO;
exports.ERROR_MESSAGES = ERROR_MESSAGES;
