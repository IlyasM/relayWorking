function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i < arr.length;i++) arr2[i] = arr[i];return arr2;}else {return Array.from(arr);}}












'use strict';


var GraphQLStoreDataHandler=require('./GraphQLStoreDataHandler');
var RelayConnectionInterface=require('./RelayConnectionInterface');

var RelayMetaRoute=require('./RelayMetaRoute');
var RelayMutationType=require('./RelayMutationType');
var RelayNodeInterface=require('./RelayNodeInterface');
var RelayQuery=require('./RelayQuery');

var RelayStoreData=require('./RelayStoreData');


var flattenRelayQuery=require('./flattenRelayQuery');
var forEachObject=require('fbjs/lib/forEachObject');
var nullthrows=require('fbjs/lib/nullthrows');
var inferRelayFieldsFromData=require('./inferRelayFieldsFromData');
var intersectRelayQuery=require('./intersectRelayQuery');
var invariant=require('fbjs/lib/invariant');
var refragmentRelayQuery=require('./refragmentRelayQuery');var 

































CLIENT_MUTATION_ID=RelayConnectionInterface.CLIENT_MUTATION_ID;











var RelayMutationQuery={








buildFragmentForFields:function(
_ref)




{var tracker=_ref.tracker;var fatQuery=_ref.fatQuery;var fieldIDs=_ref.fieldIDs;
var queryTracker=
tracker || RelayStoreData.getDefaultInstance().getQueryTracker();
var mutatedFields=[];
forEachObject(fieldIDs,function(dataIDOrIDs,fieldName){
var fatField=getFieldFromFatQuery(fatQuery,fieldName);
var dataIDs=[].concat(dataIDOrIDs);
var trackedChildren=[];
dataIDs.forEach(function(dataID){
trackedChildren.push.apply(trackedChildren,_toConsumableArray(queryTracker.getTrackedChildrenForID(dataID)));});

var trackedField=fatField.clone(trackedChildren);
if(trackedField){
var mutationField=intersectRelayQuery(trackedField,fatField);
if(mutationField){
mutatedFields.push(mutationField);}}});



return buildMutationFragment(fatQuery,mutatedFields);},


















buildFragmentForEdgeDeletion:function(
_ref2)






{var tracker=_ref2.tracker;var fatQuery=_ref2.fatQuery;var connectionName=_ref2.connectionName;var parentID=_ref2.parentID;var parentName=_ref2.parentName;
tracker = tracker || RelayStoreData.getDefaultInstance().getQueryTracker();
var fatParent=getFieldFromFatQuery(fatQuery,parentName);
var mutatedFields=[];
var trackedParent=fatParent.clone(
tracker.getTrackedChildrenForID(parentID));

if(trackedParent){
var filterUnterminatedRange=function(node){return (
node.getSchemaName() === connectionName);};

var mutatedField=intersectRelayQuery(
trackedParent,
fatParent,
filterUnterminatedRange);

if(mutatedField){
mutatedFields.push(mutatedField);}}


return buildMutationFragment(fatQuery,mutatedFields);},






















buildFragmentForEdgeInsertion:function(
_ref3)








{var tracker=_ref3.tracker;var fatQuery=_ref3.fatQuery;var connectionName=_ref3.connectionName;var parentID=_ref3.parentID;var edgeName=_ref3.edgeName;var parentName=_ref3.parentName;var rangeBehaviors=_ref3.rangeBehaviors;
tracker = tracker || RelayStoreData.getDefaultInstance().getQueryTracker();
var trackedChildren=tracker.getTrackedChildrenForID(parentID);

var mutatedFields=[];
var trackedConnections=
trackedChildren.filter(function(trackedChild){
return (
trackedChild instanceof RelayQuery.Field && 
trackedChild.getSchemaName() === connectionName);});



if(trackedConnections.length){
var keysWithoutRangeBehavior={};
var mutatedEdgeFields=[];
trackedConnections.forEach(function(trackedConnection){
var trackedEdge=trackedConnection.getFieldByStorageKey('edges');
if(trackedEdge == null){
return;}

if(getRangeBehaviorKey(trackedConnection) in rangeBehaviors){


mutatedEdgeFields.push.apply(mutatedEdgeFields,_toConsumableArray(trackedEdge.getChildren()));}else 
{

var key=trackedConnection.getSerializationKey();
keysWithoutRangeBehavior[key] = true;}});


if(mutatedEdgeFields.length){
mutatedFields.push(
buildEdgeField(parentID,edgeName,mutatedEdgeFields));}




if(parentName != null){
var fatParent=getFieldFromFatQuery(fatQuery,parentName);
var trackedParent=fatParent.clone(trackedChildren);
if(trackedParent){
var filterUnterminatedRange=function(node){return (
!keysWithoutRangeBehavior.hasOwnProperty(node.getSerializationKey()));};

var mutatedParent=intersectRelayQuery(
trackedParent,
fatParent,
filterUnterminatedRange);

if(mutatedParent){
mutatedFields.push(mutatedParent);}}}}




return buildMutationFragment(fatQuery,mutatedFields);},





buildFragmentForOptimisticUpdate:function(
_ref4)
{var response=_ref4.response;var fatQuery=_ref4.fatQuery;


var mutatedFields=inferRelayFieldsFromData(response);
return buildMutationFragment(fatQuery,mutatedFields);},





buildQueryForOptimisticUpdate:function(
_ref5)
{var response=_ref5.response;var fatQuery=_ref5.fatQuery;var mutation=_ref5.mutation;
var children=[
nullthrows(RelayMutationQuery.buildFragmentForOptimisticUpdate({
response:response,
fatQuery:fatQuery}))];


return RelayQuery.Mutation.build(
'OptimisticQuery',
fatQuery.getType(),
mutation.calls[0].name,
null,
children,
mutation.metadata);},









buildQuery:function(
_ref6){var 
configs=_ref6.configs;var 
fatQuery=_ref6.fatQuery;var 
mutationName=_ref6.mutationName;var 
mutation=_ref6.mutation;var 
tracker=_ref6.tracker;var 
input=_ref6.input;return (function()













{
tracker = tracker || RelayStoreData.getDefaultInstance().getQueryTracker();

var children=[
RelayQuery.Field.build(
CLIENT_MUTATION_ID,
null,
null,
{'requisite':true})];



configs.forEach(function(config){
switch(config.type){
case RelayMutationType.REQUIRED_CHILDREN:
children = children.concat(config.children.map(function(child){return (
RelayQuery.Fragment.create(
child,
RelayMetaRoute.get('$buildQuery'),
{}));}));


break;

case RelayMutationType.RANGE_ADD:
children.push(RelayMutationQuery.buildFragmentForEdgeInsertion({
connectionName:config.connectionName,
edgeName:config.edgeName,
fatQuery:fatQuery,
parentID:config.parentID,
parentName:config.parentName,
rangeBehaviors:config.rangeBehaviors,
tracker:tracker}));

break;

case RelayMutationType.RANGE_DELETE:
case RelayMutationType.NODE_DELETE:
children.push(RelayMutationQuery.buildFragmentForEdgeDeletion({
connectionName:config.connectionName,
fatQuery:fatQuery,
parentID:config.parentID,
parentName:config.parentName,
tracker:tracker}));

children.push(RelayQuery.Field.build(config.deletedIDFieldName));
break;

case RelayMutationType.FIELDS_CHANGE:
children.push(RelayMutationQuery.buildFragmentForFields({
fatQuery:fatQuery,
fieldIDs:config.fieldIDs,
tracker:tracker}));

break;}});




var fragmentedFields=children.length?
refragmentRelayQuery(RelayQuery.Field.build(
'build_mutation_field',
null,
children)):

null;

return RelayQuery.Mutation.build(
mutationName,
fatQuery.getType(),
mutation.calls[0].name,
input,
fragmentedFields?fragmentedFields.getChildren():null,
mutation.metadata);})();}};




function getFieldFromFatQuery(
fatQuery,
fieldName)
{
var field=fatQuery.getFieldByStorageKey(fieldName);
!
field?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayMutationQuery: Invalid field name on fat query, `%s`.',
fieldName):invariant(false):undefined;

return field;}


function buildMutationFragment(
fatQuery,
fields)
{
var fragment=RelayQuery.Fragment.build(
'MutationQuery',
fatQuery.getType(),
fields);

if(fragment){
!(
fragment instanceof RelayQuery.Fragment)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayMutationQuery: Expected a fragment.'):invariant(false):undefined;

return fragment;}

return null;}


function buildEdgeField(
parentID,
edgeName,
edgeFields)
{
var fields=[
RelayQuery.Field.build('cursor')];

if(RelayConnectionInterface.EDGES_HAVE_SOURCE_FIELD && 
!GraphQLStoreDataHandler.isClientID(parentID)){
fields.push(
RelayQuery.Field.build(
'source',
null,
[RelayQuery.Field.build('id',null,null,{
parentType:RelayNodeInterface.NODE_TYPE})]));}




fields.push.apply(fields,edgeFields);
var edgeField=flattenRelayQuery(RelayQuery.Field.build(
edgeName,
null,
fields));

!(
edgeField instanceof RelayQuery.Field)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayMutationQuery: Expected a field.'):invariant(false):undefined;

return edgeField;}


function getRangeBehaviorKey(connectionField){

return connectionField.getStorageKey().substr(
connectionField.getSchemaName().length + 1);}



module.exports = RelayMutationQuery;