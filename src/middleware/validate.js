'use strict';
const Joi = require('joi');

const debug = require('debug')('webapp:middleware:validate');

const { util } = require('../substratum'), { joiOptions } = require('../config');

/**
 * Middleware validate to check request body against desired schema
 *
 * @param {any} schema
 * @returns {function} Middleware function which validates request body against given schema
 */
module.exports = function validate(schema) {
    return async function validateMiddleware(ctx, next) {
        const body = ctx.request.body;
        debug('Validating %j', body);
        const valObj = Joi.validate(body, schema, joiOptions);
        debug('Validation result %j', valObj);
        if (!valObj.error) {
            // No error. But push joi transformations back into request body
            ctx.request.body = valObj.value;
            return await next();
        }
        const detailsObj = {};
        const errObj = valObj.error;
        for (const err of errObj.details) {
            // Should we accept another function parameter to check for error types?
            // err.path is the field
            // Update the error for field if there is one already
            detailsObj[err.path] = util.parseDetails(err, detailsObj[err.path]);
        }
        debug('Error Details %j', detailsObj);
        // Doesn't send the error details in the response :(
        // ctx.throw(400, 'validation_error', detailsObj);
        const errorFields = Object.keys(detailsObj);
        // We got a validation error. Skip calling next.
        ctx.status = 400;
        ctx.body = {
            success: false,
            message: `Validation failed on ${errorFields.join(', ')}.`,
            error: true,
            response: {
                errorType: 'validation_error',
                errorFields,
                details: errorFields.map(field => detailsObj[field])
            }
        };
    };
};
