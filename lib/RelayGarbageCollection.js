'use strict';














var RelayStoreData=require('./RelayStoreData');







var RelayGarbageCollection={










initialize:function(){
RelayStoreData.
getDefaultInstance().
initializeGarbageCollector();},




















scheduleCollection:function(stepLength){
var garbageCollector=
RelayStoreData.getDefaultInstance().getGarbageCollector();

if(garbageCollector){
garbageCollector.scheduleCollection(stepLength);}}};




module.exports = RelayGarbageCollection;