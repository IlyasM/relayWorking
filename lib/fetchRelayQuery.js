'use strict';














var Promise=require('fbjs/lib/Promise');
var RelayNetworkLayer=require('./RelayNetworkLayer');
var RelayProfiler=require('./RelayProfiler');
var RelayQueryRequest=require('./RelayQueryRequest');


var resolveImmediate=require('fbjs/lib/resolveImmediate');

var queue=null;










function fetchRelayQuery(query){
if(!queue){
queue = [];
var currentQueue=queue;
resolveImmediate(function(){
queue = null;
profileQueue(currentQueue);
processQueue(currentQueue);});}


var request=new RelayQueryRequest(query);
queue.push(request);
return request.getPromise();}


function processQueue(currentQueue){
RelayNetworkLayer.sendQueries(currentQueue);}





function profileQueue(currentQueue){
var profiler=RelayProfiler.profile('fetchRelayQuery');
var promises=currentQueue.map(function(request){return request.getPromise();});
Promise.race(promises).finally(profiler.stop);}


module.exports = fetchRelayQuery;