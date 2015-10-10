Object.defineProperty(exports,'__esModule',{value:true});function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass,superClass){if(typeof superClass !== 'function' && superClass !== null){throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__ = superClass;}












'use strict';


var RelayDeprecated=require('./RelayDeprecated');

var RelayQueryConfig=require('./RelayQueryConfig');

var forEachObject=require('fbjs/lib/forEachObject');
var invariant=require('fbjs/lib/invariant');









var createURI=function(){return null;};var 





RelayRoute=(function(_RelayQueryConfig){_inherits(RelayRoute,_RelayQueryConfig);









function RelayRoute(initialVariables,uri){_classCallCheck(this,RelayRoute);
_RelayQueryConfig.call(this,initialVariables);
var constructor=this.constructor;var 

routeName=

constructor.routeName;var path=constructor.path;

!(
constructor !== RelayRoute)?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayRoute: Abstract class cannot be instantiated.'):invariant(false):undefined;

!
routeName?process.env.NODE_ENV !== 'production'?invariant(false,
'%s: Subclasses of RelayRoute must define a `routeName`.',
constructor.name || '<<anonymous>>'):invariant(false):undefined;


if(!uri && path){
uri = createURI(constructor,this.params);}


Object.defineProperty(this,'uri',{
enumerable:true,
value:uri,
writable:false});}RelayRoute.prototype.



prepareVariables = function prepareVariables(prevVariables){var _constructor=





this.constructor;var paramDefinitions=_constructor.paramDefinitions;var prepareParams=_constructor.prepareParams;var processQueryParams=_constructor.processQueryParams;var routeName=_constructor.routeName;
if(processQueryParams && !prepareParams){
RelayDeprecated.warn({
was:routeName + '.processQueryParams',
now:routeName + '.prepareParams'});

prepareParams = processQueryParams;}

var params=prevVariables;
if(prepareParams){

params = prepareParams(params);}

forEachObject(paramDefinitions,function(paramDefinition,paramName){
if(params){
if(params.hasOwnProperty(paramName)){
return;}else 
{

params[paramName] = undefined;}}


!
!paramDefinition.required?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayRoute: Missing required parameter `%s` in `%s`. Check the ' + 
'supplied params or URI.',
paramName,
routeName):invariant(false):undefined;});


return params;};RelayRoute.


injectURICreator = function injectURICreator(creator){
createURI = creator;};return RelayRoute;})(RelayQueryConfig);




module.exports = RelayRoute;