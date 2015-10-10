function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}












'use strict';

var GraphQLStoreChangeEmitter=require('./GraphQLStoreChangeEmitter');
var GraphQLStoreDataHandler=require('./GraphQLStoreDataHandler');
var RelayChangeTracker=require('./RelayChangeTracker');
var RelayConnectionInterface=require('./RelayConnectionInterface');









var RelayNodeInterface=require('./RelayNodeInterface');
var RelayProfiler=require('./RelayProfiler');
var RelayQuery=require('./RelayQuery');
var RelayQueryTracker=require('./RelayQueryTracker');
var RelayQueryWriter=require('./RelayQueryWriter');
var RelayRecordStore=require('./RelayRecordStore');
var RelayStoreGarbageCollector=require('./RelayStoreGarbageCollector');


var forEachObject=require('fbjs/lib/forEachObject');
var invariant=require('fbjs/lib/invariant');
var generateForceIndex=require('./generateForceIndex');
var refragmentRelayQuery=require('./refragmentRelayQuery');
var resolveImmediate=require('fbjs/lib/resolveImmediate');
var warning=require('fbjs/lib/warning');
var writeRelayQueryPayload=require('./writeRelayQueryPayload');
var writeRelayUpdatePayload=require('./writeRelayUpdatePayload');var 

CLIENT_MUTATION_ID=RelayConnectionInterface.CLIENT_MUTATION_ID;


var _instance;var 







RelayStoreData=(function(){RelayStoreData.
















getDefaultInstance = function getDefaultInstance(){
if(!_instance){
_instance = new RelayStoreData();}

return _instance;};


function RelayStoreData(){_classCallCheck(this,RelayStoreData);
var cachedRecords={};
var cachedRootCallMap={};
var queuedRecords={};
var records={};
var rootCallMap={};
var nodeRangeMap={};

this._cacheManager = null;
this._cachePopulated = true;
this._cachedRecords = cachedRecords;
this._cachedRootCalls = cachedRootCallMap;
this._nodeRangeMap = nodeRangeMap;
this._records = records;
this._queuedRecords = queuedRecords;
this._queuedStore = new RelayRecordStore(
{cachedRecords:cachedRecords,queuedRecords:queuedRecords,records:records},
{cachedRootCallMap:cachedRootCallMap,rootCallMap:rootCallMap},
nodeRangeMap);

this._recordStore = new RelayRecordStore(
{records:records},
{rootCallMap:rootCallMap},
nodeRangeMap);

this._queryTracker = new RelayQueryTracker();
this._rootCalls = rootCallMap;}RelayStoreData.prototype.







initializeGarbageCollector = function initializeGarbageCollector(){
!
!this._garbageCollector?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayStoreData: Garbage collector is already initialized.'):invariant(false):undefined;

var shouldInitialize=this._isStoreDataEmpty();
process.env.NODE_ENV !== 'production'?warning(
shouldInitialize,
'RelayStoreData: Garbage collection can only be initialized when no ' + 
'data is present.'):undefined;

if(shouldInitialize){
this._garbageCollector = new RelayStoreGarbageCollector(this);}};RelayStoreData.prototype.







injectCacheManager = function injectCacheManager(cacheManager){
var cachedRecords=this._cachedRecords;
var cachedRootCallMap=this._cachedRootCalls;
var rootCallMap=this._rootCalls;
var queuedRecords=this._queuedRecords;
var records=this._records;

this._cacheManager = cacheManager;
this._cachePopulated = false;
this._queuedStore = new RelayRecordStore(
{cachedRecords:cachedRecords,queuedRecords:queuedRecords,records:records},
{cachedRootCallMap:cachedRootCallMap,rootCallMap:rootCallMap},
this._nodeRangeMap);

this._recordStore = new RelayRecordStore(
{records:records},
{rootCallMap:rootCallMap},
this._nodeRangeMap,
cacheManager?
cacheManager.getQueryWriter():
null);};RelayStoreData.prototype.







runWithDiskCache = function runWithDiskCache(callback){var _this=this;
if(this._cachePopulated || !this._cacheManager){
resolveImmediate(callback);}else 
{
this._cacheManager.readAllData(
this._cachedRecords,
this._cachedRootCalls,
function(){
_this._cachePopulated = true;
callback();});}};RelayStoreData.prototype.








handleQueryPayload = function handleQueryPayload(
query,
response,
forceIndex)
{
var changeTracker=new RelayChangeTracker();
var writer=new RelayQueryWriter(
this._recordStore,
this._queryTracker,
changeTracker,
{
forceIndex:forceIndex,
updateTrackedQueries:true});


writeRelayQueryPayload(
writer,
query,
response);

this._handleChangedAndNewDataIDs(changeTracker.getChangeSet());};RelayStoreData.prototype.





handleUpdatePayload = function handleUpdatePayload(
operation,
payload,
_ref)
{var configs=_ref.configs;var isOptimisticUpdate=_ref.isOptimisticUpdate;
var changeTracker=new RelayChangeTracker();
var store;
if(isOptimisticUpdate){
var clientMutationID=payload[CLIENT_MUTATION_ID];
!(
typeof clientMutationID === 'string')?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayStoreData.handleUpdatePayload(): Expected optimistic payload ' + 
'to have a valid `%s`.',
CLIENT_MUTATION_ID):invariant(false):undefined;

store = this.getRecordStoreForOptimisticMutation(clientMutationID);}else 
{
store = this._getRecordStoreForMutation();}

var writer=new RelayQueryWriter(
store,
this._queryTracker,
changeTracker,
{
forceIndex:generateForceIndex(),
updateTrackedQueries:false});


writeRelayUpdatePayload(
writer,
operation,
payload,
{configs:configs,isOptimisticUpdate:isOptimisticUpdate});

this._handleChangedAndNewDataIDs(changeTracker.getChangeSet());};RelayStoreData.prototype.






buildFragmentQueryForDataID = function buildFragmentQueryForDataID(
fragment,
dataID)
{
if(GraphQLStoreDataHandler.isClientID(dataID)){
var path=this._queuedStore.getPathToRecord(dataID);
!
path?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayStoreData.buildFragmentQueryForDataID(): Cannot refetch ' + 
'record `%s` without a path.',
dataID):invariant(false):undefined;

var query=refragmentRelayQuery(path.getQuery(fragment));
!
query?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayStoreData.buildFragmentQueryForDataID(): Expected a query for ' + 
'record `%s`.',
dataID):invariant(false):undefined;

return query;}



return RelayQuery.Root.build(
RelayNodeInterface.NODE,
dataID,
[fragment],
{identifyingArgName:RelayNodeInterface.ID},
fragment.getDebugName() || 'UnknownQuery');};RelayStoreData.prototype.



getNodeData = function getNodeData(){
return this._records;};RelayStoreData.prototype.


getQueuedData = function getQueuedData(){
return this._queuedRecords;};RelayStoreData.prototype.


clearQueuedData = function clearQueuedData(){var _this2=this;
forEachObject(this._queuedRecords,function(_,key){
delete _this2._queuedRecords[key];
GraphQLStoreChangeEmitter.broadcastChangeForID(key);});};RelayStoreData.prototype.



getCachedData = function getCachedData(){
return this._cachedRecords;};RelayStoreData.prototype.


getGarbageCollector = function getGarbageCollector(){
return this._garbageCollector;};RelayStoreData.prototype.





getQueuedStore = function getQueuedStore(){
return this._queuedStore;};RelayStoreData.prototype.





getRecordStore = function getRecordStore(){
return this._recordStore;};RelayStoreData.prototype.


getQueryTracker = function getQueryTracker(){
return this._queryTracker;};RelayStoreData.prototype.








getRootCallData = function getRootCallData(){
return this._rootCalls;};RelayStoreData.prototype.


_isStoreDataEmpty = function _isStoreDataEmpty(){
return (
Object.keys(this._records).length === 0 && 
Object.keys(this._queuedRecords).length === 0 && 
Object.keys(this._cachedRecords).length === 0);};RelayStoreData.prototype.







_handleChangedAndNewDataIDs = function _handleChangedAndNewDataIDs(changeSet){
var updatedDataIDs=Object.keys(changeSet.updated);
updatedDataIDs.forEach(
GraphQLStoreChangeEmitter.broadcastChangeForID);

if(this._garbageCollector){
var createdDataIDs=Object.keys(changeSet.created);
var garbageCollector=this._garbageCollector;
createdDataIDs.forEach(function(dataID){return garbageCollector.register(dataID);});}};RelayStoreData.prototype.



_getRecordStoreForMutation = function _getRecordStoreForMutation(){
var records=this._records;
var rootCallMap=this._rootCalls;

return new RelayRecordStore(
{records:records},
{rootCallMap:rootCallMap},
this._nodeRangeMap,
this._cacheManager?
this._cacheManager.getMutationWriter():
null);};RelayStoreData.prototype.



getRecordStoreForOptimisticMutation = function getRecordStoreForOptimisticMutation(
clientMutationID)
{
var cachedRecords=this._cachedRecords;
var cachedRootCallMap=this._cachedRootCalls;
var rootCallMap=this._rootCalls;
var queuedRecords=this._queuedRecords;
var records=this._records;

return new RelayRecordStore(
{cachedRecords:cachedRecords,queuedRecords:queuedRecords,records:records},
{cachedRootCallMap:cachedRootCallMap,rootCallMap:rootCallMap},
this._nodeRangeMap,
null,
clientMutationID);};return RelayStoreData;})();




RelayProfiler.instrumentMethods(RelayStoreData.prototype,{
handleQueryPayload:'RelayStoreData.prototype.handleQueryPayload'});


module.exports = RelayStoreData;