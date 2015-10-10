'use strict';var _slicedToArray=(function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n = (_s = _i.next()).done);_n = true) {_arr.push(_s.value);if(i && _arr.length === i)break;}}catch(err) {_d = true;_e = err;}finally {try{if(!_n && _i['return'])_i['return']();}finally {if(_d)throw _e;}}return _arr;}return function(arr,i){if(Array.isArray(arr)){return arr;}else if(Symbol.iterator in Object(arr)){return sliceIterator(arr,i);}else {throw new TypeError('Invalid attempt to destructure non-iterable instance');}};})();var _extends=Object.assign || function(target){for(var i=1;i < arguments.length;i++) {var source=arguments[i];for(var key in source) {if(Object.prototype.hasOwnProperty.call(source,key)){target[key] = source[key];}}}return target;};function _inherits(subClass,superClass){if(typeof superClass !== 'function' && superClass !== null){throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__ = superClass;}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}













var RelayNodeInterface=require('./RelayNodeInterface');

var invariant=require('fbjs/lib/invariant');

var EMPTY_OBJECT={};
var EMPTY_ARRAY=[];

if(process.env.NODE_ENV !== 'production'){
Object.freeze(EMPTY_OBJECT);
Object.freeze(EMPTY_ARRAY);}


var BATCH_CALL_VARIABLE='BatchCallVariable';
var CALL='Call';
var CALL_VALUE='CallValue';
var CALL_VARIABLE='CallVariable';
var FIELD='Field';
var FRAGMENT='Fragment';
var MUTATION='Mutation';
var QUERY='Query';
var QUERY_WITH_VALUES='QueryWithValues';
var SUBSCRIPTION='Subscription';

var JSON_TYPES={
QUERY:1,
FRAGMENT:2,
FIELD:3,
CALL:4,
CALL_VALUE:5,
CALL_VARIABLE:6,
BATCH_VARIABLE:7,
MUTATION:8,
QUERY_WITH_VALUES:9,
SUBSCRIPTION:10};var 











GraphQLNode=





function GraphQLNode(fields,fragments){_classCallCheck(this,GraphQLNode);
this.fields = fields || EMPTY_ARRAY;
this.fragments = fragments && fragments.length > 0?
fragments.filter(isTruthy):
EMPTY_ARRAY;

this.children = this.fields.concat(this.fragments);};var 






GraphQLCallvNode=(function(){





function GraphQLCallvNode(name,value,metadata){_classCallCheck(this,GraphQLCallvNode);
this.kind = CALL;
this.value = map(value,castArg) || null;
this.name = name;
this.metadata = metadata || EMPTY_OBJECT;}GraphQLCallvNode.






fromJSON = function fromJSON(descriptor){var _descriptor=_slicedToArray(
descriptor,4);var type=_descriptor[0];var name=_descriptor[1];var value=_descriptor[2];var metadata=_descriptor[3];
!(type === JSON_TYPES.CALL)?process.env.NODE_ENV !== 'production'?invariant(false,'Expected call descriptor'):invariant(false):undefined;
return new GraphQLCallvNode(
name,
callArgsFromJSON(value),
metadata);};GraphQLCallvNode.prototype.



toJSON = function toJSON(){
return trimArray([
JSON_TYPES.CALL,
this.name,
this.value,
this.metadata === EMPTY_OBJECT?null:this.metadata]);};return GraphQLCallvNode;})();var 








GraphQLCallValue=(function(){



function GraphQLCallValue(value){_classCallCheck(this,GraphQLCallValue);
this.kind = CALL_VALUE;
this.callValue = value;}GraphQLCallValue.






fromJSON = function fromJSON(descriptor){var _descriptor2=_slicedToArray(
descriptor,2);var type=_descriptor2[0];var value=_descriptor2[1];
!(type === JSON_TYPES.CALL_VALUE)?process.env.NODE_ENV !== 'production'?invariant(false,'Expected value descriptor'):invariant(false):undefined;
return new GraphQLCallValue(value);};GraphQLCallValue.prototype.


toJSON = function toJSON(){
return [
JSON_TYPES.CALL_VALUE,
this.callValue];};return GraphQLCallValue;})();var 




















GraphQLBatchCallVariable=(function(){




function GraphQLBatchCallVariable(sourceQueryID,jsonPath){_classCallCheck(this,GraphQLBatchCallVariable);
this.kind = BATCH_CALL_VARIABLE;
this.sourceQueryID = sourceQueryID;
this.jsonPath = jsonPath;}GraphQLBatchCallVariable.






fromJSON = function fromJSON(descriptor){var _descriptor3=_slicedToArray(
descriptor,3);var type=_descriptor3[0];var sourceQueryID=_descriptor3[1];var jsonPath=_descriptor3[2];
!(
type === JSON_TYPES.BATCH_VARIABLE)?process.env.NODE_ENV !== 'production'?invariant(false,
'Expected batch variable descriptor'):invariant(false):undefined;

return new GraphQLBatchCallVariable(sourceQueryID,jsonPath);};GraphQLBatchCallVariable.prototype.


toJSON = function toJSON(){
return [
JSON_TYPES.BATCH_VARIABLE,
this.sourceQueryID,
this.jsonPath];};return GraphQLBatchCallVariable;})();var 











GraphQLCallVariable=(function(){



function GraphQLCallVariable(variableName){_classCallCheck(this,GraphQLCallVariable);
this.kind = CALL_VARIABLE;
this.callVariableName = variableName;}GraphQLCallVariable.






fromJSON = function fromJSON(descriptor){var _descriptor4=_slicedToArray(
descriptor,2);var type=_descriptor4[0];var name=_descriptor4[1];
!(
type === JSON_TYPES.CALL_VARIABLE)?process.env.NODE_ENV !== 'production'?invariant(false,
'Expected variable descriptor'):invariant(false):undefined;

return new GraphQLCallVariable(name);};GraphQLCallVariable.prototype.


toJSON = function toJSON(){
return [
JSON_TYPES.CALL_VARIABLE,
this.callVariableName];};return GraphQLCallVariable;})();var 










GraphQLFieldNode=(function(_GraphQLNode){_inherits(GraphQLFieldNode,_GraphQLNode);










function GraphQLFieldNode(fieldName,fields,fragments,calls,alias,condition,metadata,directives){_classCallCheck(this,GraphQLFieldNode);
_GraphQLNode.call(this,fields,fragments);

this.kind = FIELD;
this.fieldName = fieldName;
this.calls = calls || EMPTY_ARRAY;
this.alias = alias || null;
this.condition = condition || null;

metadata = metadata || EMPTY_OBJECT;
this.__metadata__ = metadata;
this.metadata = {
edgesID:metadata.edgesID,
inferredRootCallName:metadata.rootCall,
inferredPrimaryKey:metadata.pk,
isConnection:!!metadata.connection,
isFindable:!!metadata.connection && !metadata.nonFindable,
isGenerated:!!metadata.generated,
isPlural:!!metadata.plural,
isRequisite:!!metadata.requisite,
isUnionOrInterface:!!metadata.dynamic,
parentType:metadata.parentType};

this.directives = directives || EMPTY_ARRAY;}GraphQLFieldNode.






fromJSON = function fromJSON(descriptor){var _descriptor5=_slicedToArray(










descriptor,9);var type=_descriptor5[0];var fieldName=_descriptor5[1];var fields=_descriptor5[2];var fragments=_descriptor5[3];var calls=_descriptor5[4];var alias=_descriptor5[5];var condition=_descriptor5[6];var metadata=_descriptor5[7];var directives=_descriptor5[8];
!(type === JSON_TYPES.FIELD)?process.env.NODE_ENV !== 'production'?invariant(false,'Expected field descriptor'):invariant(false):undefined;
return new GraphQLFieldNode(
fieldName,
fields?fields.map(GraphQLFieldNode.fromJSON):null,
fragments?fragments.map(GraphQLQueryFragment.fromJSON):null,
calls?calls.map(GraphQLCallvNode.fromJSON):null,
alias,
condition,
metadata,
directives);};GraphQLFieldNode.prototype.



toJSON = function toJSON(){
return trimArray([
JSON_TYPES.FIELD,
this.fieldName,
this.fields.length?this.fields:null,
this.fragments.length?this.fragments:null,
this.calls.length?this._calls:null,
this.alias,
this.condition,
this.__metadata__ === EMPTY_OBJECT?null:this.__metadata__,
this.directives === EMPTY_ARRAY?null:this.directives]);};return GraphQLFieldNode;})(GraphQLNode);var 









GraphQLQueryFragment=(function(_GraphQLNode2){_inherits(GraphQLQueryFragment,_GraphQLNode2);






function GraphQLQueryFragment(name,type,fields,fragments,metadata,directives){_classCallCheck(this,GraphQLQueryFragment);
_GraphQLNode2.call(this,fields,fragments);
this.kind = FRAGMENT;
this.name = name;
this.type = type;
this.metadata = this.__metadata__ = metadata || EMPTY_OBJECT;
this.directives = directives || EMPTY_ARRAY;
this.isPlural = !!this.metadata.isPlural;}GraphQLQueryFragment.






fromJSON = function fromJSON(descriptor){var _descriptor6=_slicedToArray(

descriptor,7);var type=_descriptor6[0];var name=_descriptor6[1];var fragmentType=_descriptor6[2];var fields=_descriptor6[3];var fragments=_descriptor6[4];var metadata=_descriptor6[5];var directives=_descriptor6[6];
!(type === JSON_TYPES.FRAGMENT)?process.env.NODE_ENV !== 'production'?invariant(false,'Expected fragment descriptor'):invariant(false):undefined;
var frag=new GraphQLQueryFragment(
name,
fragmentType,
fields?fields.map(GraphQLFieldNode.fromJSON):null,
fragments?fragments.map(GraphQLQueryFragment.fromJSON):null,
metadata,
directives);

return frag;};GraphQLQueryFragment.prototype.


toJSON = function toJSON(){
return trimArray([
JSON_TYPES.FRAGMENT,
this.name,
this.type,
this.fields.length?this.fields:null,
this.fragments.length?this.fragments:null,
this.metadata,
this.directives === EMPTY_ARRAY?null:this.directives]);};return GraphQLQueryFragment;})(GraphQLNode);var 









GraphQLQuery=(function(_GraphQLNode3){_inherits(GraphQLQuery,_GraphQLNode3);









function GraphQLQuery(
fieldName,
value,
fields,
fragments,
metadata,
queryName,
directives)
{_classCallCheck(this,GraphQLQuery);
_GraphQLNode3.call(this,fields,fragments);
this.__metadata__ = metadata || EMPTY_OBJECT;
var identifyingArgName=this.__metadata__.identifyingArgName;
if(
identifyingArgName == null && 
RelayNodeInterface.isNodeRootCall(fieldName))
{
identifyingArgName = RelayNodeInterface.ID;}

this.kind = QUERY;
this.metadata = _extends({},this.__metadata__);
if(identifyingArgName !== undefined){
this.metadata.identifyingArgName = identifyingArgName;}

this.directives = directives || EMPTY_ARRAY;
this.name = queryName;
this.fieldName = fieldName;
this.isDeferred = !!this.__metadata__.isDeferred;

this.calls = [];




if(identifyingArgName != null){
this.calls.push(new GraphQLCallvNode(identifyingArgName,value));}}GraphQLQuery.







fromJSON = function fromJSON(descriptor){var _descriptor7=_slicedToArray(

descriptor,8);var type=_descriptor7[0];var name=_descriptor7[1];var value=_descriptor7[2];var fields=_descriptor7[3];var fragments=_descriptor7[4];var metadata=_descriptor7[5];var queryName=_descriptor7[6];var directives=_descriptor7[7];
!(type === JSON_TYPES.QUERY)?process.env.NODE_ENV !== 'production'?invariant(false,'Expected query descriptor'):invariant(false):undefined;
return new GraphQLQuery(
name,
callArgsFromJSON(value),
fields?fields.map(GraphQLFieldNode.fromJSON):null,
fragments?fragments.map(GraphQLQueryFragment.fromJSON):null,
metadata,
queryName,
directives);};GraphQLQuery.prototype.



toJSON = function toJSON(){
return trimArray([
JSON_TYPES.QUERY,
this.fieldName,
this.calls[0] && this.calls[0].value || null,
this.fields.length?this.fields:null,
this.fragments.length?this.fragments:null,
this.__metadata__ === EMPTY_OBJECT?null:this.__metadata__,
this.name || null,
this.directives === EMPTY_ARRAY?null:this.directives]);};return GraphQLQuery;})(GraphQLNode);var 










GraphQLQueryWithValues=(function(){




function GraphQLQueryWithValues(query,values){_classCallCheck(this,GraphQLQueryWithValues);
this.kind = QUERY_WITH_VALUES;
this.query = query;
this.values = values;}GraphQLQueryWithValues.prototype.


getQuery = function getQuery(){
return this.query;};GraphQLQueryWithValues.






fromJSON = function fromJSON(descriptor){var _descriptor8=_slicedToArray(
descriptor,3);var type=_descriptor8[0];var query=_descriptor8[1];var values=_descriptor8[2];
!(
type === JSON_TYPES.QUERY_WITH_VALUES)?process.env.NODE_ENV !== 'production'?invariant(false,
'Expected query descriptor'):invariant(false):undefined;

return new GraphQLQueryWithValues(
GraphQLQuery.fromJSON(query),
values);};GraphQLQueryWithValues.prototype.



toJSON = function toJSON(){
return trimArray([
JSON_TYPES.QUERY_WITH_VALUES,
this.query,
this.values]);};return GraphQLQueryWithValues;})();var 







GraphQLOperation=(function(_GraphQLNode4){_inherits(GraphQLOperation,_GraphQLNode4);





function GraphQLOperation(name,responseType,call,fields,fragments,metadata){_classCallCheck(this,GraphQLOperation);
_GraphQLNode4.call(this,fields,fragments);
this.name = name;
this.responseType = responseType;
this.calls = [call];
this.metadata = metadata || EMPTY_OBJECT;}GraphQLOperation.prototype.


toJSON = function toJSON(){
return trimArray([
this.getJSONType(),
this.name,
this.responseType,
this.calls[0],
this.fields.length?this.fields:null,
this.fragments.length?this.fragments:null,
this.metadata === EMPTY_OBJECT?null:this.metadata]);};return GraphQLOperation;})(GraphQLNode);var 







GraphQLMutation=(function(_GraphQLOperation){_inherits(GraphQLMutation,_GraphQLOperation);
function GraphQLMutation(){_classCallCheck(this,GraphQLMutation);for(var _len=arguments.length,args=Array(_len),_key=0;_key < _len;_key++) {args[_key] = arguments[_key];}
_GraphQLOperation.call.apply(_GraphQLOperation,[this].concat(args));
this.kind = MUTATION;}GraphQLMutation.






fromJSON = function fromJSON(descriptor){var _descriptor9=_slicedToArray(








descriptor,7);var type=_descriptor9[0];var name=_descriptor9[1];var responseType=_descriptor9[2];var mutationCall=_descriptor9[3];var fields=_descriptor9[4];var fragments=_descriptor9[5];var metadata=_descriptor9[6];
!(type === JSON_TYPES.MUTATION)?process.env.NODE_ENV !== 'production'?invariant(false,'Expected mutation descriptor'):invariant(false):undefined;
return new GraphQLMutation(
name,
responseType,
GraphQLCallvNode.fromJSON(mutationCall),
fields?fields.map(GraphQLFieldNode.fromJSON):null,
fragments?fragments.map(GraphQLQueryFragment.fromJSON):null,
metadata);};GraphQLMutation.prototype.






getJSONType = function getJSONType(){
return JSON_TYPES.MUTATION;};return GraphQLMutation;})(GraphQLOperation);var 






GraphQLSubscription=(function(_GraphQLOperation2){_inherits(GraphQLSubscription,_GraphQLOperation2);
function GraphQLSubscription(){_classCallCheck(this,GraphQLSubscription);for(var _len2=arguments.length,args=Array(_len2),_key2=0;_key2 < _len2;_key2++) {args[_key2] = arguments[_key2];}
_GraphQLOperation2.call.apply(_GraphQLOperation2,[this].concat(args));
this.kind = SUBSCRIPTION;}GraphQLSubscription.






fromJSON = function fromJSON(descriptor){var _descriptor10=_slicedToArray(








descriptor,7);var type=_descriptor10[0];var name=_descriptor10[1];var responseType=_descriptor10[2];var subscriptionCall=_descriptor10[3];var fields=_descriptor10[4];var fragments=_descriptor10[5];var metadata=_descriptor10[6];
!(
type === JSON_TYPES.SUBSCRIPTION)?process.env.NODE_ENV !== 'production'?invariant(false,
'Expected subscription descriptor'):invariant(false):undefined;

return new GraphQLSubscription(
name,
responseType,
GraphQLCallvNode.fromJSON(subscriptionCall),
fields?fields.map(GraphQLFieldNode.fromJSON):null,
fragments?fragments.map(GraphQLQueryFragment.fromJSON):null,
metadata);};GraphQLSubscription.prototype.






getJSONType = function getJSONType(){
return JSON_TYPES.SUBSCRIPTION;};return GraphQLSubscription;})(GraphQLOperation);







function isTruthy(thing){
return !!thing;}





function map(value,fn){
if(value == null){
return value;}else 
if(Array.isArray(value)){
return value.map(fn);}else 
{
return fn(value);}}








function castArg(arg){
if(
arg instanceof GraphQLCallValue || 
arg instanceof GraphQLCallVariable || 
arg instanceof GraphQLBatchCallVariable)
{
return arg;}else 
if(arg == null){
return new GraphQLCallVariable('__null__');}else 
{
return new GraphQLCallValue(arg);}}



function trimArray(arr){
var lastIndex=-1;
for(var ii=arr.length - 1;ii >= 0;ii--) {
if(arr[ii] !== null){
lastIndex = ii;
break;}}


arr.length = lastIndex + 1;
return arr;}



function callArgsFromJSON(value){
if(Array.isArray(value) && Array.isArray(value[0])){
return value.map(callArgFromJSON);}else 
if(value){
return callArgFromJSON(value);}

return value;}






function callArgFromJSON(descriptor){
var type=descriptor[0];
switch(type){
case JSON_TYPES.CALL_VALUE:
return GraphQLCallValue.fromJSON(descriptor);
case JSON_TYPES.CALL_VARIABLE:
return GraphQLCallVariable.fromJSON(descriptor);
case JSON_TYPES.BATCH_VARIABLE:
return GraphQLBatchCallVariable.fromJSON(descriptor);
default:
!
false?process.env.NODE_ENV !== 'production'?invariant(false,
'GraphQL: Unexpected call type, got `%s` from `%s`.',
type,
descriptor):invariant(false):undefined;}}




function isType(node,type){
return (
typeof node === 'object' && 
node !== null && 
node.kind === type);}



function isCall(node){
return isType(node,CALL);}


function isCallValue(node){
return isType(node,CALL_VALUE);}


function isCallVariable(node){
return isType(node,CALL_VARIABLE);}


function isBatchCallVariable(node){
return isType(node,BATCH_CALL_VARIABLE);}


function isField(node){
return isType(node,FIELD);}


function isFragment(node){
return isType(node,FRAGMENT);}


function isQuery(node){
return isType(node,QUERY);}


function isQueryWithValues(node){
return isType(node,QUERY_WITH_VALUES);}


function isMutation(node){
return isType(node,MUTATION);}


function isSubscription(node){
return isType(node,SUBSCRIPTION);}









var GraphQL={
BatchCallVariable:GraphQLBatchCallVariable,
Callv:GraphQLCallvNode,
CallValue:GraphQLCallValue,
CallVariable:GraphQLCallVariable,
Field:GraphQLFieldNode,
Mutation:GraphQLMutation,
Query:GraphQLQuery,
QueryFragment:GraphQLQueryFragment,
QueryWithValues:GraphQLQueryWithValues,
Subscription:GraphQLSubscription,
isBatchCallVariable:isBatchCallVariable,
isCall:isCall,
isCallValue:isCallValue,
isCallVariable:isCallVariable,
isField:isField,
isFragment:isFragment,
isMutation:isMutation,
isQuery:isQuery,
isQueryWithValues:isQueryWithValues,
isSubscription:isSubscription};


module.exports = GraphQL;