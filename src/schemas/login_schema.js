'use strict';

const Joi = require('joi');

/* eslint newline-per-chained-call: "off" */

module.exports = Joi.object({
    email: Joi.string().lowercase().email().strip(),
    password: Joi.string().strip()
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            '8 characters at least 1 Alphabet and 1 Number')
});
