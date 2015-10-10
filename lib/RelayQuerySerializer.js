var _extends=Object.assign || function(target){for(var i=1;i < arguments.length;i++) {var source=arguments[i];for(var key in source) {if(Object.prototype.hasOwnProperty.call(source,key)){target[key] = source[key];}}}return target;};












'use strict';


var RelayQuery=require('./RelayQuery');

var invariant=require('fbjs/lib/invariant');




















var FIELD='Field';
var FRAGMENT_DEFINITION='FragmentDefinition';
var QUERY='Query';
var MUTATION='Mutation';






var RelayQuerySerializer={
fromJSON:function(data){
!(
typeof data === 'object' && data !== null && !Array.isArray(data))?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQuerySerializer.fromJSON(): expected an object.'):invariant(false):undefined;var 


alias=







data.alias;var calls=data.calls;var children=data.children;var fieldName=data.fieldName;var kind=data.kind;var metadata=data.metadata;var name=data.name;var type=data.type;

!(
alias == null || typeof alias === 'string')?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQuerySerializer.fromJSON(): expected `alias` to be a string, got ' + 
'`%s`.',
alias):invariant(false):undefined;

!(
calls == null || Array.isArray(calls))?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQuerySerializer.fromJSON(): expected `calls` to be an array.'):invariant(false):undefined;

!(
typeof kind === 'string')?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQuerySerializer.fromJSON(): expected `kind` to be a string.'):invariant(false):undefined;

!(
!metadata || typeof metadata === 'object' && !Array.isArray(metadata))?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQuerySerializer.fromJSON(): expected `metadata` to be an object.'):invariant(false):undefined;

!(
typeof name === 'string')?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQuerySerializer.fromJSON(): expected `name` to be a string.'):invariant(false):undefined;

!(
!children || Array.isArray(children))?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQuerySerializer.fromJSON(): expected `children` to be an array.'):invariant(false):undefined;

children = children.map(RelayQuerySerializer.fromJSON);

if(kind === FIELD){
var field=RelayQuery.Field.build(
name,
calls,
children,
metadata,
alias);

!(
field != null)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQuerySerializer.fromJSON(): expected a `Field`.'):invariant(false):undefined;

return field;}else 
if(kind === FRAGMENT_DEFINITION){
!(
typeof type === 'string')?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQuerySerializer.fromJSON(): expected `type` to be a string.'):invariant(false):undefined;

var fragment=RelayQuery.Fragment.build(
name,
type,
children,
metadata);

!(
fragment != null)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQuerySerializer.fromJSON(): expected a `Fragment`.'):invariant(false):undefined;

return fragment;}else 
if(kind === QUERY){
!(
fieldName != null)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQuerySerializer.fromJSON(): expected `fieldName` to be ' + 
'non-null for a root node'):invariant(false):undefined;

var root=RelayQuery.Root.build(
fieldName,
calls[0] && calls[0].value || null,
children,
metadata,
name);

!(
root != null)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQuerySerializer.fromJSON(): expected a `Root`.'):invariant(false):undefined;

return root;}else 
if(kind === MUTATION){
!(
typeof type === 'string')?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQuerySerializer.fromJSON(): expected `type` to be a string.'):invariant(false):undefined;

var mutationCall=calls[0];
var mutation=RelayQuery.Mutation.build(
name,
type,
mutationCall.name,
mutationCall.value,
children);

!(
mutation != null)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQuerySerializer.fromJSON(): expected a `Mutation`.'):invariant(false):undefined;

return mutation;}else 
{
!
false?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQuerySerializer.fromJSON(): invalid kind %s.',
kind):invariant(false):undefined;}},




toJSON:function(node){
var children=node.getChildren().map(RelayQuerySerializer.toJSON);
if(node instanceof RelayQuery.Field){
var name=node.getSchemaName();
var alias=node.getApplicationName();
return {
kind:FIELD,
name:name,
alias:alias !== name?alias:null,
calls:node.getCallsWithValues(),
children:children,
metadata:node.__concreteNode__.__metadata__};}else 

if(node instanceof RelayQuery.Fragment){
return {
kind:FRAGMENT_DEFINITION,
name:node.getDebugName(),
type:node.getType(),
children:children,
metadata:_extends({},
node.__concreteNode__.__metadata__,{
isDeferred:node.isDeferred(),
isContainerFragment:node.isContainerFragment()})};}else 


if(node instanceof RelayQuery.Root){
return {
kind:QUERY,
name:node.getName(),
fieldName:node.getFieldName(),
calls:node.getCallsWithValues(),
children:children,
metadata:node.__concreteNode__.__metadata__};}else 

if(node instanceof RelayQuery.Mutation){
var mutationCall=node.getCall();
return {
kind:MUTATION,
name:node.getName(),
calls:[mutationCall],
children:children,
type:node.getResponseType()};}else 

{
!
false?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQuerySerializer.toJSON(): invalid node type, only `Field`, ' + 
'`Fragment`, `Mutation`, and `Root` are supported, got `%s`.',
node.constructor.name):invariant(false):undefined;}}};





module.exports = RelayQuerySerializer;