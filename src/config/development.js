'use strict';
const path = require('path');

const bunyan = require('bunyan'),
    redisStore = require('koa-redis'); // https://github.com/koajs/koa-redis

const loadHelpers = require('../substratum/load_helpers');

const config = {};

const { appRoot } = global, logDir = path.join(appRoot, 'logs'),
    pugDir = path.join(appRoot, 'src', 'pug');

config.logger = {
    name: 'webapp',
    streams: [{
        stream: process.stdout,
        level: 'debug'
    }, {
        type: 'rotating-file',
        path: path.join(logDir, 'webapp.log'),
        level: 'info',
        period: '1d', // daily rotation
        count: 3 // keep 3 back copies
    }],
    // WARNING: Determining the call source info is slow. Never use this option in production.
    src: true,
    serializers: bunyan.stdSerializers
};

const redisConfig = config.redis = {
    // Specify db, password
    host: '127.0.0.1',
    port: 6379
};

// echo "$(< /dev/urandom tr -dc A-Za-z0-9 | head -c 32)"
config.appKeys = ['7j7voPRVXErLoMzCCBDQBVjqpkXuAzZd', '5UTkz12iWpzNFepKKRiZEEBde4FzQs9S'];

config.session = {
    key: 'bool.sid',
    prefix: 'bool:sess:',
    rolling: 'true',
    store: redisStore(redisConfig),
    cookie: {
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000,
        domain: '',
        secure: false, // only in dev
        httpOnly: true,
        signed: true
    }
};

config.ratelimit = {
    // 100 requests in 60 seconds.
    // Single page can make multiple requests for different resources.
    duration: 60000,
    max: 100,
    redis: {
        // Specify different db, password
        host: '127.0.0.1',
        port: 6379
    },
    'throw': true
};

config.pug = {
    pretty: true,
    debug: true,
    compileDebug: true,
    cache: false,
    basedir: path.join(appRoot, 'views'),
    globals: [
        { _: require('lodash') },
        loadHelpers(path.join(pugDir, 'helpers'))
    ]
};

config.knexReader = {
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'myuser',
        password: 'mypass',
        database: 'my_db',
        timezone: 'utc',
        charset: 'utf8'
    },
    debug: false,
    pool: { min: 2, max: 10 },
    acquireConnectionTimeout: 10000
};

/* eslint-disable quotes*/
config.helmet = {
    // https://github.com/krakenjs/lusca/issues/42
    // Enabled by default - dnsPrefetchControl, frameguard, hidePoweredBy
    // hsts, ieNoOpen, noSniff, xssFilter

    // ieNoOpen sets the X-Download-Options header to noopen to prevent
    // Internet Explorer users from executing downloads in your site's context.

    // noSniff Keeps non-script resources from being executed as scripts

    // The X-XSS-Protection HTTP header is a basic protection against XSS
    // xssFilter sets the X-XSS-Protection header

    // http://security.stackexchange.com/questions/121796/what-security-implications-does-dns-prefetching-have
    dnsPrefetchControl: { allow: true }, // Shouldn't be a security concern

    contentSecurityPolicy: {
        // https://github.com/helmetjs/csp
        // https://content-security-policy.com/
        // https://www.html5rocks.com/en/tutorials/security/content-security-policy/
        // http://scottksmith.com/blog/2014/09/21/protect-your-node-apps-noggin-with-helmet/
        directives: {
            // This is the default policy for loading all content.
            // Whatever is defined here applies to all the other type unless you set them to 'none'
            defaultSrc: ["'none'"],
            // This is the policy for controlling the valid sources of JavaScript.
            scriptSrc: ["'self'"],
            // This is the policy for controlling the valid sources of stylesheets.
            // Using the 'unsafe-inline' keyword to allows inline stylesheets
            styleSrc: ["'self'", 'cdnjs.cloudflare.com'],
            // This is the policy for controlling the valid sources of images.
            imgSrc: ["'self'", 'data:'],
            // limits the origins to which you can connect (via XHR, WebSockets, and EventSource)
            connectSrc: ["'self'"],
            // This is the policy for controlling the valid sources of plugins like <object>, <embed>, or <applet>.
            // 'none' will disallow plugins (objects, embeds, etc.)
            objectSrc: ["'none'"], // An empty array allows nothing through
            // specifies the origins that can serve web fonts.
            fontSrc: ["'self'", 'https://themes.googleusercontent.com'],
            // This is the policy for controlling the valid sources of HTML5 media types like <audio> or <video>.
            mediaSrc: [],
            // lists the URLs for workers and embedded frame contents
            childSrc: [],

            /* The following directives don’t use default-src as a fallback. */

            // lists valid endpoints for submission from <form> tags
            formAction: ["'self'"],
            // Enables a sandbox for the requested resource similar to the iframe sandbox attribute.
            // The sandbox applies a same origin policy, prevents popups, plugins and script execution is blocked.
            sandbox: ['allow-forms', 'allow-same-origin', 'allow-top-navigation', 'allow-scripts', 'allow-popups'],
            // Defines valid sources for embedding the resource using <frame> <iframe> <object> <embed> <applet>
            frameAncestors: ["'none'"] // ,
                // Defines valid MIME types for plugins invoked via <object> and <embed>.
                // Controlled through objectSrc. Only intended to be used if some plugins allowed with object-src
                // pluginTypes: []

        },

        // Set to true if you only want browsers to report errors, not block them
        reportOnly: false,

        // Set to true if you want to blindly set all headers: Content-Security-Policy,
        // X-WebKit-CSP, and X-Content-Security-Policy.
        setAllHeaders: false,

        // Set to true if you want to disable CSP on Android where it can be buggy.
        disableAndroid: false,

        // Set to false if you want to completely disable any user-agent sniffing.
        // This may make the headers less compatible but it will be much faster.
        // This defaults to `true`.
        browserSniff: false
    },

    // The X-Frame-Options HTTP header restricts who can put your site in a
    // frame which can help mitigate things like clickjacking attacks
    frameguard: { action: 'sameorigin' }, // default config

    // Hackers can exploit known vulnerabilities in if they see what powers our site
    hidePoweredBy: { setTo: 'Unicorn and Rainbows' }, // lolz

    /*
        TODO: Configure HTTP Public Key Pinning for production.js
        https://github.com/helmetjs/hpkp
        https://developer.mozilla.org/en-US/docs/Web/Security/Public_Key_Pinning
        https://timtaubert.de/blog/2014/10/http-public-key-pinning-explained/
    */

    // hsts (HTTP Strict Transport Security) is useless without HTTPS
    // This only works if your site actually has HTTPS.
    // It won't tell users on HTTP to switch to HTTPS,
    // it will just tell HTTPS users to stick around.
    hsts: {
        maxAge: 7776000000, // 90 days (value is in milliseconds)
        includeSubdomains: true
    }
};
/* eslint-enable quotes*/

config.logDb = {
    host: 'localhost',
    user: 'myuser',
    password: 'mypass',
    database: 'my_db',
    timezone: 'utc',
    charset: 'utf8'
};

module.exports = config;
