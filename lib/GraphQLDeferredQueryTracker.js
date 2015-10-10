'use strict';














var ErrorUtils=require('fbjs/lib/ErrorUtils');
var Map=require('fbjs/lib/Map');


var RelayStoreData=require('./RelayStoreData');

var forEachObject=require('fbjs/lib/forEachObject');
var forEachRootCallArg=require('./forEachRootCallArg');
var invariant=require('fbjs/lib/invariant');
var isEmpty=require('fbjs/lib/isEmpty');
var resolveImmediate=require('fbjs/lib/resolveImmediate');

var recordStore=RelayStoreData.getDefaultInstance().getRecordStore();

























var subscribers=[];




var broadcastItems=null;







var dataIDToFragmentNameMap=new Map();







var rootCallToFragmentNameMap=new Map();




var parentToChildQueryMap=new Map();








var GraphQLDeferredQueryTracker={






addListenerForFragment:function(
dataID,
fragmentID,
callbacks)
{
var subscriber={
callbacks:callbacks,
dataID:dataID,
fragmentID:fragmentID};

subscribers.push(subscriber);
return {
remove:function(){
var index=subscribers.indexOf(subscriber);
!(
index >= 0)?process.env.NODE_ENV !== 'production'?invariant(false,
'remove() can only be called once'):invariant(false):undefined;

subscribers[index] = null;}};},








recordQuery:function(
query)
{
var parentID=getQueryParentID(query);
if(parentID){

var children=parentToChildQueryMap.get(parentID) || [];
children.push(query);
parentToChildQueryMap.set(parentID,children);}else 
{
var deferredFragmentNames=query.getDeferredFragmentNames();
if(deferredFragmentNames){

var dataIDs=getRootCallToIDMap(query);
forEachObject(dataIDs,function(dataID,rootCall){
if(dataID){
var dataIDSet=dataIDToFragmentNameMap.get(dataID) || {};
Object.assign(dataIDSet,deferredFragmentNames);
dataIDToFragmentNameMap.set(dataID,dataIDSet);}else 
{
var rootCallSet=
rootCallToFragmentNameMap.get(rootCall) || {};
Object.assign(rootCallSet,deferredFragmentNames);
rootCallToFragmentNameMap.set(rootCall,rootCallSet);}});}}},










resolveQuery:function(
query,
response,
refParams)
{
var parentID=getQueryParentID(query);
resolveFragmentsForRootCall(query);
if(query.isDeferred()){
resolveDeferredQuery(query,broadcastChangeForFragment,refParams);
if(parentID){
resolveDeferredRefQuery(query);}}else 

if(response){
resolveDeferredParentQuery(query,response);}},






rejectQuery:function(
query,
error)
{
var parentID=getQueryParentID(query);
if(query.isDeferred()){
rejectDeferredFragmentsForRootCall(query);
resolveDeferredQuery(query,function(dataID,fragmentID){
broadcastErrorForFragment(dataID,fragmentID,error);});

if(parentID){
resolveDeferredRefQuery(query);}}else 

{
rejectDeferredParentQuery(query);}},







isQueryPending:function(
dataID,
fragmentID)
{
if(dataIDToFragmentNameMap.has(dataID)){
var dataIDSet=dataIDToFragmentNameMap.get(dataID);
if(dataIDSet.hasOwnProperty(fragmentID)){
return true;}}



return false;},





reset:function(){
dataIDToFragmentNameMap = new Map();
parentToChildQueryMap = new Map();
rootCallToFragmentNameMap = new Map();
subscribers = [];
broadcastItems = null;}};







function resolveDeferredQuery(
query,
callback,
refParams)
{
var deferredFragmentNames=query.getDeferredFragmentNames();
if(!deferredFragmentNames){
return;}

var dataIDs={};
var batchCall=query.getBatchCall();
if(batchCall){

var refIDs=refParams && refParams[batchCall.refParamName];
if(refIDs != null){
refIDs = Array.isArray(refIDs)?refIDs:[refIDs];
refIDs.forEach(function(id){return dataIDs[id] = id;});}}else 

{
dataIDs = getRootCallToIDMap(query);}

forEachObject(dataIDs,function(dataID){
if(dataID && dataIDToFragmentNameMap.has(dataID)){
var dataIDSet=dataIDToFragmentNameMap.get(dataID);
forEachObject(deferredFragmentNames,function(fragmentID){
delete dataIDSet[fragmentID];
callback(dataID,fragmentID);});

if(!isEmpty(dataIDSet)){
dataIDToFragmentNameMap.set(dataID,dataIDSet);}else 
{
dataIDToFragmentNameMap.delete(dataID);}}});}








function resolveDeferredRefQuery(
query)
{
var parentID=getQueryParentID(query);
var children=parentToChildQueryMap.get(parentID) || [];
children = children.filter(function(q){return q !== query;});
if(children.length){
parentToChildQueryMap.set(parentID,children);}else 
{
parentToChildQueryMap.delete(parentID);}}






function resolveDeferredParentQuery(
query,
response)
{

var children=parentToChildQueryMap.get(query.getID()) || [];
for(var ii=0;ii < children.length;ii++) {
var childQuery=children[ii];
var childFragmentNames=childQuery.getDeferredFragmentNames();
var childDataIDs=getRefParamFromResponse(response,childQuery);
forEachObject(childDataIDs,function(dataID){
var dataIDSet=dataIDToFragmentNameMap.get(dataID) || {};
Object.assign(dataIDSet,childFragmentNames);
dataIDToFragmentNameMap.set(dataID,dataIDSet);});}}








function resolveFragmentsForRootCall(
query)
{
var rootCallMap=getRootCallToIDMap(query);
forEachObject(rootCallMap,function(dataID,rootCall){
if(dataID && rootCallToFragmentNameMap.has(rootCall)){
var rootCallSet=rootCallToFragmentNameMap.get(rootCall) || {};
var dataIDSet=dataIDToFragmentNameMap.get(dataID) || {};
Object.assign(dataIDSet,rootCallSet);
dataIDToFragmentNameMap.set(dataID,dataIDSet);
rootCallToFragmentNameMap.delete(rootCall);}});}







function rejectDeferredFragmentsForRootCall(
query)
{
var rootCallMap=getRootCallToIDMap(query);
var deferredFragmentNames=query.getDeferredFragmentNames();
forEachObject(rootCallMap,function(dataID,rootCall){
if(rootCallToFragmentNameMap.has(rootCall)){
var rootCallSet=rootCallToFragmentNameMap.get(rootCall) || {};
forEachObject(deferredFragmentNames,function(fragmentID){
delete rootCallSet[fragmentID];});

if(!isEmpty(rootCallSet)){
rootCallToFragmentNameMap.delete(rootCall);}else 
{
rootCallToFragmentNameMap.set(rootCall,rootCallSet);}}});}









function rejectDeferredParentQuery(
query)
{
var parentID=query.getID();
parentToChildQueryMap.delete(parentID);}






function broadcastChangeForFragment(
dataID,
fragmentID)
{
if(!broadcastItems){
broadcastItems = [];
resolveImmediate(processBroadcasts);}

broadcastItems.push({dataID:dataID,fragmentID:fragmentID,error:null});}






function broadcastErrorForFragment(
dataID,
fragmentID,
error)
{
if(!broadcastItems){
broadcastItems = [];
resolveImmediate(processBroadcasts);}

broadcastItems.push({dataID:dataID,fragmentID:fragmentID,error:error});}





function processBroadcasts(){
if(!broadcastItems){
return;}


for(var ii=0;ii < subscribers.length;ii++) {
for(var jj=0;jj < broadcastItems.length;jj++) {
var subscriber=subscribers[ii];
if(subscriber){var _broadcastItems$jj=




broadcastItems[jj];var dataID=_broadcastItems$jj.dataID;var error=_broadcastItems$jj.error;var fragmentID=_broadcastItems$jj.fragmentID;
var method;
var args;
if(error){
method = subscriber.callbacks.onFailure;
args = [dataID,fragmentID,error];}else 
{
method = subscriber.callbacks.onSuccess;
args = [dataID,fragmentID];}

ErrorUtils.applyWithGuard(
method,
null,
args,
null,
'GraphQLDeferredQueryTracker');}}}





subscribers = subscribers.filter(function(subscriber){return subscriber !== null;});
broadcastItems = null;}





function getRefParamFromResponse(
response,
query)
{
var batchCall=query.getBatchCall();
var refTarget=batchCall?batchCall.sourceQueryPath:null;
if(!refTarget){
return {};}

var values={};
var tokens=refTarget.split('.');

getRefParamFromNode(values,response,tokens,1);
return values;}






function getRefParamFromNode(
values,
node,
tokens,
index)
{
if(index === tokens.length && typeof node === 'string'){

values[node] = node;
return;}else 
if(

index >= tokens.length || 
!node || 
typeof node !== 'object' || 
Array.isArray(node))
{
return;}

var token=tokens[index];
if(token === '*'){
forEachObject(node,function(subNode){
getRefParamFromNode(values,subNode,tokens,index + 1);});}else 

if(node.hasOwnProperty(token)){
getRefParamFromNode(values,node[token],tokens,index + 1);}}






function getQueryParentID(
query)
{
var batchCall=query.getBatchCall();
if(batchCall){
return batchCall.sourceQueryID;}

return null;}


function getRootCallToIDMap(
query)
{
var mapping={};
if(!query.getBatchCall()){
forEachRootCallArg(query,function(identifyingArgValue,fieldName){
var rootCallString=identifyingArgValue == null?
fieldName + '()':
fieldName + '(' + identifyingArgValue + ')';

mapping[rootCallString] = 
recordStore.getDataID(fieldName,identifyingArgValue);});}


return mapping;}

module.exports = GraphQLDeferredQueryTracker;