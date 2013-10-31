
/*
 todo:imports
 */
var Monitor = require('../monitor').constructor;
var path = require('path');
var util = require('util');

var configMonitor = new Monitor(path.resolve(path.dirname(__filename),'./configs'));

var configA = configMonitor.getConfig('a.js');
console.log('configA is %s',util.inspect(configA.data));

configA.on('change',function(property,newVal,oldValue){
    console.log('property %s changed! from: %s to %s',property,oldValue,newVal);
    console.log('configA is %s',util.inspect(configA.data));
});