'use strict';
const Joi = require('joi');

const debug = require('debug')('webapp:middleware:validate');

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
        const valObj = Joi.validate(body, schema);
        debug('Validation result %j', valObj);
        if (valObj.error) {
            ctx.throw(400, valObj.error);
        }
        ctx.request.body = valObj.value;
        await next();
    };
};
