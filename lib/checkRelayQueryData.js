function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass,superClass){if(typeof superClass !== 'function' && superClass !== null){throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__ = superClass;}












'use strict';

var RelayConnectionInterface=require('./RelayConnectionInterface');

var RelayProfiler=require('./RelayProfiler');

var RelayQueryVisitor=require('./RelayQueryVisitor');
var RelayRecordState=require('./RelayRecordState');



var forEachRootCallArg=require('./forEachRootCallArg');var 







EDGES=RelayConnectionInterface.EDGES;var PAGE_INFO=RelayConnectionInterface.PAGE_INFO;







function checkRelayQueryData(
store,
query)
{

var checker=new RelayQueryChecker(store);

var state={
dataID:undefined,
rangeInfo:undefined,
result:true};


checker.visit(query,state);
return state.result;}var 


RelayQueryChecker=(function(_RelayQueryVisitor){_inherits(RelayQueryChecker,_RelayQueryVisitor);


function RelayQueryChecker(store){_classCallCheck(this,RelayQueryChecker);
_RelayQueryVisitor.call(this);
this._store = store;}RelayQueryChecker.prototype.





traverse = function traverse(
node,
state)
{
var children=node.getChildren();
for(var ii=0;ii < children.length;ii++) {
if(!state.result){
return;}

this.visit(children[ii],state);}};RelayQueryChecker.prototype.



visitRoot = function visitRoot(
root,
state)
{var _this=this;
var nextState;

forEachRootCallArg(root,function(identifyingArgValue,fieldName){
var dataID=_this._store.getDataID(fieldName,identifyingArgValue);
if(dataID == null){
state.result = false;}else 
{
nextState = {
dataID:dataID,
rangeInfo:undefined,
result:true};

_this.traverse(root,nextState);
state.result = state.result && nextState.result;}});};RelayQueryChecker.prototype.




visitField = function visitField(
field,
state)
{
var dataID=state.dataID;
var recordState=dataID && this._store.getRecordState(dataID);
if(recordState === RelayRecordState.UNKNOWN){
state.result = false;
return;}else 
if(recordState === RelayRecordState.NONEXISTENT){
return;}

var rangeInfo=state.rangeInfo;
if(rangeInfo && field.getSchemaName() === EDGES){
this._checkEdges(field,state);}else 
if(rangeInfo && field.getSchemaName() === PAGE_INFO){
this._checkPageInfo(field,state);}else 
if(field.isScalar()){
this._checkScalar(field,state);}else 
if(field.isPlural()){
this._checkPlural(field,state);}else 
if(field.isConnection()){
this._checkConnection(field,state);}else 
{
this._checkLinkedField(field,state);}};RelayQueryChecker.prototype.



_checkScalar = function _checkScalar(field,state){
var fieldData=state.dataID && 
this._store.getField(state.dataID,field.getStorageKey());
if(fieldData === undefined){
state.result = false;}};RelayQueryChecker.prototype.



_checkPlural = function _checkPlural(field,state){
var dataIDs=state.dataID && 
this._store.getLinkedRecordIDs(state.dataID,field.getStorageKey());
if(dataIDs === undefined){
state.result = false;
return;}

if(dataIDs){
for(var ii=0;ii < dataIDs.length;ii++) {
if(!state.result){
break;}

var nextState={
dataID:dataIDs[ii],
rangeInfo:undefined,
result:true};

this.traverse(field,nextState);
state.result = nextState.result;}}};RelayQueryChecker.prototype.




_checkConnection = function _checkConnection(field,state){
var calls=field.getCallsWithValues();
var dataID=state.dataID && 
this._store.getLinkedRecordID(state.dataID,field.getStorageKey());
if(dataID === undefined){
state.result = false;
return;}

var nextState={
dataID:dataID,
rangeInfo:null,
result:true};

var metadata=this._store.getRangeMetadata(dataID,calls);
if(metadata){
nextState.rangeInfo = metadata;}

this.traverse(field,nextState);
state.result = state.result && nextState.result;};RelayQueryChecker.prototype.


_checkEdges = function _checkEdges(field,state){
var rangeInfo=state.rangeInfo;
if(!rangeInfo){
state.result = false;
return;}

if(rangeInfo.diffCalls.length){
state.result = false;
return;}

var edges=rangeInfo.requestedEdges;
for(var ii=0;ii < edges.length;ii++) {
if(!state.result){
break;}

var nextState={
dataID:edges[ii].edgeID,
rangeInfo:undefined,
result:true};

this.traverse(field,nextState);
state.result = nextState.result;}};RelayQueryChecker.prototype.



_checkPageInfo = function _checkPageInfo(field,state){
var rangeInfo=state.rangeInfo;
if(!rangeInfo || !rangeInfo.pageInfo){
state.result = false;
return;}};RelayQueryChecker.prototype.



_checkLinkedField = function _checkLinkedField(field,state){
var dataID=state.dataID && 
this._store.getLinkedRecordID(state.dataID,field.getStorageKey());
if(dataID === undefined){
state.result = false;
return;}

if(dataID){
var nextState={
dataID:dataID,
rangeInfo:undefined,
result:true};

this.traverse(field,nextState);
state.result = state.result && nextState.result;}};return RelayQueryChecker;})(RelayQueryVisitor);




module.exports = RelayProfiler.instrument(
'checkRelayQueryData',
checkRelayQueryData);