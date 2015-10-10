function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i < arr.length;i++) arr2[i] = arr[i];return arr2;}else {return Array.from(arr);}}












'use strict';

var DliteFetchModeConstants=require('./DliteFetchModeConstants');


var RelayNetworkLayer=require('./RelayNetworkLayer');
var RelayPendingQueryTracker=require('./RelayPendingQueryTracker');
var RelayProfiler=require('./RelayProfiler');

var RelayStoreData=require('./RelayStoreData');
var RelayTaskScheduler=require('./RelayTaskScheduler');

var checkRelayQueryData=require('./checkRelayQueryData');
var diffRelayQuery=require('./diffRelayQuery');
var everyObject=require('fbjs/lib/everyObject');
var flattenSplitRelayQueries=require('./flattenSplitRelayQueries');
var forEachObject=require('fbjs/lib/forEachObject');
var generateForceIndex=require('./generateForceIndex');
var invariant=require('fbjs/lib/invariant');
var resolveImmediate=require('fbjs/lib/resolveImmediate');
var someObject=require('fbjs/lib/someObject');
var splitDeferredRelayQueries=require('./splitDeferredRelayQueries');
var warning=require('fbjs/lib/warning');















var storeData=RelayStoreData.getDefaultInstance();












var GraphQLQueryRunner={







run:function(
querySet,
callback,
fetchMode)
{
var profiler=RelayProfiler.profile('RelayStore.primeCache',querySet);
fetchMode = fetchMode || DliteFetchModeConstants.FETCH_MODE_CLIENT;

var diffQueries=[];
if(fetchMode === DliteFetchModeConstants.FETCH_MODE_CLIENT){
forEachObject(querySet,function(query){
if(query){
diffQueries.push.apply(diffQueries,_toConsumableArray(diffRelayQuery(
query,
storeData.getRecordStore(),
storeData.getQueryTracker())));}});}else 



{
forEachObject(querySet,function(query){
if(query){
diffQueries.push(query);}});}




return runQueries(diffQueries,callback,fetchMode,profiler);},









forceFetch:function(
querySet,
callback)
{
var profiler=RelayProfiler.profile('RelayStore.forceFetch',querySet);
var queries=[];
forEachObject(querySet,function(query){
query && queries.push(query);});


var fetchMode=DliteFetchModeConstants.FETCH_MODE_REFETCH;
return runQueries(queries,callback,fetchMode,profiler);}};




function canResolve(fetch){
return checkRelayQueryData(
storeData.getQueuedStore(),
fetch.getQuery());}



function hasItems(map){
return !!Object.keys(map).length;}


function splitAndFlattenQueries(
queries)
{
if(!RelayNetworkLayer.supports('defer')){
var hasDeferredDescendant=queries.some(function(query){
if(query.hasDeferredDescendant()){
process.env.NODE_ENV !== 'production'?warning(
false,
'Relay: Query `%s` contains a deferred fragment (e.g. ' + 
'`getFragment(\'foo\').defer()`) which is not supported by the ' + 
'default network layer. This query will be sent without deferral.',
query.getName()):undefined;

return true;}});


if(hasDeferredDescendant){
return queries;}}



var flattenedQueries=[];
queries.forEach(function(query){
return flattenedQueries.push.apply(flattenedQueries,_toConsumableArray(
flattenSplitRelayQueries(
splitDeferredRelayQueries(query))));});



return flattenedQueries;}


function runQueries(
queries,
callback,
fetchMode,
profiler)
{
var readyState={
aborted:false,
done:false,
error:null,
ready:false,
stale:false};

var scheduled=false;
function setReadyState(partial){
if(readyState.aborted){
return;}

if(readyState.done || readyState.error){
!
partial.aborted?process.env.NODE_ENV !== 'production'?invariant(false,
'GraphQLQueryRunner: Unexpected ready state change.'):invariant(false):undefined;

return;}

readyState = {
aborted:partial.aborted != null?partial.aborted:readyState.aborted,
done:partial.done != null?partial.done:readyState.done,
error:partial.error != null?partial.error:readyState.error,
ready:partial.ready != null?partial.ready:readyState.ready,
stale:partial.stale != null?partial.stale:readyState.stale};

if(scheduled){
return;}

scheduled = true;
resolveImmediate(function(){
scheduled = false;
callback(readyState);});}



var remainingFetchMap={};
var remainingRequiredFetchMap={};

function onResolved(pendingFetch){
var pendingQuery=pendingFetch.getQuery();
var pendingQueryID=pendingQuery.getID();
delete remainingFetchMap[pendingQueryID];
if(!pendingQuery.isDeferred()){
delete remainingRequiredFetchMap[pendingQueryID];}


if(hasItems(remainingRequiredFetchMap)){
return;}


if(someObject(remainingFetchMap,function(query){return query.isResolvable();})){


return;}


if(hasItems(remainingFetchMap)){
setReadyState({done:false,ready:true,stale:false});}else 
{
setReadyState({done:true,ready:true,stale:false});}}



function onRejected(pendingFetch,error){
setReadyState({error:error});

var pendingQuery=pendingFetch.getQuery();
var pendingQueryID=pendingQuery.getID();
delete remainingFetchMap[pendingQueryID];
if(!pendingQuery.isDeferred()){
delete remainingRequiredFetchMap[pendingQueryID];}}



RelayTaskScheduler.await(function(){
var forceIndex=fetchMode === DliteFetchModeConstants.FETCH_MODE_REFETCH?
generateForceIndex():null;

splitAndFlattenQueries(queries).forEach(function(query){
var pendingFetch=RelayPendingQueryTracker.add(
{query:query,fetchMode:fetchMode,forceIndex:forceIndex,storeData:storeData});

var queryID=query.getID();
remainingFetchMap[queryID] = pendingFetch;
if(!query.isDeferred()){
remainingRequiredFetchMap[queryID] = pendingFetch;}

pendingFetch.getResolvedPromise().then(
onResolved.bind(null,pendingFetch),
onRejected.bind(null,pendingFetch));});



if(!hasItems(remainingFetchMap)){
setReadyState({done:true,ready:true});}else 
{
if(!hasItems(remainingRequiredFetchMap)){
setReadyState({ready:true});}else 
{
setReadyState({ready:false});
storeData.runWithDiskCache(function(){
if(hasItems(remainingRequiredFetchMap)){
if(everyObject(remainingRequiredFetchMap,canResolve)){
setReadyState({ready:true,stale:true});}}});}}}).





done();


profiler.stop();

return {
abort:function(){
setReadyState({aborted:true});}};}




module.exports = GraphQLQueryRunner;