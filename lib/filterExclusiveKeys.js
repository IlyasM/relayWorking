'use strict';














var hasOwnProperty=Object.prototype.hasOwnProperty;




function filterExclusiveKeys(
a,
b)
{
var keysA=a?Object.keys(a):[];
var keysB=b?Object.keys(b):[];

if(keysA.length === 0 || 
keysB.length === 0){
return [keysA,keysB];}

return [
keysA.filter(function(key){return !hasOwnProperty.call(b,key);}),
keysB.filter(function(key){return !hasOwnProperty.call(a,key);})];}



module.exports = filterExclusiveKeys;