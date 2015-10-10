'use strict';
















var CONNECTION_CALLS={
'after':true,
'before':true,
'find':true,
'first':true,
'last':true,
'surrounds':true};

var REQUIRED_RANGE_CALLS={
'find':true,
'first':true,
'last':true};







var RelayOSSConnectionInterface={
CLIENT_MUTATION_ID:'clientMutationId',
CURSOR:'cursor',
EDGES:'edges',
END_CURSOR:'endCursor',
HAS_NEXT_PAGE:'hasNextPage',
HAS_PREV_PAGE:'hasPreviousPage',
NODE:'node',
PAGE_INFO:'pageInfo',
START_CURSOR:'startCursor',




EDGES_HAVE_SOURCE_FIELD:false,






isConnectionCall:function(call){
return CONNECTION_CALLS.hasOwnProperty(call.name);},






hasRangeCalls:function(calls){
return calls.some(function(call){return REQUIRED_RANGE_CALLS.hasOwnProperty(call.name);});},





getDefaultPageInfo:function(){
var pageInfo={};
pageInfo[RelayOSSConnectionInterface.START_CURSOR] = undefined;
pageInfo[RelayOSSConnectionInterface.END_CURSOR] = undefined;
pageInfo[RelayOSSConnectionInterface.HAS_NEXT_PAGE] = false;
pageInfo[RelayOSSConnectionInterface.HAS_PREV_PAGE] = false;
return pageInfo;}};



module.exports = RelayOSSConnectionInterface;