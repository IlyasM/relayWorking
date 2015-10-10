function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}












'use strict';

var Deferred=require('fbjs/lib/Deferred');
var DliteFetchModeConstants=require('./DliteFetchModeConstants');
var GraphQLDeferredQueryTracker=require('./GraphQLDeferredQueryTracker');
var Promise=require('fbjs/lib/Promise');
var PromiseMap=require('fbjs/lib/PromiseMap');


var RelayTaskScheduler=require('./RelayTaskScheduler');


var containsRelayQueryRootCall=require('./containsRelayQueryRootCall');
var everyObject=require('fbjs/lib/everyObject');
var fetchRelayQuery=require('./fetchRelayQuery');
var invariant=require('fbjs/lib/invariant');
var subtractRelayQuery=require('./subtractRelayQuery');












var pendingFetchMap={};


var preloadQueryMap=new PromiseMap();var 

PendingFetch=(function(){






















function PendingFetch(
_ref)
{var fetchMode=_ref.fetchMode;var forceIndex=_ref.forceIndex;var query=_ref.query;var storeData=_ref.storeData;_classCallCheck(this,PendingFetch);
var queryID=query.getID();
this._storeData = storeData;
this._query = query;
this._forceIndex = forceIndex;

this._resolvedSubtractedQuery = false;
this._resolvedDeferred = new Deferred();

this._dependents = [];
this._pendingDependencyMap = {};

var subtractedQuery;
if(fetchMode === DliteFetchModeConstants.FETCH_MODE_PRELOAD){
subtractedQuery = query;
this._fetchSubtractedQueryPromise = preloadQueryMap.get(queryID);}else 
{
subtractedQuery = this._subtractPending(query);
this._fetchSubtractedQueryPromise = subtractedQuery?
fetchRelayQuery(subtractedQuery):
Promise.resolve();}


this._fetchedSubtractedQuery = !subtractedQuery;
this._errors = [];

if(subtractedQuery){
pendingFetchMap[queryID] = {
fetch:this,
query:subtractedQuery};

GraphQLDeferredQueryTracker.recordQuery(subtractedQuery);
this._fetchSubtractedQueryPromise.done(
this._handleSubtractedQuerySuccess.bind(this,subtractedQuery),
this._handleSubtractedQueryFailure.bind(this,subtractedQuery));}else 

{
this._markSubtractedQueryAsResolved();}}PendingFetch.prototype.
















_subtractPending = function _subtractPending(query){var _this=this;
everyObject(pendingFetchMap,function(pending){

if(!query){
return false;}

if(containsRelayQueryRootCall(pending.query,query)){
var subtractedQuery=subtractRelayQuery(query,pending.query);
if(subtractedQuery !== query){
query = subtractedQuery;
_this._addPendingDependency(pending.fetch);}}


return true;});

return query;};PendingFetch.prototype.


_addPendingDependency = function _addPendingDependency(pendingFetch){
var queryID=pendingFetch.getQuery().getID();
this._pendingDependencyMap[queryID] = pendingFetch;
pendingFetch._addDependent(this);};PendingFetch.prototype.


_addDependent = function _addDependent(pendingFetch){
this._dependents.push(pendingFetch);};PendingFetch.prototype.


_handleSubtractedQuerySuccess = function _handleSubtractedQuerySuccess(
subtractedQuery,
result)
{var _this2=this;
this._fetchedSubtractedQuery = true;

RelayTaskScheduler.await(function(){
var response=result.response;
!(
response && typeof response === 'object')?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayPendingQueryTracker: Expected response to be an object, got ' + 
'`%s`.',
response?typeof response:response):invariant(false):undefined;

_this2._storeData.handleQueryPayload(
subtractedQuery,
response,
_this2._forceIndex);

GraphQLDeferredQueryTracker.resolveQuery(
subtractedQuery,
response,
result.ref_params);}).

done(
this._markSubtractedQueryAsResolved.bind(this),
this._markAsRejected.bind(this));};PendingFetch.prototype.



_handleSubtractedQueryFailure = function _handleSubtractedQueryFailure(
subtractedQuery,
error)
{
GraphQLDeferredQueryTracker.rejectQuery(subtractedQuery,error);

this._markAsRejected(error);};PendingFetch.prototype.


_markSubtractedQueryAsResolved = function _markSubtractedQueryAsResolved(){
var queryID=this.getQuery().getID();
delete pendingFetchMap[queryID];

this._resolvedSubtractedQuery = true;
this._updateResolvedDeferred();

this._dependents.forEach(function(dependent){return (
dependent._markDependencyAsResolved(queryID));});};PendingFetch.prototype.



_markAsRejected = function _markAsRejected(error){
var queryID=this.getQuery().getID();
delete pendingFetchMap[queryID];

console.warn(error.message);

this._errors.push(error);
this._updateResolvedDeferred();

this._dependents.forEach(function(dependent){return (
dependent._markDependencyAsRejected(queryID,error));});};PendingFetch.prototype.



_markDependencyAsResolved = function _markDependencyAsResolved(dependencyQueryID){
delete this._pendingDependencyMap[dependencyQueryID];

this._updateResolvedDeferred();};PendingFetch.prototype.


_markDependencyAsRejected = function _markDependencyAsRejected(dependencyQueryID,error){
delete this._pendingDependencyMap[dependencyQueryID];

this._errors.push(error);
this._updateResolvedDeferred();};PendingFetch.prototype.





_updateResolvedDeferred = function _updateResolvedDeferred(){
if(this._isSettled() && !this._resolvedDeferred.isSettled()){
if(this._errors.length){
this._resolvedDeferred.reject(this._errors[0]);}else 
{
this._resolvedDeferred.resolve(undefined);}}};PendingFetch.prototype.




_isSettled = function _isSettled(){
return this._errors.length > 0 || 
this._resolvedSubtractedQuery && !hasItems(this._pendingDependencyMap);};PendingFetch.prototype.


getQuery = function getQuery(){
return this._query;};PendingFetch.prototype.


getResolvedPromise = function getResolvedPromise(){
return this._resolvedDeferred.getPromise();};PendingFetch.prototype.







isResolvable = function isResolvable(){
if(this._fetchedSubtractedQuery){
return everyObject(
this._pendingDependencyMap,
function(pendingDependency){return pendingDependency._fetchedSubtractedQuery;});}




return false;};return PendingFetch;})();



function hasItems(map){
return !!Object.keys(map).length;}











var RelayPendingQueryTracker={




add:function(params){
return new PendingFetch(params);},


hasPendingQueries:function(){
return hasItems(pendingFetchMap);},





resetPending:function(){
pendingFetchMap = {};
GraphQLDeferredQueryTracker.reset();},


resolvePreloadQuery:function(queryID,result){
preloadQueryMap.resolveKey(queryID,result);},


rejectPreloadQuery:function(queryID,error){
preloadQueryMap.rejectKey(queryID,error);},



PendingFetch:PendingFetch};



module.exports = RelayPendingQueryTracker;