function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass,superClass){if(typeof superClass !== 'function' && superClass !== null){throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__ = superClass;}












'use strict';


var RelayQueryVisitor=require('./RelayQueryVisitor');var 


































RelayQueryTransform=(function(_RelayQueryVisitor){_inherits(RelayQueryTransform,_RelayQueryVisitor);function RelayQueryTransform(){_classCallCheck(this,RelayQueryTransform);_RelayQueryVisitor.apply(this,arguments);}RelayQueryTransform.prototype.
traverse = function traverse(
node,
nextState)
{
if(node.isScalar()){
return node;}


var nextChildren;
var children=node.getChildren();
for(var ii=0;ii < children.length;ii++) {
var prevChild=children[ii];
var nextChild=this.visit(prevChild,nextState);
if(nextChild !== prevChild){
nextChildren = nextChildren || children.slice(0,ii);}

if(nextChildren && nextChild){
nextChildren.push(nextChild);}}


if(nextChildren){
if(!nextChildren.length){
return null;}

return node.clone(nextChildren);}

return node;};return RelayQueryTransform;})(RelayQueryVisitor);



module.exports = RelayQueryTransform;