'use strict';














var GraphQLStoreDataHandler=require('./GraphQLStoreDataHandler');








var clientIDToServerIDMap={};



var mutationIDToClientNodeIDMap={};



var clientMutationIDToErrorNodeID={};
var clientNodeIDToErrorMutationID={};







var RelayMutationTracker={






isClientOnlyID:function(dataID){
return (
GraphQLStoreDataHandler.isClientID(dataID) && 
!clientIDToServerIDMap[dataID]);},







updateClientServerIDMap:function(
clientID,
serverID)
{
clientIDToServerIDMap[clientID] = serverID;},





getServerIDForClientID:function(
clientID)
{
return clientIDToServerIDMap[clientID] || null;},





putClientIDForMutation:function(
clientID,
clientMutationID)
{
mutationIDToClientNodeIDMap[clientMutationID] = clientID;



var errorNodeID=
RelayMutationTracker.getErrorNodeForMutation(clientMutationID);
if(errorNodeID){
RelayMutationTracker.deleteMutationForErrorNode(errorNodeID);
RelayMutationTracker.putErrorNodeForMutation(clientID,clientMutationID);}},






getClientIDForMutation:function(
clientMutationID)
{
return mutationIDToClientNodeIDMap[clientMutationID];},





deleteClientIDForMutation:function(
clientMutationID)
{
delete mutationIDToClientNodeIDMap[clientMutationID];},





putErrorNodeForMutation:function(
clientID,
clientMutationID)
{
clientNodeIDToErrorMutationID[clientID] = clientMutationID;
clientMutationIDToErrorNodeID[clientMutationID] = clientID;},






getMutationForErrorNode:function(
clientID)
{
return clientNodeIDToErrorMutationID[clientID];},






getErrorNodeForMutation:function(
clientMutationID)
{
return clientMutationIDToErrorNodeID[clientMutationID];},


deleteMutationForErrorNode:function(
clientID)
{
delete clientNodeIDToErrorMutationID[clientID];},


deleteErrorNodeForMutation:function(
clientMutationID)
{
delete clientMutationIDToErrorNodeID[clientMutationID];}};



module.exports = RelayMutationTracker;