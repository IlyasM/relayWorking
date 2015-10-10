var _extends=Object.assign || function(target){for(var i=1;i < arguments.length;i++) {var source=arguments[i];for(var key in source) {if(Object.prototype.hasOwnProperty.call(source,key)){target[key] = source[key];}}}return target;};function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}












'use strict';

var RelayNodeInterface=require('./RelayNodeInterface');
var GraphQLStoreDataHandler=require('./GraphQLStoreDataHandler');
var RelayQuery=require('./RelayQuery');
var RelayQuerySerializer=require('./RelayQuerySerializer');

var invariant=require('fbjs/lib/invariant');var 



ID=RelayNodeInterface.ID;var TYPENAME=RelayNodeInterface.TYPENAME;

var EMPTY_FRAGMENT=RelayQuery.Fragment.build(
'$RelayQueryPath',
'Node');var 









RelayQueryPath=(function(){




function RelayQueryPath(
node,
parent)
{_classCallCheck(this,RelayQueryPath);
if(node instanceof RelayQuery.Root){
!
!parent?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQueryPath: Root paths may not have a parent.'):invariant(false):undefined;

this._name = node.getName();}else 
{
!
parent?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQueryPath: A parent is required for field paths.'):invariant(false):undefined;

this._name = parent.getName();}

this._node = node;
this._parent = parent;}RelayQueryPath.prototype.






isRootPath = function isRootPath(){
return !this._parent;};RelayQueryPath.prototype.






getParent = function getParent(){
var parent=this._parent;
!
parent?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQueryPath.getParent(): Cannot get the parent of a root path.'):invariant(false):undefined;

return parent;};RelayQueryPath.prototype.





getName = function getName(){
return this._name;};RelayQueryPath.prototype.







getPath = function getPath(
node,
dataID)
{
if(GraphQLStoreDataHandler.isClientID(dataID)){
return new RelayQueryPath(node,this);}else 
{
var idField=RelayQuery.Field.build(ID,null,null,{
parentType:RelayNodeInterface.NODE_TYPE});

var typeField=RelayQuery.Field.build(TYPENAME,null,null,{
parentType:RelayNodeInterface.NODE_TYPE});

var root=RelayQuery.Root.build(
RelayNodeInterface.NODE,
dataID,
[idField,typeField],
{identifyingArgName:RelayNodeInterface.ID},
this.getName());

return new RelayQueryPath(root);}};RelayQueryPath.prototype.









getQuery = function getQuery(
appendNode)
{
var node=this._node;
var path=this;
var child=appendNode;
while(node instanceof RelayQuery.Field) {
var idFieldName=node.getInferredPrimaryKey();
if(idFieldName){
child = node.clone([
child,
node.getFieldByStorageKey(idFieldName),
node.getFieldByStorageKey(TYPENAME)]);}else 

{
child = node.clone([child]);}

path = path._parent;
!
path?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQueryPath.getQuery(): Expected field to have a parent path.'):invariant(false):undefined;

node = path._node;}

!child?process.env.NODE_ENV !== 'production'?invariant(false,'RelayQueryPath: Expected a leaf node.'):invariant(false):undefined;
!(
node instanceof RelayQuery.Root)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQueryPath: Expected a root node.'):invariant(false):undefined;

var metadata=_extends({},node.__concreteNode__.metadata);
var identifyingArg=node.getIdentifyingArg();
if(identifyingArg && identifyingArg.name != null){
metadata.identifyingArgName = identifyingArg.name;}

return RelayQuery.Root.build(
node.getFieldName(),
identifyingArg && identifyingArg.value || null,
[
child,
node.getFieldByStorageKey(ID),
node.getFieldByStorageKey(TYPENAME)],

metadata,
this.getName());};RelayQueryPath.prototype.



toJSON = function toJSON(){
var path=[];
var next=this;
while(next) {
path.unshift(RelayQuerySerializer.toJSON(getShallowClone(next._node)));
next = next._parent;}

return path;};RelayQueryPath.


fromJSON = function fromJSON(data){
!(
Array.isArray(data) && data.length > 0)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQueryPath.fromJSON(): expected an array with at least one item.'):invariant(false):undefined;

var root=RelayQuerySerializer.fromJSON(data[0]);
!(
root instanceof RelayQuery.Root)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQueryPath.fromJSON(): invalid path, expected first node to be ' + 
'a `RelayQueryRoot`.'):invariant(false):undefined;

var path=new RelayQueryPath(root);

for(var ii=1;ii < data.length;ii++) {
var field=RelayQuerySerializer.fromJSON(data[ii]);
!(
field instanceof RelayQuery.Field)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQueryPath.fromJSON(): invalid path, expected node at index %s ' + 
'to be a `RelayQueryField`.',
ii):invariant(false):undefined;

path = new RelayQueryPath(field,path);}

return path;};return RelayQueryPath;})();







function getShallowClone(
node)
{
var idFieldName=node instanceof RelayQuery.Field?
node.getInferredPrimaryKey():
ID;
var children=[];
var idField=idFieldName && node.getFieldByStorageKey(idFieldName);
if(idField){
children.push(idField);}

var typeField=node.getFieldByStorageKey(TYPENAME);
if(typeField){
children.push(typeField);}



if(!children.length){
children.push(EMPTY_FRAGMENT);}

return node.clone(children);}


module.exports = RelayQueryPath;