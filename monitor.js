/**
 * @Created by kaicui(https://github.com/wbpmrck).
 * @Date:2013-10-31 13:50
 * @Desc: 实现对配置文件的统一管理
 * 1、负责监控文件属性的变化
 * 2、通知受管理的各个configManager去更新各自的配置信息，并由后者触发事件，去通知各业务模块有配置项发生变化
 * @Change History:
 --------------------------------------------
 @created：|kaicui| 2013-10-31 13:50.
 --------------------------------------------
 */

/*
 todo:imports
 */
var ConfigManager = require('./configManager').constructor;
var chokidar = require('chokidar'),path = require('path');
var fs = require('fs'),fileExt = require('./fileExtension');
/*
 todo:class define
 */
function Monitor(fileOrDir){
    var self = this;

    self.fileOrDir = fileOrDir;
    self.watcher = undefined;
    self.fileAndConfigMap={};//{"e:/as/vv/as.js":configManager}

    //进行初始化
    self.init();
}
Monitor.prototype.getConfig = function(relativePath){
    var self = this;//save the this ref

    return self.fileAndConfigMap[path.resolve(self.fileOrDir,relativePath)];
}
Monitor.prototype.init = function(){
    var self = this;//save the this ref
    self.watcher = chokidar.watch(self.fileOrDir, {ignored: /^\./,ignoreInitial:true, persistent: true});

    //when file added or changed ,fire a event
    self.watcher
        .on('add', function(path) {
            //new a configManager
            self.fileAndConfigMap[path] = new ConfigManager(path);
        })
        .on('change', function(path) {
            //call configManager to reload
            self.fileAndConfigMap[path]&&self.fileAndConfigMap[path].reload();
        })
        .on('error', function(error) {console.error('Config Monitor Error happened:%s', error);})

    /*
        todo:先把文件/文件夹下的所有文件全部require一遍，生成初始化的config文件对象返回
    */
        if(fs.statSync(self.fileOrDir).isDirectory()){
            var allFiles = fileExt.getAllFiles(self.fileOrDir);
            allFiles.forEach(function(file){
                self.fileAndConfigMap[file] = new ConfigManager(file);
            });
        }
        else{
            self.fileAndConfigMap[_item] = new ConfigManager(self.fileOrDir);
        }
};

/*
 todo:exports
 */
exports.constructor = Monitor;