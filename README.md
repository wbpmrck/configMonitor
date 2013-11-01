#configMonitor
<hr/>
##What is this?
configMonitor is a simple library to manage configs in your application.It use .js file to config data for node.js application and provide file watcher which emit events when config items changed.
<hr/>
##Features
<ul>
 <li>auto detect .js files and generate config objects.</li>
 <li>detect file changes and update the config objects.</li>
 <li>can emit events and tell you which property of the config has changed.</li>
</ul>
#Demo
let's say we have a dir like this:

```js
	configs
			|dirB
				|b.js
			|a.js
```
a.js

```js
module.exports={
    a:1222,
    c:10,
    b:{
        d:2122,
        e:{
            f:[1,22123,332],
            g:1
        }
    }
}
```

b.js

```js
module.exports={
    b1:1,
    b2:{
        b3:202
    }
}
```
let's use configMonitor to manager the two files:
```js

var Monitor = require('configMonitor').constructor;
var path = require('path');
var util = require('util');

//construct a monitor. the param is the root dir of the config files
var configMonitor = new Monitor(path.resolve(path.dirname(__filename),'./configs'));

var configA = configMonitor.getConfig('a.js');
var configB = configMonitor.getConfig('dirB/b.js');

console.log('configA is %s',util.inspect(configA.data));
console.log('configB is %s',util.inspect(configB.data));

//when you update a.js,this callback will execute
configA.on('change',function(property,newVal,oldValue){
    console.log('configA property %s changed! from: %s to %s',property,oldValue,newVal);
    console.log('configA is %s',util.inspect(configA.data));
});

//when you update b.js,this callback will execute
configB.on('change',function(property,newVal,oldValue){
    console.log('configB property %s changed! from: %s to %s',property,oldValue,newVal);
    console.log('configB is %s',util.inspect(configB.data));
});
```



## License

MIT
##End


