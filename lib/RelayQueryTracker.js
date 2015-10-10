function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i < arr.length;i++) arr2[i] = arr[i];return arr2;}else {return Array.from(arr);}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}












'use strict';

var GraphQLStoreDataHandler=require('./GraphQLStoreDataHandler');
var RelayQuery=require('./RelayQuery');

var flattenRelayQuery=require('./flattenRelayQuery');
var invariant=require('fbjs/lib/invariant');





var TYPE='__type__';var 

RelayQueryTracker=(function(){





function RelayQueryTracker(){_classCallCheck(this,RelayQueryTracker);
this._trackedNodesByID = {};}RelayQueryTracker.prototype.


trackNodeForID = function trackNodeForID(
node,
dataID,
path)
{


if(GraphQLStoreDataHandler.isClientID(dataID)){
!
path?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQueryTracker.trackNodeForID(): Expected `path` for client ID, ' + 
'`%s`.',
dataID):invariant(false):undefined;

if(!path.isRootPath()){
return;}}



if(node instanceof RelayQuery.Field && node.getSchemaName() === TYPE){
return;}


this._trackedNodesByID[dataID] = this._trackedNodesByID[dataID] || {
trackedNodes:[],
isFlattened:false};

this._trackedNodesByID[dataID].trackedNodes.push(node);
this._trackedNodesByID[dataID].isFlattened = false;};RelayQueryTracker.prototype.





getTrackedChildrenForID = function getTrackedChildrenForID(
dataID)
{
var trackedNodesByID=this._trackedNodesByID[dataID];
if(!trackedNodesByID){
return [];}var 

isFlattened=trackedNodesByID.isFlattened;var trackedNodes=trackedNodesByID.trackedNodes;
if(!isFlattened){
var trackedChildren=[];
trackedNodes.forEach(function(trackedQuery){
trackedChildren.push.apply(trackedChildren,_toConsumableArray(trackedQuery.getChildren()));});

trackedNodes.length = 0;
trackedNodesByID.isFlattened = true;
var containerNode=RelayQuery.Fragment.build(
'RelayQueryTracker',
'Node',
trackedChildren);

if(containerNode){
var flattenedNode=flattenRelayQuery(containerNode);
if(flattenedNode){
trackedNodes.push(flattenedNode);}}}



var trackedNode=trackedNodes[0];
if(trackedNode){
return trackedNode.getChildren();}

return [];};RelayQueryTracker.prototype.






untrackNodesForID = function untrackNodesForID(
dataID)
{
delete this._trackedNodesByID[dataID];};return RelayQueryTracker;})();



module.exports = RelayQueryTracker;