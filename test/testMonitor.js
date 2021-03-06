
/*
 todo:imports
 */
var Monitor = require('../monitor').constructor;
var path = require('path');
var util = require('util');

var configMonitor = new Monitor(path.resolve(path.dirname(__filename),'./configs'));
var configMonitor2 = new Monitor(path.resolve(path.dirname(__filename),'./configs/a.js'));

var configA = configMonitor.getConfig('a.js');
var configA2 = configMonitor2.getConfig('');
var configB = configMonitor.getConfig('dirB/b.js');
console.log('configA is %s',JSON.stringify(configA.data));
console.log('configA2 is %s',JSON.stringify(configA2.data));
console.log('configB is %s',JSON.stringify(configB.data));

configA2.on('change',function(property,newVal,oldValue){
    console.log('configA2 property %s changed! from: %s to %s',property,oldValue,newVal);
    console.log('configA2 is %s',JSON.stringify(configA2.data));
});
configA.on('change',function(property,newVal,oldValue){
    console.log('configA property %s changed! from: %s to %s',property,oldValue,newVal);
    console.log('configA is %s',JSON.stringify(configA.data));
});
configB.on('change',function(property,newVal,oldValue){
    console.log('configB property %s changed! from: %s to %s',property,oldValue,newVal);
    console.log('configB is %s',JSON.stringify(configB.data));
});

configB.on('reload',function(newData,oldData){
    console.log('configB reloaded! from: %s to %s',JSON.stringify(oldData),JSON.stringify(newData));
});