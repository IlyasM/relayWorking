var _slicedToArray=(function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n = (_s = _i.next()).done);_n = true) {_arr.push(_s.value);if(i && _arr.length === i)break;}}catch(err) {_d = true;_e = err;}finally {try{if(!_n && _i['return'])_i['return']();}finally {if(_d)throw _e;}}return _arr;}return function(arr,i){if(Array.isArray(arr)){return arr;}else if(Symbol.iterator in Object(arr)){return sliceIterator(arr,i);}else {throw new TypeError('Invalid attempt to destructure non-iterable instance');}};})();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}












'use strict';
var GraphQLStoreChangeEmitter=require('./GraphQLStoreChangeEmitter');
var RelayError=require('./RelayError');



var RelayStoreData=require('./RelayStoreData');









var emptyFunction=require('fbjs/lib/emptyFunction');
var filterExclusiveKeys=require('./filterExclusiveKeys');
var invariant=require('fbjs/lib/invariant');
var readRelayQueryData=require('./readRelayQueryData');










function observeRelayQueryData(
store,
queryNode,
dataID,
options)
{
return new RelayQueryDataObservable(
readRelayQueryData.bind(null,store,queryNode,dataID,options),
dataID);}var 



RelayQueryDataObservable=(function(){














function RelayQueryDataObservable(
readQueryData,
dataID)
{_classCallCheck(this,RelayQueryDataObservable);
this._activeSubscriptions = 0;
this._changeListener = null;
this._data = null;
this._dataID = dataID;
this._lastError = null;
this._observedDataIDs = {};
this._readQueryData = readQueryData;
this._subscriptions = [];

this._handleChange = this._handleChange.bind(this);
this._handleData = this._handleData.bind(this);
this._handleError = this._handleError.bind(this);

this._garbageCollector = 
RelayStoreData.getDefaultInstance().getGarbageCollector();}RelayQueryDataObservable.prototype.


subscribe = function subscribe(callbacks){var _this=this;


if(!this._subscriptions.length){
this._watchQueryData();}




if(this._lastError){
callbacks.onError(this._lastError);
return {
dispose:emptyFunction};}



var index=this._subscriptions.length;
var isDisposed=false;
this._subscriptions.push(callbacks);
callbacks.onNext(this._data);
this._activeSubscriptions++;

return {
dispose:function(){
!
!isDisposed?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayObserver.dispose(): Subscription was already disposed.'):invariant(false):undefined;


_this._subscriptions[index] = null;
_this._activeSubscriptions--;
isDisposed = true;


if(!_this._activeSubscriptions){
_this._unregisterChangeListener();
_this._data = null;
_this._subscriptions = [];

_this._updateGarbageCollectorSubscriptionCount({});

_this._observedDataIDs = {};}}};};RelayQueryDataObservable.prototype.











_handleChange = function _handleChange(){


this._watchQueryData();
this._subscriptions.forEach(
this._lastError?this._handleError:this._handleData);};RelayQueryDataObservable.prototype.






_handleData = function _handleData(subscriber){
subscriber && subscriber.onNext(this._data);};RelayQueryDataObservable.prototype.






_handleError = function _handleError(subscriber){
subscriber && this._lastError && subscriber.onError(this._lastError);};RelayQueryDataObservable.prototype.






_registerChangeListener = function _registerChangeListener(dataIDs){
this._unregisterChangeListener();

if(dataIDs.length){
this._changeListener = GraphQLStoreChangeEmitter.addListenerForIDs(
dataIDs,
this._handleChange);}};RelayQueryDataObservable.prototype.







_unregisterChangeListener = function _unregisterChangeListener(){
if(this._changeListener){
this._changeListener.remove();
this._changeListener = null;}};RelayQueryDataObservable.prototype.







_watchQueryData = function _watchQueryData(){var _readQueryData=
this._readQueryData();var data=_readQueryData.data;var dataIDs=_readQueryData.dataIDs;

if(data === undefined){
this._lastError = RelayError.create(
'RelayObserverError',
this._changeListener !== null?
'Record `%s` was purged from the store.':
'Record `%s` has not been fetched.',
this._dataID);




this._unregisterChangeListener();

this._updateGarbageCollectorSubscriptionCount({});

this._observedDataIDs = {};
return;}


this._data = data;
this._registerChangeListener(Object.keys(dataIDs));
this._updateGarbageCollectorSubscriptionCount(dataIDs);

this._observedDataIDs = dataIDs;};RelayQueryDataObservable.prototype.








_updateGarbageCollectorSubscriptionCount = function _updateGarbageCollectorSubscriptionCount(
nextDataIDs)
{
if(this._garbageCollector){
var garbageCollector=this._garbageCollector;

var prevDataIDs=this._observedDataIDs;var _filterExclusiveKeys=
filterExclusiveKeys(prevDataIDs,nextDataIDs);var _filterExclusiveKeys2=_slicedToArray(_filterExclusiveKeys,2);var removed=_filterExclusiveKeys2[0];var added=_filterExclusiveKeys2[1];

added.forEach(function(id){return garbageCollector.increaseSubscriptionsFor(id);});
removed.forEach(function(id){return garbageCollector.decreaseSubscriptionsFor(id);});}};return RelayQueryDataObservable;})();




module.exports = observeRelayQueryData;