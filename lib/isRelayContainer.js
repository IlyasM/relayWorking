'use strict';














function isRelayContainer(component){
return !!(
component && 
component.getFragmentNames && 
component.getFragment && 
component.hasFragment && 
component.hasVariable);}



module.exports = isRelayContainer;