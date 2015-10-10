var _extends=Object.assign || function(target){for(var i=1;i < arguments.length;i++) {var source=arguments[i];for(var key in source) {if(Object.prototype.hasOwnProperty.call(source,key)){target[key] = source[key];}}}return target;};function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else {obj[key] = value;}return obj;}












'use strict';

var GraphQLMutatorConstants=require('./GraphQLMutatorConstants');
var RelayConnectionInterface=require('./RelayConnectionInterface');






var RelayMutationTracker=require('./RelayMutationTracker');
var RelayMutationType=require('./RelayMutationType');
var RelayNodeInterface=require('./RelayNodeInterface');
var RelayQuery=require('./RelayQuery');
var RelayQueryPath=require('./RelayQueryPath');

var RelayProfiler=require('./RelayProfiler');
var RelayRecordState=require('./RelayRecordState');


var generateClientEdgeID=require('./generateClientEdgeID');
var generateClientID=require('./generateClientID');
var invariant=require('fbjs/lib/invariant');
var printRelayQueryCall=require('./printRelayQueryCall');
var warning=require('fbjs/lib/warning');var 










CLIENT_MUTATION_ID=RelayConnectionInterface.CLIENT_MUTATION_ID;var EDGES=RelayConnectionInterface.EDGES;var 
APPEND=GraphQLMutatorConstants.APPEND;var PREPEND=GraphQLMutatorConstants.PREPEND;var REMOVE=GraphQLMutatorConstants.REMOVE;

var EDGES_FIELD=RelayQuery.Field.build(
EDGES,
null,
null,
{plural:true});

var ID='id';
var IGNORED_KEYS=_defineProperty({
error:true},

CLIENT_MUTATION_ID,true);

var STUB_CURSOR_ID='client:cursor';







function writeRelayUpdatePayload(
writer,
operation,
payload,
_ref)
{var configs=_ref.configs;var isOptimisticUpdate=_ref.isOptimisticUpdate;
configs.forEach(function(config){
switch(config.type){
case RelayMutationType.NODE_DELETE:
handleNodeDelete(writer,payload,config);
break;
case RelayMutationType.RANGE_ADD:
handleRangeAdd(
writer,
payload,
operation,
config,
isOptimisticUpdate);

break;
case RelayMutationType.RANGE_DELETE:
handleRangeDelete(writer,payload,config);
break;
case RelayMutationType.FIELDS_CHANGE:
case RelayMutationType.REQUIRED_CHILDREN:
break;
default:
console.error(
'Expected a valid mutation handler type, got `%s`.',
config.type);}});




handleMerge(writer,payload,operation);}







function handleNodeDelete(
writer,
payload,
config)
{
var recordIDs=payload[config.deletedIDFieldName];
if(!recordIDs){


return;}


if(Array.isArray(recordIDs)){
recordIDs.forEach(function(id){
deleteRecord(writer,id);});}else 

{
deleteRecord(writer,recordIDs);}}







function deleteRecord(
writer,
recordID)
{
var store=writer.getRecordStore();

var status=store.getRecordState(recordID);
if(status === RelayRecordState.NONEXISTENT){
return;}



var connectionIDs=store.getConnectionIDsForRecord(recordID);
if(connectionIDs){
connectionIDs.forEach(function(connectionID){
var edgeID=generateClientEdgeID(connectionID,recordID);
store.applyRangeUpdate(connectionID,edgeID,REMOVE);
writer.recordUpdate(edgeID);
writer.recordUpdate(connectionID);

deleteRecord(writer,edgeID);});}




store.deleteRecord(recordID);
writer.recordUpdate(recordID);}







function handleMerge(
writer,
payload,
operation)
{
var store=writer.getRecordStore();






for(var fieldName in payload) {
if(!payload.hasOwnProperty(fieldName)){
continue;}

var payloadData=payload[fieldName];
if(payloadData == null || typeof payloadData !== 'object'){
continue;}



var rootID=store.getDataID(fieldName);

if(
ID in payloadData || 
rootID || 
Array.isArray(payloadData))
{
mergeField(
writer,
fieldName,
payloadData,
operation);}}}








function mergeField(
writer,
fieldName,
payload,
operation)
{

if(fieldName in IGNORED_KEYS){
return;}

if(Array.isArray(payload)){
payload.forEach(function(item){
if(item[ID]){
mergeField(writer,fieldName,item,operation);}});


return;}


var payloadData=payload;

var store=writer.getRecordStore();
var recordID=payloadData[ID];
var path;

if(recordID){
path = new RelayQueryPath(
RelayQuery.Root.build(
RelayNodeInterface.NODE,
recordID,
null,
{identifyingArgName:RelayNodeInterface.ID}));}else 


{
recordID = store.getDataID(fieldName);

path = new RelayQueryPath(RelayQuery.Root.build(fieldName));}

!
recordID?process.env.NODE_ENV !== 'production'?invariant(false,
'writeRelayUpdatePayload(): Expected a record ID in the response payload ' + 
'supplied to update the store.'):invariant(false):undefined;




var handleNode=function(node){
node.getChildren().forEach(function(child){
if(child instanceof RelayQuery.Fragment){
handleNode(child);}else 
if(
child instanceof RelayQuery.Field && 
child.getSerializationKey() === fieldName)
{

if(path && recordID){
var typeName=writer.getRecordTypeName(
child,
recordID,
payloadData);


writer.createRecordIfMissing(
child,
recordID,
typeName,
path);

writer.writePayload(
child,
recordID,
payloadData,
path);}}});};





handleNode(operation);}








function handleRangeAdd(
writer,
payload,
operation,
config,
isOptimisticUpdate)
{
var clientMutationID=payload[CLIENT_MUTATION_ID];
var store=writer.getRecordStore();


var edge=payload[config.edgeName];
if(!edge || !edge.node){
process.env.NODE_ENV !== 'production'?warning(
false,
'writeRelayUpdatePayload(): Expected response payload to include the ' + 
'newly created edge `%s` and its `node` field. Did you forget to ' + 
'update the `RANGE_ADD` mutation config?',
config.edgeName):undefined;

return;}



var connectionParentID=config.parentID || edge.source && edge.source.id;
!
connectionParentID?process.env.NODE_ENV !== 'production'?invariant(false,
'writeRelayUpdatePayload(): Cannot insert edge without a configured ' + 
'`parentID` or a `%s.source.id` field.',
config.edgeName):invariant(false):undefined;


var nodeID=edge.node.id || generateClientID();
var cursor=edge.cursor || STUB_CURSOR_ID;
var edgeData=_extends({},
edge,{
cursor:cursor,
node:_extends({},
edge.node,{
id:nodeID})});




var connectionIDs=
store.getConnectionIDsForField(connectionParentID,config.connectionName);
if(connectionIDs){
connectionIDs.forEach(function(connectionID){return addRangeNode(
writer,
operation,
config,
connectionID,
nodeID,
edgeData);});}



if(isOptimisticUpdate){


RelayMutationTracker.putClientIDForMutation(
nodeID,
clientMutationID);}else 

{



var clientNodeID=
RelayMutationTracker.getClientIDForMutation(clientMutationID);
if(clientNodeID){
RelayMutationTracker.updateClientServerIDMap(
clientNodeID,
nodeID);

RelayMutationTracker.deleteClientIDForMutation(clientMutationID);}}}








function addRangeNode(
writer,
operation,
config,
connectionID,
nodeID,
edgeData)
{
var store=writer.getRecordStore();
var filterCalls=store.getRangeFilterCalls(connectionID);
var rangeBehavior=filterCalls?
getRangeBehavior(config.rangeBehaviors,filterCalls):
null;


if(!rangeBehavior){
return;}


var edgeID=generateClientEdgeID(connectionID,nodeID);
var path=store.getPathToRecord(connectionID);
!
path?process.env.NODE_ENV !== 'production'?invariant(false,
'writeRelayUpdatePayload(): Expected a path for connection record, `%s`.',
connectionID):invariant(false):undefined;

path = path.getPath(EDGES_FIELD,edgeID);


var typeName=writer.getRecordTypeName(EDGES_FIELD,edgeID,edgeData);
writer.createRecordIfMissing(EDGES_FIELD,edgeID,typeName,path);



var hasEdgeField=false;
var handleNode=function(node){
node.getChildren().forEach(function(child){
if(child instanceof RelayQuery.Fragment){
handleNode(child);}else 
if(
child instanceof RelayQuery.Field && 
child.getSchemaName() === config.edgeName)
{
hasEdgeField = true;
if(path){
writer.writePayload(
child,
edgeID,
edgeData,
path);}}});};





handleNode(operation);

!
hasEdgeField?process.env.NODE_ENV !== 'production'?invariant(false,
'writeRelayUpdatePayload(): Expected mutation query to include the ' + 
'relevant edge field, `%s`.',
config.edgeName):invariant(false):undefined;



if(rangeBehavior in GraphQLMutatorConstants.RANGE_OPERATIONS){
store.applyRangeUpdate(connectionID,edgeID,rangeBehavior);
if(writer.hasChangeToRecord(edgeID)){
writer.recordUpdate(connectionID);}}else 

{
console.error(
'writeRelayUpdatePayload(): invalid range operation `%s`, valid ' + 
'options are `%s` or `%s`.',
rangeBehavior,
APPEND,
PREPEND);}}









function handleRangeDelete(
writer,
payload,
config)
{
var recordID=payload[config.deletedIDFieldName];
!(
recordID !== undefined)?process.env.NODE_ENV !== 'production'?invariant(false,
'writeRelayUpdatePayload(): Missing ID for deleted record at field `%s`.',
config.deletedIDFieldName):invariant(false):undefined;



var store=writer.getRecordStore();
var connectionName=config.pathToConnection.pop();
var connectionParentID=
getIDFromPath(store,config.pathToConnection,payload);

config.pathToConnection.push(connectionName);
if(!connectionParentID){
return;}


var connectionIDs=store.getConnectionIDsForField(
connectionParentID,
connectionName);

if(connectionIDs){
connectionIDs.forEach(function(connectionID){
deleteRangeEdge(writer,connectionID,recordID);});}}







function deleteRangeEdge(
writer,
connectionID,
nodeID)
{
var store=writer.getRecordStore();
var edgeID=generateClientEdgeID(connectionID,nodeID);
store.applyRangeUpdate(connectionID,edgeID,REMOVE);

deleteRecord(writer,edgeID);
if(writer.hasChangeToRecord(edgeID)){
writer.recordUpdate(connectionID);}}













function getRangeBehavior(
rangeBehaviors,
calls)
{
var call=calls.map(printRelayQueryCall).join('').slice(1);
return rangeBehaviors[call] || null;}













function getIDFromPath(
store,
path,
payload)
{



if(path.length === 1){
var rootCallID=store.getDataID(path[0]);
if(rootCallID){
return rootCallID;}}


for(var ii=0;ii < path.length;ii++) {
var step=path[ii];
if(!payload || typeof payload !== 'object'){
return null;}

payload = payload[step];}

if(payload && typeof payload === 'object'){
return payload.id;}

return null;}


module.exports = RelayProfiler.instrument(
'writeRelayUpdatePayload',
writeRelayUpdatePayload);