'use strict';function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}var 


















RelayMetaRoute=(function(){


function RelayMetaRoute(name){_classCallCheck(this,RelayMetaRoute);
Object.defineProperty(this,'name',{
enumerable:true,
value:name,
writable:false});}RelayMetaRoute.



get = function get(name){
return cache[name] || (cache[name] = new RelayMetaRoute(name));};return RelayMetaRoute;})();




var cache={};

module.exports = RelayMetaRoute;