Object.defineProperty(exports,'__esModule',{value:true});var _extends=Object.assign || function(target){for(var i=1;i < arguments.length;i++) {var source=arguments[i];for(var key in source) {if(Object.prototype.hasOwnProperty.call(source,key)){target[key] = source[key];}}}return target;};function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}












'use strict';




var invariant=require('fbjs/lib/invariant');var 








RelayQueryConfig=(function(){








function RelayQueryConfig(initialVariables){_classCallCheck(this,RelayQueryConfig);
!(
this.constructor !== RelayQueryConfig)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQueryConfig: Abstract class cannot be instantiated.'):invariant(false):undefined;


Object.defineProperty(this,'name',{
enumerable:true,
value:this.constructor.routeName,
writable:false});

Object.defineProperty(this,'params',{
enumerable:true,
value:this.prepareVariables(_extends({},initialVariables)) || {},
writable:false});

Object.defineProperty(this,'queries',{
enumerable:true,
value:_extends({},this.constructor.queries),
writable:false});


if(process.env.NODE_ENV !== 'production'){
Object.freeze(this.params);
Object.freeze(this.queries);}}RelayQueryConfig.prototype.







prepareVariables = function prepareVariables(prevVariables){
return prevVariables;};return RelayQueryConfig;})();



module.exports = RelayQueryConfig;