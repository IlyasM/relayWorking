'use strict';













var GraphQL=require('./GraphQL');
var RelayQuery=require('./RelayQuery');
var RelayMetaRoute=require('./RelayMetaRoute');
var RelayProfiler=require('./RelayProfiler');

var invariant=require('fbjs/lib/invariant');





















var fromGraphQL={
Field:function(query){
var node=createNode(query,RelayQuery.Field);
!(
node instanceof RelayQuery.Field)?process.env.NODE_ENV !== 'production'?invariant(false,
'fromGraphQL.Field(): Expected a GraphQL field node.'):invariant(false):undefined;

return node;},

Fragment:function(query){
var node=createNode(query,RelayQuery.Fragment);
!(
node instanceof RelayQuery.Fragment)?process.env.NODE_ENV !== 'production'?invariant(false,
'fromGraphQL.Field(): Expected a GraphQL fragment node.'):invariant(false):undefined;

return node;},

Query:function(query){


query = GraphQL.isQueryWithValues(query)?query.query:query;
var node=createNode(query,RelayQuery.Root);
!(
node instanceof RelayQuery.Root)?process.env.NODE_ENV !== 'production'?invariant(false,
'fromGraphQL.Operation(): Expected a root node.'):invariant(false):undefined;

return node;},

Operation:function(query){
var node=createNode(query,RelayQuery.Operation);
!(
node instanceof RelayQuery.Operation)?process.env.NODE_ENV !== 'production'?invariant(false,
'fromGraphQL.Operation(): Expected a mutation/subscription node.'):invariant(false):undefined;

return node;}};



function createNode(
query,
desiredType)
{
var variables={};
var route=RelayMetaRoute.get('$fromGraphQL');
return desiredType.create(query,route,variables);}


RelayProfiler.instrumentMethods(fromGraphQL,{
Field:'fromGraphQL.Field',
Fragment:'fromGraphQL.Fragment',
Query:'fromGraphQL.Query'});


module.exports = fromGraphQL;