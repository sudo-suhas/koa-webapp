'use strict';

const Joi = require('joi');

/* eslint newline-per-chained-call: "off" */

module.exports = Joi.object({
    _csrf: Joi.string(),
    email: Joi.string().lowercase().email().trim().required(),
    password: Joi.string().required()
});
