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

//由于chokidar有bug,当一个进程里有多个程序尝试监听同一个文件的时候，如果一个watcher关闭了，那么另外一个也收不到
//事件。所以这里做一个代理
var fileWatchers ={};//key:fileName,value:{watcher:{},onchanges:[{monitors}],onadds:[{monitors}]}
/**
 * 当外部需要释放一个文件监听器的时候，调此方法
 * @param monitor
 */
exports.disposeMonitor =function(monitor){
    for(var g in fileWatchers){
        var w = fileWatchers[g];
        if(w.onchanges.length >0){
            for(var i= w.onchanges.length-1;i>=0;i--){
                if(w.onchanges[i] === monitor){
                    console.log('-->remove file change monitor for file:%s',g);
                    w.onchanges.splice(i,1);
                }
            }
        }
        if(w.onadds.length >0){
            for(var i= w.onadds.length-1;i>=0;i--){
                if(w.onadds[i] === monitor){
                    console.log('-->remove file add monitor for file:%s',g);
                    w.onadds.splice(i,1);
                }
            }
        }
        if(w.onchanges.length==0&&w.onadds.length==0){
            w.watcher.close();
            delete fileWatchers[g];
        }
    }
}
/*
 todo:class define
 */
function Monitor(fileOrDir){
    var self = this;

    self.fileOrDir = fileOrDir;
    self.fileAndConfigMap={};//{"e:/as/vv/as.js":configManager}

    //进行初始化
    self.init();
}
Monitor.prototype.getConfig = function(relativePath){
    var self = this;//save the this ref

    return self.fileAndConfigMap[path.resolve(self.fileOrDir,relativePath)];
}
Monitor.prototype.onAdd = function(path){
    var self = this;//save the this ref
    //new a configManager
    self.fileAndConfigMap[path] = new ConfigManager(path);
}
Monitor.prototype.onChange = function(path){
    var self = this;//save the this ref
    //call configManager to reload
    self.fileAndConfigMap[path]&&self.fileAndConfigMap[path].reload();
}
Monitor.prototype.init = function(){
    var self = this;//save the this ref
    if(fileWatchers.hasOwnProperty(self.fileOrDir)){
        fileWatchers[self.fileOrDir].onchanges.push(self);
        fileWatchers[self.fileOrDir].onadds.push(self);
    }
    else{
        fileWatchers[self.fileOrDir]={
            watcher:chokidar.watch(self.fileOrDir, {ignored: /^\./,ignoreInitial:true, persistent: true}),
            onchanges:[self],
            onadds:[self]
        };
        //when file added or changed ,fire a event
        fileWatchers[self.fileOrDir].watcher
            .on('add', function(path) {
                //调用监听该文件的所有monitor的方法
                fileWatchers[self.fileOrDir].onadds.forEach(function(it){
                    it.onAdd(path);
                });
            })
            .on('change', function(path) {
                //调用监听该文件的所有monitor的方法
                fileWatchers[self.fileOrDir].onchanges.forEach(function(it){
                    it.onChange(path);
                });
            })
            .on('error', function(error) {console.error('file %s Monitor Error happened:%s', self.fileOrDir,error);})
    }


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
            self.fileAndConfigMap[self.fileOrDir] = new ConfigManager(self.fileOrDir);
        }
};

/*
 todo:exports
 */
exports.constructor = Monitor;