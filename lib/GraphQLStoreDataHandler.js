'use strict';














var METADATA_KEYS={
__dataID__:true,
__range__:true,
__status__:true};







var GraphQLStoreDataHandler={




getID:function(node){
return node.__dataID__;},






createPointerWithID:function(dataID){
return {__dataID__:dataID};},






isClientID:function(dataID){
return dataID.substring(0,7) === 'client:';},





isMetadataKey:function(key){
return METADATA_KEYS[key] || false;}};



module.exports = GraphQLStoreDataHandler;