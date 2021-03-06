function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass,superClass){if(typeof superClass !== 'function' && superClass !== null){throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__ = superClass;}












'use strict';


var RelayQueryVisitor=require('./RelayQueryVisitor');


var emptyFunction=require('fbjs/lib/emptyFunction');

var SERIALIZATION_KEY='__serializationKey__';







var validateRelayReadQuery=emptyFunction;

if(process.env.NODE_ENV !== 'production'){

(function(){










validateRelayReadQuery = function validateRelayReadQuery(
queryNode,
options)
{
var validator=new RelayStoreReadValidator(options);
validator.visit(queryNode,{});};


function assertUniqueAlias(
field,
aliasMap)
{
var serializationKey=field.getSerializationKey();
if(aliasMap[SERIALIZATION_KEY]){
if(aliasMap[SERIALIZATION_KEY] !== serializationKey){
console.error(
'`%s` is used as an alias more than once. Please use unique ' + 
'aliases.',
field.getApplicationName());}}else 


{
aliasMap[SERIALIZATION_KEY] = serializationKey;}}







function getAliasMap(node,aliasMap){
var applicationName=node.getApplicationName();
if(!aliasMap[applicationName]){
aliasMap[applicationName] = {};}

return aliasMap[applicationName];}var 


RelayStoreReadValidator=(function(_RelayQueryVisitor){_inherits(RelayStoreReadValidator,_RelayQueryVisitor);


function RelayStoreReadValidator(
options)
{_classCallCheck(this,RelayStoreReadValidator);
_RelayQueryVisitor.call(this);
this._traverseFragmentReferences = 
options && options.traverseFragmentReferences || false;}RelayStoreReadValidator.prototype.


visitField = function visitField(node,aliasMap){
aliasMap = getAliasMap(node,aliasMap);
assertUniqueAlias(node,aliasMap);

if(node.isGenerated()){
return;}else 
if(node.isScalar()){
return;}else 
if(node.isPlural()){
this._readPlural(node,aliasMap);}else 
{

this._readLinkedField(node,aliasMap);}};RelayStoreReadValidator.prototype.



visitFragment = function visitFragment(
node,
aliasMap)
{
if(this._traverseFragmentReferences || !node.isContainerFragment()){
this.traverse(node,aliasMap);}};RelayStoreReadValidator.prototype.



_readPlural = function _readPlural(node,aliasMap){var _this=this;
node.getChildren().forEach(function(child){return _this.visit(child,aliasMap);});};RelayStoreReadValidator.prototype.


_readLinkedField = function _readLinkedField(node,aliasMap){
aliasMap = getAliasMap(node,aliasMap);
this.traverse(node,aliasMap);};return RelayStoreReadValidator;})(RelayQueryVisitor);})();}





module.exports = validateRelayReadQuery;