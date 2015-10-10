var _extends=Object.assign || function(target){for(var i=1;i < arguments.length;i++) {var source=arguments[i];for(var key in source) {if(Object.prototype.hasOwnProperty.call(source,key)){target[key] = source[key];}}}return target;};function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}












'use strict';

var GraphQL=require('./GraphQL');



var forEachObject=require('fbjs/lib/forEachObject');
var invariant=require('fbjs/lib/invariant');
var warning=require('fbjs/lib/warning');var 




































































RelayFragmentReference=(function(){RelayFragmentReference.










createForContainer = function createForContainer(
fragmentGetter,
initialVariables,
variableMapping,
prepareVariables)
{
var reference=new RelayFragmentReference(
fragmentGetter,
initialVariables,
variableMapping,
prepareVariables);

reference._isContainerFragment = true;
return reference;};


function RelayFragmentReference(
fragmentGetter,
initialVariables,
variableMapping,
prepareVariables)
{_classCallCheck(this,RelayFragmentReference);
this._initialVariables = initialVariables || {};
this._fragment = undefined;
this._fragmentGetter = fragmentGetter;
this._isContainerFragment = false;
this._isDeferred = false;
this._isTypeConditional = false;
this._variableMapping = variableMapping;
this._prepareVariables = prepareVariables;}RelayFragmentReference.prototype.





defer = function defer(){
this._isDeferred = true;
return this;};RelayFragmentReference.prototype.





conditionOnType = function conditionOnType(){
this._isTypeConditional = true;
return this;};RelayFragmentReference.prototype.





if = function _if(callVariable){
!
GraphQL.isCallVariable(callVariable)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayFragmentReference: Invalid value `%s` supplied to `if()`. ' + 
'Expected a variable.',
callVariable):invariant(false):undefined;

this._addCondition(
function(variables){return !!variables[callVariable.callVariableName];});

return this;};RelayFragmentReference.prototype.





unless = function unless(callVariable){
!
GraphQL.isCallVariable(callVariable)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayFragmentReference: Invalid value `%s` supplied to `unless()`. ' + 
'Expected a variable.',
callVariable):invariant(false):undefined;

this._addCondition(
function(variables){return !variables[callVariable.callVariableName];});

return this;};RelayFragmentReference.prototype.







_getFragment = function _getFragment(){
if(this._fragment == null){
this._fragment = this._fragmentGetter();}

return this._fragment;};RelayFragmentReference.prototype.





getFragment = function getFragment(variables){

var conditions=this._conditions;
if(conditions && !conditions.every(function(cb){return cb(variables);})){
return null;}

return this._getFragment();};RelayFragmentReference.prototype.






getVariables = function getVariables(route,variables){var _this=this;
var innerVariables=_extends({},this._initialVariables);


var variableMapping=this._variableMapping;
if(variableMapping){
forEachObject(variableMapping,function(value,name){
if(GraphQL.isCallVariable(value)){
value = variables[value.callVariableName];}

if(value === undefined){
process.env.NODE_ENV !== 'production'?warning(
false,
'RelayFragmentReference: Variable `%s` is undefined in fragment ' + 
'`%s`.',
name,
_this._getFragment().name):undefined;}else 

{
innerVariables[name] = value;}});}




var prepareVariables=this._prepareVariables;
if(prepareVariables){
innerVariables = prepareVariables(innerVariables,route);}


return innerVariables;};RelayFragmentReference.prototype.


isContainerFragment = function isContainerFragment(){
return this._isContainerFragment;};RelayFragmentReference.prototype.


isDeferred = function isDeferred(){
return this._isDeferred;};RelayFragmentReference.prototype.


isTypeConditional = function isTypeConditional(){
return this._isTypeConditional;};RelayFragmentReference.prototype.


_addCondition = function _addCondition(condition){
var conditions=this._conditions;
if(!conditions){
conditions = [];
this._conditions = conditions;}

conditions.push(condition);};return RelayFragmentReference;})();



module.exports = RelayFragmentReference;