Object.defineProperty(exports,'__esModule',{value:true});var _extends=Object.assign || function(target){for(var i=1;i < arguments.length;i++) {var source=arguments[i];for(var key in source) {if(Object.prototype.hasOwnProperty.call(source,key)){target[key] = source[key];}}}return target;};function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}












'use strict';


var RelayDeprecated=require('./RelayDeprecated');
var RelayFragmentReference=require('./RelayFragmentReference');

var RelayStore=require('./RelayStore');


var buildRQL=require('./buildRQL');

var forEachObject=require('fbjs/lib/forEachObject');
var fromGraphQL=require('./fromGraphQL');
var invariant=require('fbjs/lib/invariant');
var warning=require('fbjs/lib/warning');var 











RelayMutation=(function(){











function RelayMutation(props){_classCallCheck(this,RelayMutation);
this._didShowFakeDataWarning = false;
this._resolveProps(props);}RelayMutation.prototype.






getMutation = function getMutation(){
!
false?process.env.NODE_ENV !== 'production'?invariant(false,
'%s: Expected abstract method `getMutation` to be implemented.',
this.constructor.name):invariant(false):undefined;};RelayMutation.prototype.

























getFatQuery = function getFatQuery(){
!
false?process.env.NODE_ENV !== 'production'?invariant(false,
'%s: Expected abstract method `getFatQuery` to be implemented.',
this.constructor.name):invariant(false):undefined;};RelayMutation.prototype.







































































getConfigs = function getConfigs(){
!
false?process.env.NODE_ENV !== 'production'?invariant(false,
'%s: Expected abstract method `getConfigs` to be implemented.',
this.constructor.name):invariant(false):undefined;};RelayMutation.prototype.






getVariables = function getVariables(){
!
false?process.env.NODE_ENV !== 'production'?invariant(false,
'%s: Expected abstract method `getVariables` to be implemented.',
this.constructor.name):invariant(false):undefined;};RelayMutation.prototype.






getFiles = function getFiles(){
return null;};RelayMutation.prototype.














getOptimisticResponse = function getOptimisticResponse(){
return null;};RelayMutation.prototype.








getOptimisticConfigs = function getOptimisticConfigs(){
return null;};RelayMutation.prototype.








getCollisionKey = function getCollisionKey(){
return null;};RelayMutation.prototype.


_resolveProps = function _resolveProps(props){var _this=this;
var fragments=RelayDeprecated.getMutationFragments(this.constructor);
var initialVariables=
RelayDeprecated.getMutationInitialVariables(this.constructor) || {};

var resolvedProps=_extends({},props);
forEachObject(fragments,function(fragmentBuilder,fragmentName){
var propValue=props[fragmentName];
process.env.NODE_ENV !== 'production'?warning(
propValue !== undefined,
'RelayMutation: Expected data for fragment `%s` to be supplied to ' + 
'`%s` as a prop. Pass an explicit `null` if this is intentional.',
fragmentName,
_this.constructor.name):undefined;


if(!propValue){
return;}


var fragment=fromGraphQL.Fragment(buildMutationFragment(
_this.constructor.name,
fragmentName,
fragmentBuilder,
initialVariables));

var concreteFragmentID=fragment.getConcreteFragmentID();

if(fragment.isPlural()){
!
Array.isArray(propValue)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayMutation: Invalid prop `%s` supplied to `%s`, expected an ' + 
'array of records because the corresponding fragment is plural.',
fragmentName,
_this.constructor.name):invariant(false):undefined;

var dataIDs=propValue.reduce(function(acc,item,ii){
var eachFragmentPointer=item[concreteFragmentID];
!
eachFragmentPointer?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayMutation: Invalid prop `%s` supplied to `%s`, ' + 
'expected element at index %s to have query data.',
fragmentName,
_this.constructor.name,
ii):invariant(false):undefined;

return acc.concat(eachFragmentPointer.getDataIDs());},
[]);

resolvedProps[fragmentName] = RelayStore.readAll(fragment,dataIDs);}else 
{
!
!Array.isArray(propValue)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayMutation: Invalid prop `%s` supplied to `%s`, expected a ' + 
'single record because the corresponding fragment is not plural.',
fragmentName,
_this.constructor.name):invariant(false):undefined;

var fragmentPointer=propValue[concreteFragmentID];
if(fragmentPointer){
var dataID=fragmentPointer.getDataID();
resolvedProps[fragmentName] = RelayStore.read(fragment,dataID);}else 
{
if(process.env.NODE_ENV !== 'production'){
if(!_this._didShowFakeDataWarning){
_this._didShowFakeDataWarning = true;
process.env.NODE_ENV !== 'production'?warning(
false,
'RelayMutation: Expected prop `%s` supplied to `%s` to ' + 
'be data fetched by Relay. This is likely an error unless ' + 
'you are purposely passing in mock data that conforms to ' + 
'the shape of this mutation\'s fragment.',
fragmentName,
_this.constructor.name):undefined;}}}}});






this.props = resolvedProps;};RelayMutation.


getFragment = function getFragment(
fragmentName,
variableMapping)
{var _this2=this;

var fragments=RelayDeprecated.getMutationFragments(this);
var fragmentBuilder=fragments[fragmentName];
if(!fragmentBuilder){
!
false?process.env.NODE_ENV !== 'production'?invariant(false,
'%s.getFragment(): `%s` is not a valid fragment name. Available ' + 
'fragments names: %s',
this.name,
fragmentName,
Object.keys(fragments).map(function(name){return '`' + name + '`';}).join(', ')):invariant(false):undefined;}




var processQueryParams=this.processQueryParams;
if(processQueryParams && !this.prepareVariables){
RelayDeprecated.warn({
was:this.name + '.getQuery',
now:this.name + '.getFragment'});

this.prepareVariables = 
function(prevVariables,route){return processQueryParams(route,prevVariables);};}

var initialVariables=
RelayDeprecated.getMutationInitialVariables(this) || {};
var prepareVariables=this.prepareVariables;

return RelayFragmentReference.createForContainer(
function(){return buildMutationFragment(
_this2.name,
fragmentName,
fragmentBuilder,
initialVariables);},

initialVariables,
variableMapping,
prepareVariables);};RelayMutation.






getQuery = function getQuery(){
RelayDeprecated.warn({
was:this.name + '.getQuery',
now:this.name + '.getFragment'});

return this.getFragment.apply(this,arguments);};return RelayMutation;})();






function buildMutationFragment(
mutationName,
fragmentName,
fragmentBuilder,
variables)
{
var fragment=buildRQL.Fragment(
fragmentBuilder,
variables);

!
fragment?process.env.NODE_ENV !== 'production'?invariant(false,
'Relay.QL defined on mutation `%s` named `%s` is not a valid fragment. ' + 
'A typical fragment is defined using: Relay.QL`fragment on Type {...}`',
mutationName,
fragmentName):invariant(false):undefined;

return fragment;}


module.exports = RelayMutation;