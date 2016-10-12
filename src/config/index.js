'use strict';
const DEBUG = true;
const STAGING = false;

if (DEBUG && !STAGING) {
    module.exports = require('./development');
} else if (STAGING) {
    module.exports = require('./staging');
} else if (!DEBUG && !STAGING) {
    module.exports = require('./production');
}
