'use strict';

























function filterRelayQuery(
node,
callback)
{
if(callback(node)){
return node.clone(node.getChildren().map(
function(child){return filterRelayQuery(child,callback);}));}


return null;}


module.exports = filterRelayQuery;