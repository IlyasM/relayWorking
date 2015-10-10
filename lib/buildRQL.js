Object.defineProperty(exports,'__esModule',{value:true});












'use strict';

var GraphQL=require('./GraphQL');
var Map=require('fbjs/lib/Map');



var filterObject=require('fbjs/lib/filterObject');
var invariant=require('fbjs/lib/invariant');
var mapObject=require('fbjs/lib/mapObject');






var fragmentCache=new Map();


var queryCache=new Map();

function isDeprecatedCallWithArgCountGreaterThan(
nodeBuilder,
count)
{
var argLength=nodeBuilder.length;
if(process.env.NODE_ENV !== 'production'){
var mockImpl=nodeBuilder;
while(mockImpl && mockImpl._getMockImplementation) {
mockImpl = mockImpl._getMockImplementation();}

if(mockImpl){
argLength = mockImpl.length;}}


return argLength > count;}












var buildRQL={
Fragment:function(
fragmentBuilder,
values)
{
var node=fragmentCache.get(fragmentBuilder);
if(!node){
var variables=toVariables(values);
!
!isDeprecatedCallWithArgCountGreaterThan(fragmentBuilder,1)?process.env.NODE_ENV !== 'production'?invariant(false,
'Relay.QL: Deprecated usage detected. If you are trying to define a ' + 
'fragment, use `variables => Relay.QL`.'):invariant(false):undefined;

node = fragmentBuilder(variables);
fragmentCache.set(fragmentBuilder,node);}

return GraphQL.isFragment(node)?node:undefined;},


Query:function(
queryBuilder,
Component,
queryName,
values)
{
var componentCache=queryCache.get(queryBuilder);
var node;
if(!componentCache){
componentCache = new Map();
queryCache.set(queryBuilder,componentCache);}else 
{
node = componentCache.get(Component);}

if(!node){
var variables=toVariables(values);
!
!isDeprecatedCallWithArgCountGreaterThan(queryBuilder,2)?process.env.NODE_ENV !== 'production'?invariant(false,
'Relay.QL: Deprecated usage detected. If you are trying to define a ' + 
'query, use `(Component, variables) => Relay.QL`.'):invariant(false):undefined;

if(isDeprecatedCallWithArgCountGreaterThan(queryBuilder,0)){
node = queryBuilder(Component,variables);}else 
{
node = queryBuilder(Component,variables);
if(GraphQL.isQuery(node) && node.fragments.length === 0){
if(!node.fields.every(function(field){return field.fields.length === 0;})){
!
false?process.env.NODE_ENV !== 'production'?invariant(false,
'Relay.QL: Expected query `%s` to be empty. For example, use ' + 
'`node(id: $id)`, not `node(id: $id) { ... }`.',
node.fieldName):invariant(false):undefined;}


var fragmentValues=filterObject(values,function(_,name){return (
Component.hasVariable(name));});

node = new GraphQL.Query(
node.fieldName,
node.calls[0] && node.calls[0].value || null,
node.fields,
[Component.getFragment(queryName,fragmentValues)],
node.metadata,
node.name);}}



componentCache.set(Component,node);}

if(node){
return GraphQL.isQuery(node)?node:undefined;}

return null;}};



function toVariables(variables)

{
return mapObject(variables,function(_,name){return new GraphQL.CallVariable(name);});}


module.exports = buildRQL;