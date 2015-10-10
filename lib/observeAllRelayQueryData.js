var _slicedToArray=(function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n = (_s = _i.next()).done);_n = true) {_arr.push(_s.value);if(i && _arr.length === i)break;}}catch(err) {_d = true;_e = err;}finally {try{if(!_n && _i['return'])_i['return']();}finally {if(_d)throw _e;}}return _arr;}return function(arr,i){if(Array.isArray(arr)){return arr;}else if(Symbol.iterator in Object(arr)){return sliceIterator(arr,i);}else {throw new TypeError('Invalid attempt to destructure non-iterable instance');}};})();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}












'use strict';













var emptyFunction=require('fbjs/lib/emptyFunction');
var filterExclusiveKeys=require('./filterExclusiveKeys');
var forEachObject=require('fbjs/lib/forEachObject');
var invariant=require('fbjs/lib/invariant');
var observeRelayQueryData=require('./observeRelayQueryData');












var DATAID_REMOVED={};

function observeAllRelayQueryData(
store,
queryNode,
dataIDs,
options)
{
return new RelayQueryMultipleDataObservable(
function(dataID){return observeRelayQueryData(store,queryNode,dataID,options);},
dataIDs);}var 



RelayQueryMultipleDataObservable=(function(){











function RelayQueryMultipleDataObservable(
observeRelayQueryData,
dataIDs)
{_classCallCheck(this,RelayQueryMultipleDataObservable);
this._activeSubscriptions = 0;
this._dataIDs = Object.keys(toObject(dataIDs));
this._lastError = null;
this._observeRelayQueryData = observeRelayQueryData;
this._observers = null;
this._shouldExecuteCallbacks = false;
this._subscribeCalls = [];
this._subscriptions = {};
this._wrappedData = {};}RelayQueryMultipleDataObservable.prototype.


subscribe = function subscribe(
callbacks)
{var _this=this;


if(this._lastError){
callbacks.onError(this._lastError);
return {
dispose:emptyFunction};}




if(!this._observers){
this._setupObservers(this._dataIDs);}




var dataIDToSubscriptionIndex={};
this._addSubscriptions(this._dataIDs,dataIDToSubscriptionIndex,callbacks);


if(this._lastError){
callbacks.onError(this._lastError);
this._disposeSubscriptions(dataIDToSubscriptionIndex);
return {
dispose:emptyFunction};}


this._subscribeCalls.push({callbacks:callbacks,dataIDToSubscriptionIndex:dataIDToSubscriptionIndex});

callbacks.onNext(unwrapData(this._wrappedData));
var index=this._subscribeCalls.length - 1;
var isDisposed=false;
this._activeSubscriptions++;

return {
dispose:function(){
!
!isDisposed?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayObserver.dispose(): Subscription was already disposed.'):invariant(false):undefined;

isDisposed = true;

_this._activeSubscriptions--;
_this._disposeSubscriptions(dataIDToSubscriptionIndex);
_this._subscribeCalls[index] = null;

if(!_this._activeSubscriptions){
_this._observers = null;
_this._subscribeCalls = [];
_this._subscriptions = {};
_this._wrappedData = {};}}};};RelayQueryMultipleDataObservable.prototype.









setDataIDs = function setDataIDs(dataIDs){var _this2=this;
!
!this._lastError?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayObserver.setDataIDs(): Unable to update records on a defunct ' + 
'observer.'):invariant(false):undefined;

var dataIDSet=toObject(dataIDs);
this._dataIDs = Object.keys(dataIDSet);var _filterExclusiveKeys=


filterExclusiveKeys(this._observers,dataIDSet);var _filterExclusiveKeys2=_slicedToArray(_filterExclusiveKeys,2);var removedDataIDs=_filterExclusiveKeys2[0];var addedDataIDs=_filterExclusiveKeys2[1];


removedDataIDs.forEach(function(dataID){
var subscriptions=_this2._subscriptions[dataID];
if(subscriptions){
subscriptions.forEach(function(subscription){
subscription && subscription.dispose();
_this2._wrappedData[dataID] = DATAID_REMOVED;});

_this2._subscriptions[dataID] = null;}});



this._setupObservers(addedDataIDs);
this._subscribeCalls.forEach(function(call){

call && _this2._addSubscriptions(
addedDataIDs,
call.dataIDToSubscriptionIndex);});





if(this._lastError){
this._callOnError();}else 
{
this._wrappedData = reorderObjectKeys(this._dataIDs,this._wrappedData);
this._callOnNext();}};RelayQueryMultipleDataObservable.prototype.







_addSubscriptions = function _addSubscriptions(
dataIDs,
indices)
{var _this3=this;
this._shouldExecuteCallbacks = false;
dataIDs.forEach(function(dataID){
if(_this3._observers){
var observer=_this3._observers[dataID];
if(observer){
var subscriptions=
_this3._subscriptions[dataID] || (_this3._subscriptions[dataID] = []);

indices[dataID] = subscriptions.length;
subscriptions.push(observer.subscribe({
onCompleted:function(){return _this3._handleCompleted(dataID);},
onError:function(error){return _this3._handleError(dataID,error);},
onNext:function(data){return _this3._handleNext(dataID,data);}}));}}});




this._shouldExecuteCallbacks = true;};RelayQueryMultipleDataObservable.prototype.







_callOnError = function _callOnError(){var _this4=this;
this._shouldExecuteCallbacks && this._subscribeCalls.forEach(function(call){
call && _this4._lastError && call.callbacks.onError(_this4._lastError);});};RelayQueryMultipleDataObservable.prototype.








_callOnNext = function _callOnNext(){var _this5=this;
this._shouldExecuteCallbacks && this._subscribeCalls.forEach(function(call){
if(call){
call.callbacks.onNext(unwrapData(_this5._wrappedData));}});};RelayQueryMultipleDataObservable.prototype.







_disposeSubscriptions = function _disposeSubscriptions(indices){var _this6=this;
forEachObject(indices,function(index,dataID){
var subscriptions=_this6._subscriptions[dataID];
if(subscriptions && subscriptions[index]){
subscriptions[index].dispose();
subscriptions[index] = null;}});};RelayQueryMultipleDataObservable.prototype.




_handleCompleted = function _handleCompleted(dataID){
this._subscribeCalls.forEach(function(call){
call && call.callbacks.onCompleted();});};RelayQueryMultipleDataObservable.prototype.






_handleError = function _handleError(dataID,error){
this._lastError = error;
this._callOnError();};RelayQueryMultipleDataObservable.prototype.


_handleNext = function _handleNext(dataID,data){
this._wrappedData[dataID] = data;
this._callOnNext();};RelayQueryMultipleDataObservable.prototype.






_setupObservers = function _setupObservers(dataIDs){var _this7=this;
if(!this._observers){
this._observers = {};}

dataIDs.forEach(function(dataID){
var observer=_this7._observeRelayQueryData(dataID);

if(_this7._observers){
_this7._observers[dataID] = observer;}});};return RelayQueryMultipleDataObservable;})();









function reorderObjectKeys(
reference,
input)
{
var orderedInput={};
reference.forEach(function(key){
!
input.hasOwnProperty(key)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayObserver.setDataIDs(): Expected object to have key `%s`.',
key):invariant(false):undefined;

orderedInput[key] = input[key];});

return orderedInput;}


function toObject(dataIDs){
var dataIDSet={};
dataIDs.forEach(function(dataID){
dataIDSet[dataID] = null;});

return dataIDSet;}


function unwrapData(wrappedData){
var unwrappedData=[];
forEachObject(wrappedData,function(data){
if(data !== DATAID_REMOVED){
unwrappedData.push(data);}});


return unwrappedData;}


module.exports = observeAllRelayQueryData;