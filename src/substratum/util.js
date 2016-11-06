'use strict';

const debug = require('debug')('webapp:substratum:util');

const _ = require('lodash');

const {
    ERROR_CODE_MAP,
    ADDITIONAL_INFO,
    DEFAULT_ERR_CODE,
    ERROR_MESSAGES
} = require('./consts');

/**
 * Extract additional error info from joi error object
 * @param {any} err - Joi error object
 * @returns {string} additional info parsed from error object
 */
function additionalInfo(err) {
    if (ADDITIONAL_INFO.hasOwnProperty(err.type)) {
        return ` ${ADDITIONAL_INFO[err.type]({err})}`;
    }
}

/**
 * Parses error info from joi error object
 * @param {any} err
 * @param {any} [details={ field: err.path, errors: [], errCodes: [] }]
 * @returns {any} [details={ field: err.path, errors: [], errCodes: [] }]
 */
exports.parseDetails = function parseDetails(err, details = {
    field: err.path,
    errors: [],
    errCodes: []
}) {
    debug('err - %j, details - %j', err, details);
    const errType = `joi-${err.type}`;
    if (ERROR_CODE_MAP.hasOwnProperty(errType)) {
        const errCode = ERROR_CODE_MAP[errType];
        if (details.errCodes.indexOf(errCode) < 0) {
            details.errCodes.push(errCode);
            // ERROR_MESSAGES has doT templates for each key
            const message = `${ERROR_MESSAGES[errCode]({err})}${additionalInfo(err)}`;
            const errDetail = { message, errCode };
            details.errors.push(errDetail);
        }
    }
    debug('details - %j', details);
    return details;
};

/**
 * Helper function to set ctx status and response body
 *
 * @param {any} ctx
 * @param {number} status
 * @param {Error} err
 */
exports.internalServerError = function internalServerError(ctx, status = 500, err = new Error('Unknown Error')) {
    debug('Returning error with status %s due to error %j', status, err);
    ctx.status = status;
    let message = err.message || 'Something went wrong.';

    let errId = 'UNKNOWN',
        errCode = DEFAULT_ERR_CODE;
    if (err.code) {
        errId = err.code;
    }
    if (ERROR_CODE_MAP.hasOwnProperty(errId)) {
        errCode = ERROR_CODE_MAP[errId];
        message = ERROR_MESSAGES[errId];
    }

    const response = {
        errCode,
        errorType: err.name || err.constructor.name
    };

    if (ctx.env === 'development') {
        response.details = {};
        _.merge(response.details, err);
        response.details.stack = err.stack;
    }

    ctx.body = {
        success: false,
        message,
        error: true,
        response
    };
};
