var _extends=Object.assign || function(target){for(var i=1;i < arguments.length;i++) {var source=arguments[i];for(var key in source) {if(Object.prototype.hasOwnProperty.call(source,key)){target[key] = source[key];}}}return target;};function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else {obj[key] = value;}return obj;}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}












'use strict';

var ErrorUtils=require('fbjs/lib/ErrorUtils');

var RelayConnectionInterface=require('./RelayConnectionInterface');
var RelayMutationQuery=require('./RelayMutationQuery');
var RelayMutationRequest=require('./RelayMutationRequest');
var RelayMutationTransactionStatus=require('./RelayMutationTransactionStatus');
var RelayNetworkLayer=require('./RelayNetworkLayer');
var RelayStoreData=require('./RelayStoreData');











var fromGraphQL=require('./fromGraphQL');
var invariant=require('fbjs/lib/invariant');
var nullthrows=require('fbjs/lib/nullthrows');
var resolveImmediate=require('fbjs/lib/resolveImmediate');var 







CLIENT_MUTATION_ID=RelayConnectionInterface.CLIENT_MUTATION_ID;

var collisionQueueMap={};
var pendingTransactionMap={};
var queue=[];
var transactionIDCounter=0;var 




RelayMutationTransaction=(function(){





















function RelayMutationTransaction(mutation){_classCallCheck(this,RelayMutationTransaction);
this._id = (transactionIDCounter++).toString(36);
this._mutation = mutation;
this._status = RelayMutationTransactionStatus.UNCOMMITTED;

pendingTransactionMap[this._id] = this;
queue.push(this);
this._handleOptimisticUpdate();}RelayMutationTransaction.


get = function get(id){
var transaction=pendingTransactionMap[id];
!
transaction?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayMutationTransaction: `%s` is not a valid pending transaction ID.',
id):invariant(false):undefined;

return transaction;};RelayMutationTransaction.prototype.


_assertIsPending = function _assertIsPending(){
!
pendingTransactionMap[this._id]?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayMutationTransaction: Only pending transactions can be interacted ' + 
'with.'):invariant(false):undefined;};RelayMutationTransaction.prototype.



commit = function commit(callbacks){
this._assertIsPending();
!(
this._status === RelayMutationTransactionStatus.UNCOMMITTED)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayMutationTransaction: Only transactions with status `UNCOMMITTED` ' + 
'can be comitted.'):invariant(false):undefined;


if(callbacks){
this._onCommitFailureCallback = callbacks.onFailure;
this._onCommitSuccessCallback = callbacks.onSuccess;}


this._queueForCommit();};RelayMutationTransaction.prototype.


getError = function getError(){
this._assertIsPending();
return this._error;};RelayMutationTransaction.prototype.


getStatus = function getStatus(){
this._assertIsPending();
return this._status;};RelayMutationTransaction.prototype.


recommit = function recommit(){
this._assertIsPending();
!(
this._status === RelayMutationTransactionStatus.COMMIT_FAILED || 
this._status === RelayMutationTransactionStatus.COLLISION_COMMIT_FAILED)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayMutationTransaction: Only transaction with status ' + 
'`COMMIT_FAILED` or `COLLISION_COMMIT_FAILED` can be comitted.'):invariant(false):undefined;


this._queueForCommit();};RelayMutationTransaction.prototype.


rollback = function rollback(){
this._assertIsPending();
!(
this._status === RelayMutationTransactionStatus.UNCOMMITTED || 
this._status === RelayMutationTransactionStatus.COMMIT_FAILED || 
this._status === RelayMutationTransactionStatus.COLLISION_COMMIT_FAILED)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayMutationTransaction: Only transactions with status `UNCOMMITTED` ' + 
'`COMMIT_FAILED` or `COLLISION_COMMIT_FAILED` can be rolledback.'):invariant(false):undefined;


this._handleRollback();};RelayMutationTransaction.prototype.


_getCallName = function _getCallName(){
if(!this._callName){
this._callName = this._getMutationNode().calls[0].name;}

return this._callName;};RelayMutationTransaction.prototype.


_getConfigs = function _getConfigs(){
if(!this._configs){
this._configs = this._mutation.getConfigs();}

return this._configs;};RelayMutationTransaction.prototype.


_getCollisionKey = function _getCollisionKey(){
if(this._collisionKey === undefined){
this._collisionKey = this._mutation.getCollisionKey() || null;}

return this._collisionKey;};RelayMutationTransaction.prototype.


_getFatQuery = function _getFatQuery(){
if(!this._fatQuery){
this._fatQuery = fromGraphQL.Fragment(this._mutation.getFatQuery());}

return this._fatQuery;};RelayMutationTransaction.prototype.


_getMutationNode = function _getMutationNode(){
if(!this._mutationNode){
this._mutationNode = this._mutation.getMutation();}

return this._mutationNode;};RelayMutationTransaction.prototype.


_getQuery = function _getQuery(){
if(!this._query){
this._query = RelayMutationQuery.buildQuery({
configs:this._getConfigs(),
fatQuery:this._getFatQuery(),
mutationName:this._mutation.constructor.name,
mutation:this._getMutationNode(),
input:this._getInputVariable()});}


return this._query;};RelayMutationTransaction.prototype.


_getInputVariable = function _getInputVariable(){
if(!this._inputVariable){
var inputVariable=_extends({},
this._mutation.getVariables(),_defineProperty({},

CLIENT_MUTATION_ID,this._id));

this._inputVariable = inputVariable;}

return this._inputVariable;};RelayMutationTransaction.prototype.


_getFiles = function _getFiles(){
if(this._files === undefined){
this._files = this._mutation.getFiles() || null;}

return this._files;};RelayMutationTransaction.prototype.


_getOptimisticConfigs = function _getOptimisticConfigs(){
if(this._optimisticConfigs === undefined){
this._optimisticConfigs = this._mutation.getOptimisticConfigs() || null;}

return this._optimisticConfigs;};RelayMutationTransaction.prototype.


_getOptimisticQuery = function _getOptimisticQuery(){
if(this._optimisticQuery === undefined){
var optimisticResponse=this._getOptimisticResponse();
if(optimisticResponse){
var optimisticConfigs=this._getOptimisticConfigs();
if(optimisticConfigs){
this._optimisticQuery = RelayMutationQuery.buildQuery({
configs:optimisticConfigs,
fatQuery:this._getFatQuery(),
input:this._getInputVariable(),
mutationName:this._mutation.constructor.name,
mutation:this._getMutationNode()});}else 

{
this._optimisticQuery = 
RelayMutationQuery.buildQueryForOptimisticUpdate({
response:optimisticResponse,
fatQuery:this._getFatQuery(),
mutation:this._getMutationNode()});}}else 


{
this._optimisticQuery = null;}}


return this._optimisticQuery;};RelayMutationTransaction.prototype.


_getOptimisticResponse = function _getOptimisticResponse(){
if(this._optimisticResponse === undefined){
var optimisticResponse=this._mutation.getOptimisticResponse() || null;
if(optimisticResponse){
optimisticResponse[CLIENT_MUTATION_ID] = this._id;}

this._optimisticResponse = optimisticResponse;}

return this._optimisticResponse;};RelayMutationTransaction.prototype.


_queueForCommit = function _queueForCommit(){
var collisionKey=this._getCollisionKey();
if(collisionKey){
if(!collisionQueueMap.hasOwnProperty(collisionKey)){
collisionQueueMap[collisionKey] = [this];
this._handleCommit();}else 
{
collisionQueueMap[collisionKey].push(this);
this._status = RelayMutationTransactionStatus.COMMIT_QUEUED;}}else 

{
this._handleCommit();}};RelayMutationTransaction.prototype.



_markAsNotPending = function _markAsNotPending(){var _this=this;
delete pendingTransactionMap[this._id];
queue = queue.filter(function(transaction){return transaction !== _this;});};RelayMutationTransaction.prototype.


_handleOptimisticUpdate = function _handleOptimisticUpdate(){
var optimisticResponse=this._getOptimisticResponse();
var optimisticQuery=this._getOptimisticQuery();
if(optimisticResponse && optimisticQuery){
var configs=this._getOptimisticConfigs() || this._getConfigs();
optimisticResponse[CLIENT_MUTATION_ID] = this._id;
RelayStoreData.getDefaultInstance().handleUpdatePayload(
optimisticQuery,
optimisticResponse,
{configs:configs,isOptimisticUpdate:true});}};RelayMutationTransaction.prototype.




_handleCommit = function _handleCommit(){var _this2=this;
this._status = RelayMutationTransactionStatus.COMMITTING;

var request=new RelayMutationRequest(
this._getQuery(),
this._getFiles());

RelayNetworkLayer.sendMutation(request);

request.getPromise().done(
function(result){return _this2._handleCommitSuccess(result.response);},
function(error){
_this2._error = error;
_this2._handleCommitFailure(true);});};RelayMutationTransaction.prototype.




_handleCommitFailure = function _handleCommitFailure(isServerError){
this._status = isServerError?
RelayMutationTransactionStatus.COMMIT_FAILED:
RelayMutationTransactionStatus.COLLISION_COMMIT_FAILED;

var shouldRollback=true;
var commitFailureCallback=this._onCommitFailureCallback;
if(commitFailureCallback){
var preventAutoRollback=function(){shouldRollback = false;};
ErrorUtils.applyWithGuard(
commitFailureCallback,
null,
[this,preventAutoRollback],
null,
'RelayMutationTransaction:onCommitFailure');}



if(isServerError){
RelayMutationTransaction._failCollisionQueue(this._getCollisionKey());}



var wasRolledback=!pendingTransactionMap[this._id];
if(shouldRollback && !wasRolledback){
this._handleRollback();}else 
{
RelayMutationTransaction._batchRefreshQueuedData();}};RelayMutationTransaction.prototype.



_handleRollback = function _handleRollback(){
this._markAsNotPending();
RelayMutationTransaction._batchRefreshQueuedData();};RelayMutationTransaction.prototype.


_handleCommitSuccess = function _handleCommitSuccess(response){
RelayMutationTransaction._advanceCollisionQueue(this._getCollisionKey());
this._markAsNotPending();

RelayMutationTransaction._refreshQueuedData();
RelayStoreData.getDefaultInstance().handleUpdatePayload(
this._getQuery(),
response[this._getCallName()],
{configs:this._getConfigs(),isOptimisticUpdate:false});


if(this._onCommitSuccessCallback){
ErrorUtils.applyWithGuard(
this._onCommitSuccessCallback,
null,
[response],
null,
'RelayMutationTransaction:onCommitSuccess');}};RelayMutationTransaction.




_advanceCollisionQueue = function _advanceCollisionQueue(collisionKey){
if(collisionKey){
var collisionQueue=nullthrows(collisionQueueMap[collisionKey]);

collisionQueue.shift();

if(collisionQueue.length){
collisionQueue[0]._handleCommit();}else 
{
delete collisionQueueMap[collisionKey];}}};RelayMutationTransaction.




_failCollisionQueue = function _failCollisionQueue(collisionKey){
if(collisionKey){
var collisionQueue=nullthrows(collisionQueueMap[collisionKey]);

collisionQueue.shift();
collisionQueue.forEach(
function(transaction){return transaction._handleCommitFailure(false);});

delete collisionQueueMap[collisionKey];}};RelayMutationTransaction.



_refreshQueuedData = function _refreshQueuedData(){
RelayStoreData.getDefaultInstance().clearQueuedData();
queue.forEach(function(transaction){return transaction._handleOptimisticUpdate();});};RelayMutationTransaction.



_batchRefreshQueuedData = function _batchRefreshQueuedData(){
if(!RelayMutationTransaction._willBatchRefreshQueuedData){
RelayMutationTransaction._willBatchRefreshQueuedData = true;
resolveImmediate(function(){
RelayMutationTransaction._willBatchRefreshQueuedData = false;
RelayMutationTransaction._refreshQueuedData();});}};return RelayMutationTransaction;})();





module.exports = RelayMutationTransaction;