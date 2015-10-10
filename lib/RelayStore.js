'use strict';














var GraphQLQueryRunner=require('./GraphQLQueryRunner');

var RelayMutationTransaction=require('./RelayMutationTransaction');

var RelayStoreData=require('./RelayStoreData');

var forEachRootCallArg=require('./forEachRootCallArg');
var observeAllRelayQueryData=require('./observeAllRelayQueryData');
var observeRelayQueryData=require('./observeRelayQueryData');
var readRelayQueryData=require('./readRelayQueryData');
















var queuedStore=RelayStoreData.getDefaultInstance().getQueuedStore();




































var RelayStore={





primeCache:function(
querySet,
callback)
{
return GraphQLQueryRunner.run(querySet,callback);},






forceFetch:function(
querySet,
callback)
{
return GraphQLQueryRunner.forceFetch(querySet,callback);},





read:function(
node,
dataID,
options)
{
return readRelayQueryData(queuedStore,node,dataID,options).data;},





readAll:function(
node,
dataIDs,
options)
{
return dataIDs.map(
function(dataID){return readRelayQueryData(queuedStore,node,dataID,options).data;});},








readQuery:function(
root,
options)
{
var results=[];
forEachRootCallArg(root,function(identifyingArgValue,fieldName){
var data;
var dataID=queuedStore.getDataID(fieldName,identifyingArgValue);
if(dataID != null){
data = RelayStore.read(root,dataID,options);}

results.push(data);});

return results;},






observe:function(
node,
dataID,
options)
{
return observeRelayQueryData(queuedStore,node,dataID,options);},






observeAll:function(
node,
dataIDs,
options)
{
return observeAllRelayQueryData(queuedStore,node,dataIDs,options);},


update:function(
mutation,
callbacks)
{
var transaction=new RelayMutationTransaction(mutation);
transaction.commit(callbacks);}};



module.exports = RelayStore;