'use strict';














var RelayQuery=require('./RelayQuery');

var invariant=require('fbjs/lib/invariant');





























function refragmentRelayQuery(node){




if(
node instanceof RelayQuery.Fragment || 
node instanceof RelayQuery.Field && !node.isUnionOrInterface())
{
return node.clone(node.getChildren().map(refragmentRelayQuery));}








var children=[];
var fieldsByType={};
node.getChildren().forEach(function(child){
var clone=refragmentRelayQuery(child);
if(clone == null){
return;}

if(clone instanceof RelayQuery.Fragment){
children.push(clone);}else 
{
!(
clone instanceof RelayQuery.Field)?process.env.NODE_ENV !== 'production'?invariant(false,
'refragmentRelayQuery(): invalid node type, expected a `Field` or ' + 
'`Fragment`.'):invariant(false):undefined;

var parentType=clone.getParentType();
var fields=fieldsByType[parentType];
if(!fields){
fieldsByType[parentType] = fields = [];}

fields.push(clone);}});


Object.keys(fieldsByType).forEach(function(type){
children.push(RelayQuery.Fragment.build(
'refragmentRelayQuery',
type,
fieldsByType[type]));});


return node.clone(children);}


module.exports = refragmentRelayQuery;