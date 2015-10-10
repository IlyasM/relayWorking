'use strict';













var crc32=require('fbjs/lib/crc32');

var PREFIX='_';
















function generateRQLFieldAlias(input){

var index=input.indexOf('.');
if(index === -1){
return input;}


return PREFIX + input.substr(0,index) + Math.abs(crc32(input)).toString(36);}


module.exports = generateRQLFieldAlias;