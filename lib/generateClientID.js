'use strict';













var crc32=require('fbjs/lib/crc32');
var performanceNow=require('fbjs/lib/performanceNow');

var _clientID=1;
var _prefix='client:' + crc32('' + performanceNow());







function generateClientID(){
return _prefix + _clientID++;}


module.exports = generateClientID;