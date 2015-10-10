'use strict';function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}














var RelayQuery=require('./RelayQuery');var 
































RelayQueryVisitor=(function(){function RelayQueryVisitor(){_classCallCheck(this,RelayQueryVisitor);}RelayQueryVisitor.prototype.
visit = function visit(
node,
nextState)
{
if(node instanceof RelayQuery.Field){
return this.visitField(node,nextState);}else 
if(node instanceof RelayQuery.Fragment){
return this.visitFragment(node,nextState);}else 
if(node instanceof RelayQuery.Root){
return this.visitRoot(node,nextState);}};RelayQueryVisitor.prototype.



traverse = function traverse(
node,
nextState)
{var _this=this;
if(!node.isScalar()){
node.getChildren().forEach(function(child){return _this.visit(child,nextState);});}

return node;};RelayQueryVisitor.prototype.


visitField = function visitField(
node,
nextState)
{
return this.traverse(node,nextState);};RelayQueryVisitor.prototype.


visitFragment = function visitFragment(
node,
nextState)
{
return this.traverse(node,nextState);};RelayQueryVisitor.prototype.


visitRoot = function visitRoot(
node,
nextState)
{
return this.traverse(node,nextState);};return RelayQueryVisitor;})();



module.exports = RelayQueryVisitor;