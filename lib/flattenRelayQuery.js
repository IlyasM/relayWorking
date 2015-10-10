function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass,superClass){if(typeof superClass !== 'function' && superClass !== null){throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__ = superClass;}












'use strict';

var RelayProfiler=require('./RelayProfiler');

var RelayQueryVisitor=require('./RelayQueryVisitor');

var sortTypeFirst=require('./sortTypeFirst');















function flattenRelayQuery(node){
var flattener=new RelayQueryFlattener();
var flattenedFieldMap={};
flattener.traverse(node,{node:node,flattenedFieldMap:flattenedFieldMap});
return toQuery(node,flattenedFieldMap);}


function toQuery(
node,
flattenedFieldMap)
{
var keys=Object.keys(flattenedFieldMap).sort(sortTypeFirst);
return node.clone(
keys.map(function(alias){
var field=flattenedFieldMap[alias];
if(field){
return toQuery(field.node,field.flattenedFieldMap);}}));}var 





RelayQueryFlattener=(function(_RelayQueryVisitor){_inherits(RelayQueryFlattener,_RelayQueryVisitor);function RelayQueryFlattener(){_classCallCheck(this,RelayQueryFlattener);_RelayQueryVisitor.apply(this,arguments);}RelayQueryFlattener.prototype.
visitField = function visitField(
node,
state)
{
var serializationKey=node.getSerializationKey();
var flattenedField=state.flattenedFieldMap[serializationKey];
if(!flattenedField){
flattenedField = {
node:node,
flattenedFieldMap:{}};

state.flattenedFieldMap[serializationKey] = flattenedField;}

this.traverse(node,flattenedField);};return RelayQueryFlattener;})(RelayQueryVisitor);



module.exports = RelayProfiler.instrument(
'flattenRelayQuery',
flattenRelayQuery);