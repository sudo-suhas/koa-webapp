'use strict';

const Joi = require('joi');

/* eslint newline-per-chained-call: "off" */

module.exports = Joi.object({
    _csrf: Joi.string(),
    name: Joi.string().min(5).trim()
        .regex(/^[a-zA-Z ]*$/, 'Only alphabets').required(),
    email: Joi.string().lowercase().email().trim().required(),
    password: Joi.string()
        // http://stackoverflow.com/questions/19605150/regex-for-password-must-be-contain-at-least-8-characters-least-1-number-and-bot
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            '8 characters, 1 Alphabet and 1 Number').required()
});
