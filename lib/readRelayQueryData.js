Object.defineProperty(exports,'__esModule',{value:true});function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass,superClass){if(typeof superClass !== 'function' && superClass !== null){throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__ = superClass;}












'use strict';

var GraphQLStoreDataHandler=require('./GraphQLStoreDataHandler');
var GraphQLFragmentPointer=require('./GraphQLFragmentPointer');
var GraphQLStoreRangeUtils=require('./GraphQLStoreRangeUtils');
var RelayConnectionInterface=require('./RelayConnectionInterface');

var RelayProfiler=require('./RelayProfiler');
var RelayQuery=require('./RelayQuery');
var RelayQueryVisitor=require('./RelayQueryVisitor');
var RelayRecordState=require('./RelayRecordState');







var callsFromGraphQL=require('./callsFromGraphQL');
var callsToGraphQL=require('./callsToGraphQL');
var invariant=require('fbjs/lib/invariant');
var validateRelayReadQuery=require('./validateRelayReadQuery');var 
















EDGES=RelayConnectionInterface.EDGES;var PAGE_INFO=RelayConnectionInterface.PAGE_INFO;






function readRelayQueryData(
store,
queryNode,
dataID,
options)
{
var reader=new RelayStoreReader(store,options);
var data=reader.retrieveData(queryNode,dataID);



validateRelayReadQuery(queryNode,options);

return data;}var 


RelayStoreReader=(function(_RelayQueryVisitor){_inherits(RelayStoreReader,_RelayQueryVisitor);




function RelayStoreReader(
recordStore,
options)
{_classCallCheck(this,RelayStoreReader);
_RelayQueryVisitor.call(this);
this._recordStore = recordStore;
this._traverseFragmentReferences = 
options && options.traverseFragmentReferences || false;
this._traverseGeneratedFields = 
options && options.traverseGeneratedFields || false;}RelayStoreReader.prototype.





retrieveData = function retrieveData(
queryNode,
dataID)
{
var result={
data:undefined,
dataIDs:{}};

var rangeData=GraphQLStoreRangeUtils.parseRangeClientID(dataID);
var status=this._recordStore.getRecordState(
rangeData?rangeData.dataID:dataID);

if(status === RelayRecordState.EXISTENT){
var state={
componentDataID:null,
data:undefined,
parent:null,
rangeInfo:null,
seenDataIDs:result.dataIDs,
storeDataID:dataID};

this.visit(queryNode,state);
result.data = state.data;}else 
if(status === RelayRecordState.NONEXISTENT){
result.data = null;}

return result;};RelayStoreReader.prototype.


visitField = function visitField(node,state){


this._handleRangeInfo(node,state);

if(!node.isScalar() || node.isGenerated()){

getDataObject(state);}


if(node.isGenerated() && !this._traverseGeneratedFields){
return;}

var rangeInfo=state.rangeInfo;
if(
rangeInfo && 
node.getSchemaName() === EDGES)
{
this._readEdges(node,rangeInfo,state);}else 
if(
rangeInfo && 
node.getSchemaName() === PAGE_INFO)
{
this._readPageInfo(node,rangeInfo,state);}else 
if(node.isScalar()){
this._readScalar(node,state);}else 
if(node.isPlural()){
this._readPlural(node,state);}else 
if(node.isConnection()){
this._readConnection(node,state);}else 
{
this._readLinkedField(node,state);}

state.seenDataIDs[state.storeDataID] = true;};RelayStoreReader.prototype.


visitFragment = function visitFragment(node,state){
if(node.isContainerFragment() && !this._traverseFragmentReferences){
var dataID=getComponentDataID(state);
var fragmentPointer=new GraphQLFragmentPointer(
node.isPlural()?[dataID]:dataID,
node);

this._setDataValue(
state,
fragmentPointer.getFragment().getConcreteFragmentID(),
fragmentPointer);}else 

{
this.traverse(node,state);}};RelayStoreReader.prototype.



_readScalar = function _readScalar(node,state){
var storageKey=node.getStorageKey();
var field=this._recordStore.getField(state.storeDataID,storageKey);
if(field === undefined){
return;}else 
if(field === null && !state.data){
state.data = null;}else 
{
this._setDataValue(
state,
node.getApplicationName(),
Array.isArray(field)?field.slice():field);}};RelayStoreReader.prototype.




_readPlural = function _readPlural(node,state){var _this=this;
var storageKey=node.getStorageKey();
var dataIDs=
this._recordStore.getLinkedRecordIDs(state.storeDataID,storageKey);
if(dataIDs){
var applicationName=node.getApplicationName();
var previousData=getDataValue(state,applicationName);
var nextData=dataIDs.map(function(dataID,ii){
var data;
if(previousData instanceof Object){
data = previousData[ii];}

var nextState={
componentDataID:null,
data:data,
parent:node,
rangeInfo:null,
seenDataIDs:state.seenDataIDs,
storeDataID:dataID};

node.getChildren().forEach(function(child){return _this.visit(child,nextState);});
return nextState.data;});

this._setDataValue(state,applicationName,nextData);}};RelayStoreReader.prototype.



_readConnection = function _readConnection(node,state){
var applicationName=node.getApplicationName();
var storageKey=node.getStorageKey();
var calls=node.getCallsWithValues();
var dataID=this._recordStore.getLinkedRecordID(
state.storeDataID,
storageKey);

if(!dataID){
return;}

enforceRangeCalls(node);
var metadata=this._recordStore.getRangeMetadata(dataID,calls);
var nextState={
componentDataID:getConnectionClientID(node,dataID),
data:getDataValue(state,applicationName),
parent:node,
rangeInfo:metadata && calls.length?metadata:null,
seenDataIDs:state.seenDataIDs,
storeDataID:dataID};

this.traverse(node,nextState);
this._setDataValue(state,applicationName,nextState.data);};RelayStoreReader.prototype.


_readEdges = function _readEdges(node,rangeInfo,state){var _this2=this;
var previousData=getDataValue(state,EDGES);
var edges=rangeInfo.requestedEdges.map(function(edgeData,ii){
var data;
if(previousData instanceof Object){
data = previousData[ii];}

var nextState={
componentDataID:null,
data:data,
parent:node,
rangeInfo:null,
seenDataIDs:state.seenDataIDs,
storeDataID:edgeData.edgeID};

_this2.traverse(node,nextState);
return nextState.data;});

this._setDataValue(state,EDGES,edges);};RelayStoreReader.prototype.


_readPageInfo = function _readPageInfo(
node,
rangeInfo,
state)
{var _this3=this;var 
pageInfo=rangeInfo.pageInfo;
!
pageInfo?process.env.NODE_ENV !== 'production'?invariant(false,
'readRelayQueryData(): Missing field, `%s`.',
PAGE_INFO):invariant(false):undefined;

var info=pageInfo;
var nextData;




var read=function(child){
if(child instanceof RelayQuery.Fragment){
if(child.isContainerFragment() && !_this3._traverseFragmentReferences){
var fragmentPointer=new GraphQLFragmentPointer(
getComponentDataID(state),
child);

nextData = nextData || {};
var concreteFragmentID=
fragmentPointer.getFragment().getConcreteFragmentID();
nextData[concreteFragmentID] = fragmentPointer;}else 
{
child.getChildren().forEach(read);}}else 

{
var field=child;
if(!field.isGenerated() || _this3._traverseGeneratedFields){
nextData = nextData || {};
nextData[field.getApplicationName()] = info[field.getStorageKey()];}}};



node.getChildren().forEach(read);

this._setDataValue(
state,
PAGE_INFO,
nextData);};RelayStoreReader.prototype.



_readLinkedField = function _readLinkedField(node,state){
var storageKey=node.getStorageKey();
var applicationName=node.getApplicationName();
var dataID=this._recordStore.getLinkedRecordID(
state.storeDataID,storageKey);

if(dataID == null){
this._setDataValue(state,applicationName,dataID);
return;}

var nextState={
componentDataID:null,
data:getDataValue(state,applicationName),
parent:node,
rangeInfo:null,
seenDataIDs:state.seenDataIDs,
storeDataID:dataID};

var status=this._recordStore.getRecordState(dataID);
if(status === RelayRecordState.EXISTENT){

getDataObject(nextState);}

this.traverse(node,nextState);
this._setDataValue(state,applicationName,nextState.data);};RelayStoreReader.prototype.








_setDataValue = function _setDataValue(state,key,value){
var data=getDataObject(state);
if(value === undefined){
return;}

data[key] = value;


var status=this._recordStore.getField(state.storeDataID,'__status__');
if(status != null){
data.__status__ = status;}};RelayStoreReader.prototype.







_handleRangeInfo = function _handleRangeInfo(node,state){
var rangeData=GraphQLStoreRangeUtils.parseRangeClientID(
state.storeDataID);

if(rangeData != null){
state.componentDataID = state.storeDataID;
state.storeDataID = rangeData.dataID;
state.rangeInfo = this._recordStore.getRangeMetadata(
state.storeDataID,
callsFromGraphQL(rangeData.calls,rangeData.callValues));}};return RelayStoreReader;})(RelayQueryVisitor);










function enforceRangeCalls(parent){
if(!parent.__hasValidatedConnectionCalls__){
var calls=parent.getCallsWithValues();
if(!RelayConnectionInterface.hasRangeCalls(calls)){
rangeCallEnforcer.traverse(parent,parent);}

parent.__hasValidatedConnectionCalls__ = true;}}var 


RelayRangeCallEnforcer=(function(_RelayQueryVisitor2){_inherits(RelayRangeCallEnforcer,_RelayQueryVisitor2);function RelayRangeCallEnforcer(){_classCallCheck(this,RelayRangeCallEnforcer);_RelayQueryVisitor2.apply(this,arguments);}RelayRangeCallEnforcer.prototype.
visitField = function visitField(
node,
parent)
{
var schemaName=node.getSchemaName();
!(
schemaName !== EDGES && 
schemaName !== PAGE_INFO)?process.env.NODE_ENV !== 'production'?invariant(false,
'readRelayQueryData(): The field `%s` is a connection. Fields `%s` and ' + 
'`%s` cannot be fetched without a `first`, `last` or `find` argument.',
parent.getApplicationName(),
EDGES,
PAGE_INFO):invariant(false):undefined;};return RelayRangeCallEnforcer;})(RelayQueryVisitor);



var rangeCallEnforcer=new RelayRangeCallEnforcer();







function getConnectionClientID(
node,connectionID)
{
var calls=node.getCallsWithValues();
if(!RelayConnectionInterface.hasRangeCalls(calls)){
return connectionID;}

return GraphQLStoreRangeUtils.getClientIDForRangeWithID(
callsToGraphQL(calls),
{},
connectionID);}













function getComponentDataID(state){
if(state.componentDataID != null){
return state.componentDataID;}else 
{
return state.storeDataID;}}






function getDataObject(state){
var data=state.data;
if(!data){
var pointer=GraphQLStoreDataHandler.createPointerWithID(
getComponentDataID(state));

data = state.data = pointer;}

!(
data instanceof Object)?process.env.NODE_ENV !== 'production'?invariant(false,
'readRelayQueryData(): Unable to read field on non-object.'):invariant(false):undefined;

return data;}







function getDataValue(state,key){
var data=getDataObject(state);
return data[key];}


var instrumented=RelayProfiler.instrument(
'readRelayQueryData',
readRelayQueryData);




module.exports = instrumented;