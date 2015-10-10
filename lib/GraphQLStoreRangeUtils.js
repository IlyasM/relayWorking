'use strict';













var callsFromGraphQL=require('./callsFromGraphQL');
var printRelayQueryCall=require('./printRelayQueryCall');

var rangeData={};





























var GraphQLStoreRangeUtils={











getClientIDForRangeWithID:function(calls,callValues,dataID){
var callsAsString=callsFromGraphQL(calls,callValues).
map(function(call){return printRelayQueryCall(call).substring(1);}).
join(',');
var key=dataID + '_' + callsAsString;
var edge=rangeData[key];
if(!edge){
rangeData[key] = {
dataID:dataID,
calls:calls,
callValues:callValues};}


return key;},








parseRangeClientID:function(rangeSpecificClientID){
return rangeData[rangeSpecificClientID] || null;},










getCanonicalClientID:function(dataID){
return rangeData[dataID]?rangeData[dataID].dataID:dataID;}};



module.exports = GraphQLStoreRangeUtils;