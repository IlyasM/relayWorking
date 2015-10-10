'use strict';













function isObject(value){
return (
value !== null && 
Object.prototype.toString.call(value) === '[object Object]');}




































function stableStringify(object){
var keys=Object.keys(object);
if(keys.length){
var result=[];
keys.sort();

for(var i=0;i < keys.length;i++) {
var key=keys[i];
var value=object[key];
if(isObject(value) || Array.isArray(value)){
value = stableStringify(value);}else 
{
value = JSON.stringify(value);}

result.push(key + ':' + value);}


if(Array.isArray(object)){
return '[' + result.join(',') + ']';}else 
{
return '{' + result.join(',') + '}';}}


return JSON.stringify(object);}


module.exports = stableStringify;