'use strict';Object.defineProperty(exports,'__esModule',{value:true});














var ErrorUtils=require('fbjs/lib/ErrorUtils');
var GraphQLStoreRangeUtils=require('./GraphQLStoreRangeUtils');
var RelayProfiler=require('./RelayProfiler');

var resolveImmediate=require('fbjs/lib/resolveImmediate');





var batchUpdate=function(callback){return callback();};
var subscribers=[];

var executingIDs={};
var scheduledIDs=null;



















var GraphQLStoreChangeEmitter={

addListenerForIDs:function(
ids,
callback)
{
var subscribedIDs=ids.map(getBroadcastID);
var index=subscribers.length;
subscribers.push({subscribedIDs:subscribedIDs,callback:callback});
return {
remove:function(){
delete subscribers[index];}};},




broadcastChangeForID:function(id){
if(scheduledIDs === null){
resolveImmediate(processBroadcasts);
scheduledIDs = {};}



scheduledIDs[getBroadcastID(id)] = subscribers.length - 1;},


injectBatchingStrategy:function(batchStrategy){
batchUpdate = batchStrategy;},






_processSubscribers:processSubscribers};



function processBroadcasts(){
if(scheduledIDs){
executingIDs = scheduledIDs;
scheduledIDs = null;
batchUpdate(processSubscribers);}}



function processSubscribers(){
subscribers.forEach(processSubscriber);}


function processSubscriber(_ref,subscriberIndex){var subscribedIDs=_ref.subscribedIDs;var callback=_ref.callback;
for(var broadcastID in executingIDs) {
if(executingIDs.hasOwnProperty(broadcastID)){
var broadcastIndex=executingIDs[broadcastID];
if(broadcastIndex < subscriberIndex){

break;}

if(subscribedIDs.indexOf(broadcastID) >= 0){
ErrorUtils.applyWithGuard(
callback,
null,
null,
null,
'GraphQLStoreChangeEmitter');

break;}}}}










function getBroadcastID(id){
return GraphQLStoreRangeUtils.getCanonicalClientID(id);}


RelayProfiler.instrumentMethods(GraphQLStoreChangeEmitter,{
addListenerForIDs:'GraphQLStoreChangeEmitter.addListenerForIDs',
broadcastChangeForID:'GraphQLStoreChangeEmitter.broadcastChangeForID',
_processSubscribers:'GraphQLStoreChangeEmitter.processSubscribers'});


module.exports = GraphQLStoreChangeEmitter;