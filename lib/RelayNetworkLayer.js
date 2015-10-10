'use strict';














var Promise=require('fbjs/lib/Promise');



var invariant=require('fbjs/lib/invariant');







var injectedNetworkLayer;






var RelayNetworkLayer={
injectNetworkLayer:function(networkLayer){
injectedNetworkLayer = networkLayer;},


sendMutation:function(mutationRequest){
var networkLayer=getCurrentNetworkLayer();
var promise=networkLayer.sendMutation(mutationRequest);
if(promise){
Promise.resolve(promise).done();}},



sendQueries:function(queryRequests){
var networkLayer=getCurrentNetworkLayer();
var promise=networkLayer.sendQueries(queryRequests);
if(promise){
Promise.resolve(promise).done();}},



supports:function(){
var networkLayer=getCurrentNetworkLayer();
return networkLayer.supports.apply(networkLayer,arguments);}};



function getCurrentNetworkLayer(){
!
injectedNetworkLayer?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayNetworkLayer: Use `injectNetworkLayer` to configure a network layer.'):invariant(false):undefined;

return injectedNetworkLayer;}


module.exports = RelayNetworkLayer;