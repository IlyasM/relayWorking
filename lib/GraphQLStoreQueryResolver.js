var _slicedToArray=(function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n = (_s = _i.next()).done);_n = true) {_arr.push(_s.value);if(i && _arr.length === i)break;}}catch(err) {_d = true;_e = err;}finally {try{if(!_n && _i['return'])_i['return']();}finally {if(_d)throw _e;}}return _arr;}return function(arr,i){if(Array.isArray(arr)){return arr;}else if(Symbol.iterator in Object(arr)){return sliceIterator(arr,i);}else {throw new TypeError('Invalid attempt to destructure non-iterable instance');}};})();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}












'use strict';



var GraphQLStoreChangeEmitter=require('./GraphQLStoreChangeEmitter');
var GraphQLStoreRangeUtils=require('./GraphQLStoreRangeUtils');


var RelayProfiler=require('./RelayProfiler');

var RelayStoreData=require('./RelayStoreData');


var filterExclusiveKeys=require('./filterExclusiveKeys');
var readRelayQueryData=require('./readRelayQueryData');
var recycleNodesInto=require('./recycleNodesInto');var 











GraphQLStoreQueryResolver=(function(){







function GraphQLStoreQueryResolver(fragmentPointer,callback){_classCallCheck(this,GraphQLStoreQueryResolver);
this.reset();
this._fragmentPointer = fragmentPointer;
this._callback = callback;
this._resolver = null;}GraphQLStoreQueryResolver.prototype.






reset = function reset(){
if(this._resolver){
this._resolver.reset();}};GraphQLStoreQueryResolver.prototype.



resolve = function resolve(
fragmentPointer)
{
var resolver=this._resolver;
if(!resolver){
resolver = this._fragmentPointer.getFragment().isPlural()?
new GraphQLStorePluralQueryResolver(this._callback):
new GraphQLStoreSingleQueryResolver(this._callback);
this._resolver = resolver;}

return resolver.resolve(fragmentPointer);};return GraphQLStoreQueryResolver;})();var 






GraphQLStorePluralQueryResolver=(function(){




function GraphQLStorePluralQueryResolver(callback){_classCallCheck(this,GraphQLStorePluralQueryResolver);
this.reset();
this._callback = callback;}GraphQLStorePluralQueryResolver.prototype.


reset = function reset(){
if(this._resolvers){
this._resolvers.forEach(function(resolver){return resolver.reset();});}

this._resolvers = [];
this._results = [];};GraphQLStorePluralQueryResolver.prototype.









resolve = function resolve(fragmentPointer){
var prevResults=this._results;
var nextResults;

var nextIDs=fragmentPointer.getDataIDs();
var prevLength=prevResults.length;
var nextLength=nextIDs.length;
var resolvers=this._resolvers;


while(resolvers.length < nextLength) {
resolvers.push(
new GraphQLStoreSingleQueryResolver(this._callback));}


while(resolvers.length > nextLength) {
resolvers.pop().reset();}



if(prevLength !== nextLength){
nextResults = [];}

for(var ii=0;ii < nextLength;ii++) {
var nextResult=resolvers[ii].resolve(fragmentPointer,nextIDs[ii]);
if(nextResults || ii >= prevLength || nextResult !== prevResults[ii]){
nextResults = nextResults || prevResults.slice(0,ii);
nextResults.push(nextResult);}}



if(nextResults){
this._results = nextResults;}

return this._results;};return GraphQLStorePluralQueryResolver;})();var 






GraphQLStoreSingleQueryResolver=(function(){









function GraphQLStoreSingleQueryResolver(callback){_classCallCheck(this,GraphQLStoreSingleQueryResolver);
this.reset();
this._callback = callback;
this._garbageCollector = 
RelayStoreData.getDefaultInstance().getGarbageCollector();
this._subscribedIDs = {};}GraphQLStoreSingleQueryResolver.prototype.


reset = function reset(){
if(this._subscription){
this._subscription.remove();}

this._hasDataChanged = false;
this._fragment = null;
this._result = null;
this._resultID = null;
this._subscription = null;
this._updateGarbageCollectorSubscriptionCount({});
this._subscribedIDs = {};};GraphQLStoreSingleQueryResolver.prototype.







resolve = function resolve(
fragmentPointer,
nextPluralID)
{
var nextFragment=fragmentPointer.getFragment();
var prevFragment=this._fragment;

var nextID=nextPluralID || fragmentPointer.getDataID();
var prevID=this._resultID;
var nextResult;
var prevResult=this._result;
var subscribedIDs;

if(
prevFragment != null && 
prevID != null && 
getCanonicalID(prevID) === getCanonicalID(nextID))
{
if(
prevID !== nextID || 
this._hasDataChanged || 
!nextFragment.isEquivalent(prevFragment))
{var _resolveFragment=


resolveFragment(nextFragment,nextID);var _resolveFragment2=_slicedToArray(_resolveFragment,2);nextResult = _resolveFragment2[0];subscribedIDs = _resolveFragment2[1];
nextResult = recycleNodesInto(prevResult,nextResult);}else 
{

nextResult = prevResult;}}else 

{var _resolveFragment3=

resolveFragment(nextFragment,nextID);var _resolveFragment32=_slicedToArray(_resolveFragment3,2);nextResult = _resolveFragment32[0];subscribedIDs = _resolveFragment32[1];}



if(prevResult !== nextResult){
if(this._subscription){
this._subscription.remove();
this._subscription = null;}

if(subscribedIDs){
this._subscription = GraphQLStoreChangeEmitter.addListenerForIDs(
Object.keys(subscribedIDs),
this._handleChange.bind(this));

this._updateGarbageCollectorSubscriptionCount(subscribedIDs);
this._subscribedIDs = subscribedIDs;}

this._resultID = nextID;
this._result = nextResult;}


this._hasDataChanged = false;
this._fragment = nextFragment;

return this._result;};GraphQLStoreSingleQueryResolver.prototype.


_handleChange = function _handleChange(){
if(!this._hasDataChanged){
this._hasDataChanged = true;
this._callback();}};GraphQLStoreSingleQueryResolver.prototype.






_updateGarbageCollectorSubscriptionCount = function _updateGarbageCollectorSubscriptionCount(
nextDataIDs)
{
if(this._garbageCollector){
var garbageCollector=this._garbageCollector;

var prevDataIDs=this._subscribedIDs;var _filterExclusiveKeys=
filterExclusiveKeys(prevDataIDs,nextDataIDs);var _filterExclusiveKeys2=_slicedToArray(_filterExclusiveKeys,2);var removed=_filterExclusiveKeys2[0];var added=_filterExclusiveKeys2[1];

added.forEach(function(id){return garbageCollector.increaseSubscriptionsFor(id);});
removed.forEach(function(id){return garbageCollector.decreaseSubscriptionsFor(id);});}};return GraphQLStoreSingleQueryResolver;})();




function resolveFragment(
fragment,
dataID)
{
var store=RelayStoreData.getDefaultInstance().getQueuedStore();var _readRelayQueryData=
readRelayQueryData(store,fragment,dataID);var data=_readRelayQueryData.data;var dataIDs=_readRelayQueryData.dataIDs;
return [data,dataIDs];}







function getCanonicalID(id){
return GraphQLStoreRangeUtils.getCanonicalClientID(id);}


RelayProfiler.instrumentMethods(GraphQLStoreQueryResolver.prototype,{
resolve:'GraphQLStoreQueryResolver.resolve'});


module.exports = GraphQLStoreQueryResolver;