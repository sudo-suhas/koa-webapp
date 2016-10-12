'use strict';
const path = require('path');

const fs = require('fs-extra'),
    _ = require('lodash');

module.exports = function loadHelpers (dirs) {
    const helpers = {};

    if (_.isArray(dirs)) {
        for (const item of dirs) {
            if (_.isObject(item)) {
                _.forIn(item, (value, key) => {
                    if (_.isString(key)) {
                        if (_.isString(value)) {
                            load(value, key);
                        } else {
                            helpers[key] = value;
                        }
                    }
                });
            } else if (_.isString(item)) {
                load(item);
            }
        }
    } else {
        load(dirs);
    }

    /**
     * @param {string} dir
     * @param {string=} moduleName
     */
    function load (dir, moduleName) {
        const fullPath = path.resolve(dir);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            for (const file of fs.readdirSync(dir)) {
                load(path.join(dir, file));
            }
        } else if (stat.isFile()) {
            const mod = require(fullPath);

            if (_.isString(moduleName)) {
                helpers[moduleName] = mod;
            } else if (_.isString(mod.moduleName)) {
                helpers[mod.moduleName] = mod.moduleBody;
            } else {
                helpers[_.camelCase(path.basename(fullPath, path.extname(fullPath)))] = mod;
            }
        }
    }

    return helpers;
};
