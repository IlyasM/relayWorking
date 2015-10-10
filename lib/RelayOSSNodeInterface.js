'use strict';


















var forEachRootCallArg=require('./forEachRootCallArg');
var generateClientID=require('./generateClientID');
var invariant=require('fbjs/lib/invariant');











var RelayOSSNodeInterface={
ID:'id',
NODE:'node',
NODE_TYPE:'Node',
NODES:'nodes',
TYPENAME:'__typename',

isNodeRootCall:function(fieldName){
return (
fieldName === RelayOSSNodeInterface.NODE || 
fieldName === RelayOSSNodeInterface.NODES);},



getResultsFromPayload:function(
store,
query,
payload)
{
var results=[];

var rootBatchCall=query.getBatchCall();
if(rootBatchCall){
getPayloadRecords(query,payload).forEach(function(result){
if(typeof result !== 'object' || !result){
return;}

var dataID=result[RelayOSSNodeInterface.ID];
!(
dataID != null)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayOSSNodeInterface.getResultsFromPayload(): Unable to write ' + 
'result with no `%s` field for query, `%s`.',
RelayOSSNodeInterface.ID,
query.getName()):invariant(false):undefined;

results.push({dataID:dataID,result:result});});}else 

{
var records=getPayloadRecords(query,payload);
var ii=0;
forEachRootCallArg(query,function(identifyingArgValue,fieldName){
var result=records[ii++];
var dataID=store.getDataID(fieldName,identifyingArgValue);
if(dataID == null){
var payloadID=typeof result === 'object' && result?
result[RelayOSSNodeInterface.ID]:
null;
if(payloadID != null){
dataID = payloadID;}else 
if(identifyingArgValue == null){
dataID = 'client:' + fieldName;}else 
{
dataID = generateClientID();}

store.putDataID(fieldName,identifyingArgValue,dataID);}

results.push({dataID:dataID,result:result});});}



return results;}};



function getPayloadRecords(
query,
payload)
{
var fieldName=query.getFieldName();
var identifyingArg=query.getIdentifyingArg();
var identifyingArgValue=identifyingArg && identifyingArg.value || null;
var records=payload[fieldName];
if(!query.getBatchCall()){
if(Array.isArray(identifyingArgValue)){
!
Array.isArray(records)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayOSSNodeInterface: Expected payload for root field `%s` to be ' + 
'an array with %s results, instead received a single non-array result.',
fieldName,
identifyingArgValue.length):invariant(false):undefined;

!(
records.length === identifyingArgValue.length)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayOSSNodeInterface: Expected payload for root field `%s` to be ' + 
'an array with %s results, instead received an array with %s results.',
fieldName,
identifyingArgValue.length,
records.length):invariant(false):undefined;}else 

if(Array.isArray(records)){
!
false?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayOSSNodeInterface: Expected payload for root field `%s` to be ' + 
'a single non-array result, instead received an array with %s results.',
fieldName,
records.length):invariant(false):undefined;}}



return Array.isArray(records)?records:[records];}


module.exports = RelayOSSNodeInterface;