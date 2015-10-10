'use strict';var _slicedToArray=(function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n = (_s = _i.next()).done);_n = true) {_arr.push(_s.value);if(i && _arr.length === i)break;}}catch(err) {_d = true;_e = err;}finally {try{if(!_n && _i['return'])_i['return']();}finally {if(_d)throw _e;}}return _arr;}return function(arr,i){if(Array.isArray(arr)){return arr;}else if(Symbol.iterator in Object(arr)){return sliceIterator(arr,i);}else {throw new TypeError('Invalid attempt to destructure non-iterable instance');}};})();var _extends=Object.assign || function(target){for(var i=1;i < arguments.length;i++) {var source=arguments[i];for(var key in source) {if(Object.prototype.hasOwnProperty.call(source,key)){target[key] = source[key];}}}return target;};













var GraphQL=require('./GraphQL');
var RelayProfiler=require('./RelayProfiler');
var RelayQuery=require('./RelayQuery');

var invariant=require('fbjs/lib/invariant');













var toGraphQL={
Node:function(node){
if(node instanceof RelayQuery.Root){
return toGraphQL.Query(node);}else 
if(node instanceof RelayQuery.Fragment){
return toGraphQL.Fragment(node);}else 
{
!(node instanceof RelayQuery.Field)?process.env.NODE_ENV !== 'production'?invariant(false,'toGraphQL: Invalid node.'):invariant(false):undefined;
return toGraphQL.Field(node);}},


QueryWithValues:function(node){
return new GraphQL.QueryWithValues(toGraphQL.Query(node),{});},

Query:function(node){
return node.getConcreteQueryNode(function(){
var batchCall=node.getBatchCall();
var calls;
if(batchCall){
calls = [new GraphQL.BatchCallVariable(
batchCall.sourceQueryID,
batchCall.sourceQueryPath)];}else 

{
var identifyingArg=node.getIdentifyingArg();
calls = identifyingArg && identifyingArg.value || null;}var _toGraphQLChildren=


toGraphQLChildren(node.getChildren());var _toGraphQLChildren2=_slicedToArray(_toGraphQLChildren,2);var fields=_toGraphQLChildren2[0];var fragments=_toGraphQLChildren2[1];
var query=new GraphQL.Query(
node.getFieldName(),
calls,
fields,
fragments,
toGraphQLMetadata(node),
node.getName());

return query;});},


Fragment:function(node){
return node.getConcreteQueryNode(function(){var _toGraphQLChildren3=
toGraphQLChildren(node.getChildren());var _toGraphQLChildren32=_slicedToArray(_toGraphQLChildren3,2);var fields=_toGraphQLChildren32[0];var fragments=_toGraphQLChildren32[1];
var fragment=new GraphQL.QueryFragment(
node.getDebugName(),
node.getType(),
fields,
fragments,
toGraphQLMetadata(node));

return fragment;});},


Field:function(node){
return node.getConcreteQueryNode(function(){
var metadata=toGraphQLMetadata(node);
var calls=node.getCallsWithValues().map(function(call){
return new GraphQL.Callv(
call.name,
call.value);});var _toGraphQLChildren4=


toGraphQLChildren(node.getChildren());var _toGraphQLChildren42=_slicedToArray(_toGraphQLChildren4,2);var fields=_toGraphQLChildren42[0];var fragments=_toGraphQLChildren42[1];
return new GraphQL.Field(
node.getSchemaName(),
fields,
fragments,
calls,
node.__concreteNode__.alias,
node.__concreteNode__.condition,
metadata);});}};





RelayProfiler.instrumentMethods(toGraphQL,{
Node:'toGraphQL.Node',
QueryWithValues:'toGraphQL.QueryWithValues',
Query:'toGraphQL.Query',
Fragment:'toGraphQL.Fragment',
Field:'toGraphQL.Field'});


function toGraphQLChildren(
children)
{
var fields=[];
var fragments=[];
children.forEach(function(child){
if(child instanceof RelayQuery.Field){
fields.push(toGraphQL.Field(child));}else 
{
!(
child instanceof RelayQuery.Fragment)?process.env.NODE_ENV !== 'production'?invariant(false,
'toGraphQL: Invalid child node.'):invariant(false):undefined;

fragments.push(toGraphQL.Fragment(child));}});


return [fields,fragments];}


function toGraphQLMetadata(node){
var metadata=_extends({},
node.__concreteNode__.__metadata__);

if(Object.keys(metadata).length){
return metadata;}

return null;}


module.exports = toGraphQL;