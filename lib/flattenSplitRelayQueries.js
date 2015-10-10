function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i < arr.length;i++) arr2[i] = arr[i];return arr2;}else {return Array.from(arr);}}












'use strict';













function flattenSplitRelayQueries(
splitQueries)
{
var flattenedQueries=[];
var queue=[splitQueries];
while(queue.length) {
splitQueries = queue.shift();var _splitQueries=
splitQueries;var required=_splitQueries.required;var deferred=_splitQueries.deferred;
if(required){
flattenedQueries.push(required);}

if(deferred.length){
queue.push.apply(queue,_toConsumableArray(deferred));}}


return flattenedQueries;}


module.exports = flattenSplitRelayQueries;