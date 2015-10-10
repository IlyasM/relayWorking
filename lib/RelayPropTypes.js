'use strict';var _require=














require('react-native');var PropTypes=_require.PropTypes;
var isRelayContainer=require('./isRelayContainer');

var RelayPropTypes={
Container:function(props,propName){
var component=props[propName];
if(component == null){
return new Error(
'Required prop `Component` was not specified in `RelayRootContainer`.');}else 

if(!isRelayContainer(component)){
return new Error(
'Invalid prop `Component` supplied to `RelayRootContainer`, ' + 
'expected a RelayContainer.');}


return null;},


QueryConfig:PropTypes.shape({
name:PropTypes.string.isRequired,
params:PropTypes.object.isRequired,
queries:PropTypes.object.isRequired,
uri:PropTypes.object})};



module.exports = RelayPropTypes;