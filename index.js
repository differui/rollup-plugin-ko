'use strict';

var rollupPluginutils = require('rollup-pluginutils');
var compiler = require('ko-component-compiler');

function plugin() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var filter = rollupPluginutils.createFilter(options.include || '**/*.ko', options.exclude || 'node_modules/**');

    return {
        transform: function transform(code, id) {
            if (!filter(id)) {
                return null;
            }

            return new Promise(function (resolve, reject) {
                compiler['compile'](code, id, function (error, compiled) {
                    var temp = {
                        code: compiled,
                        map: { mappings: '' }
                    };

                    if (error) {
                        temp.error = error;
                        reject(temp);
                    }

                    resolve(temp);
                });
            });
        }
    };
}

plugin.compiler = compiler;
plugin.version = '0.1.0';

module.exports = plugin;
