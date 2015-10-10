'use strict';



















var flattenArray=require('fbjs/lib/flattenArray');






function printRelayQueryCall(call){var 
value=call.value;
var valueString;
if(Array.isArray(value)){
valueString = flattenArray(value).map(sanitizeCallValue).join(',');}else 
if(value != null){
valueString = sanitizeCallValue(value);}else 
{
valueString = '';}

return '.' + call.name + '(' + valueString + ')';}


function sanitizeCallValue(value){
if(value == null){
return '';}

if(typeof value !== 'string'){
value = JSON.stringify(value);}

value = value.replace(/[)(}{><,.\\]/g,'\\$&');

if(/ $/.test(value)){
value += ' ';}

return value.replace(/^( *)(.*?)( *)$/,function(_,prefix,body,suffix){return (
'\\ '.repeat(prefix.length) + 
body + 
'\\ '.repeat(suffix.length));});}



module.exports = printRelayQueryCall;