var fs = require('fs');
var path = require('path');
function getAllFiles(root) {
    var result = [], files = fs.readdirSync(root)
    files.forEach(function(file) {
        var pathname = root+ "/" + file
            , stat = fs.lstatSync(pathname)
        if (stat === undefined) return

        // 不是文件夹就是文件
        if (!stat.isDirectory()) {
            result.push(path.normalize(pathname))
            // 递归自身
        } else {
            result = result.concat(getAllFiles(pathname))
        }
    });
    return result
}

exports.getAllFiles = getAllFiles;