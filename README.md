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

```js
var Interface = require('interface').Interface;
var IHuman = new Interface('IHuman',['run','shout']);//done! now you have a Interface. it has two methods.
//var IHuman = new Interface('IHuman','run');//this works too!
//next step we can see what can it do.
```



## License

MIT
##End


