'use strict';




















function generateClientEdgeID(rangeID,nodeID){
return 'client:' + rangeID + ':' + nodeID;}


module.exports = generateClientEdgeID;