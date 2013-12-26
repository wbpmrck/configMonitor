/**
 * @Created by kaicui(https://github.com/wbpmrck).
 * @Date:2013-10-31 13:50
 * @Desc: 管理一个配置项，对以一个配置文件js
 * 1、继承自eventEmitter
 * 2、可以支持对某个项目有修改事件进行外部消息触发， 方便业务端进行修改
 * @Change History:
 --------------------------------------------
 @created：|kaicui| 2013-10-31 13:50.
 --------------------------------------------
 */

/*
 todo:imports
 */
var util = require("util");
var events = require("events");

/**
 * deep copy
 * @param src:source object
 * @return {*}
 */
function simpleDeepCopy(src){
    return JSON.parse(JSON.stringify(src));
}
/*
 todo:class define
 */
function ConfigManager(filePath){
    var self = this;

    events.EventEmitter.call(self);

    self.data = self.oldData = undefined; //save the data and last saved data
    self.filePath = filePath;
    self.init();
}
util.inherits(ConfigManager, events.EventEmitter);
/**
 * reload the file,emit events when value changed
 */
ConfigManager.prototype.reload = function(){
    var self = this;//save the this ref

    self.oldData = simpleDeepCopy(self.data);

    console.log('ConfigManager reload ,filePath:'+self.filePath);
    if(require.cache.hasOwnProperty(self.filePath)){
        delete require.cache[self.filePath];
    }
    self.data = require(self.filePath);

    //compare difference and emit events
    var _compareObj = function(prefix,source,target){
        try{

            //如果内容是对象，则递归比较
            if(typeof(source) ==='object' && source.constructor === Object){
                for(var i in source){
                    var item = source[i];
                    _compareObj(prefix?[prefix,i].join('.'):i,item,target[i]);
                }
            }
            //数组的比较
            else if(source.constructor === Array){
                source.forEach(function(subItem,index){
                    _compareObj(prefix?[prefix,index].join('.'):index,subItem,target[index]);
                });
//                    if(item.toString() !== target[i].toString()){
//                        //callback(name,newValue,oldValue)
//                        self.emit('change',prefix?[prefix,i].join('.'):i,target[i],item);
//                    }
            }
            //普通值的比较
            else if(source != target){
                //callback(name,newValue,oldValue)
                self.emit('change',prefix,target,source);
            }
        }
        catch(e){
            console.error('ConfigManager compare error:'+e);
        }
    }

    _compareObj('',self.oldData,self.data);

    self.emit('reload',self.data,self.oldData);
};
ConfigManager.prototype.init = function(){
    var self = this;//save the this ref
    console.log('ConfigManager init ,filePath:'+self.filePath);
    if(require.cache.hasOwnProperty(self.filePath)){
        delete require.cache[self.filePath];
    }
    self.data = require(self.filePath);
};

/*
 todo:exports
 */
exports.constructor = ConfigManager;