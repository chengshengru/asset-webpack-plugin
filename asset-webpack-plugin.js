/**
 * 创建资源插件
 * Created by chengshengru on 17-7-27.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var os = require('os');

function AssetWebpackPlugin(options) {
    this.path = options.path || null;
    this.filename = options.filename;
    this.fn = options.fn;
    this.files = options.extraFiles || [];
}


AssetWebpackPlugin.prototype.apply = function (compiler) {
    var _this = this;

    compiler.plugin('emit', function (compilation, cb) {
        _this.fn(compilation, function (err, body) {
            if (err) {
                return cb(err);
            }

            compilation.assets[_this.filename] = {
                source: function source() {
                    return body;
                },
                size: function size() {
                    return body.length;
                }
            };

            _this.files.forEach(function (file) {
                compilation.assets[file] = {
                    source: function source() {
                        return fs.readFileSync(file);
                    },
                    size: function size() {
                        return fs.statSync(file).size;
                    }
                };
            });

            cb();
        });
    });


    /**
     * 编译结束
     */
    compiler.plugin('done', function (compilation) {
        //如果文件不为路径不为空,这执行移动
        if (_this.path && _this.path.trim() != '') {
            //判断文件夹是否存在
            if (!fs.existsSync(_this.path)) {
                var dirs = _this.path.split(path.sep);
                //需要循环创建文件加
                var parentPath = path.sep;
                if (os.platform() == 'win32') {
                    parentPath = dirs[0];
                }
                for (var index = 1; index < dirs.length; index++) {
                    parentPath = path.join(parentPath,dirs[index]);
                    if(!fs.existsSync(parentPath)){
                        fs.mkdirSync(parentPath);
                    }
                }
            }
            var outputOptions = compilation.compilation.outputOptions;
            var oldPath = path.join(outputOptions.path, _this.filename);
            var newPath = path.join(_this.path, _this.filename);
            //文件存在先删除
            if (fs.existsSync(newPath)) {
                fs.unlinkSync(newPath);
            }
            fs.rename(oldPath, newPath, function (err) {
                if (err) {
                    console.error(`${oldPath}移动到${newPath}失败!`)
                }
            });
        }
    });
}


module.exports = AssetWebpackPlugin;

