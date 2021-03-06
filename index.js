'use strict';

var path = require('path');
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
                if (path.parse(id).ext === '.js') {
                    code = [
                        '<script>',
                            code,
                        '</script>'
                    ].join('\n');
                }

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
module.exports = plugin;
