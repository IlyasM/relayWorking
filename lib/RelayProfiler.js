'use strict';














var emptyFunction=require('fbjs/lib/emptyFunction');
var forEachObject=require('fbjs/lib/forEachObject');
var removeFromArray=require('fbjs/lib/removeFromArray');







var aggregateHandlersByName={};
var profileHandlersByName={};

var NOT_INVOKED={};
var defaultProfiler={stop:emptyFunction};
var enableProfile=!!(process.env.NODE_ENV !== 'production');

































var RelayProfiler={





setEnableProfile:function(isEnabled){
enableProfile = isEnabled;},

















instrumentMethods:function(
object,
names)
{
forEachObject(names,function(name,key){
object[key] = RelayProfiler.instrument(name,object[key]);});},













instrument:function(name,originalFunction){
if(process.env.NODE_ENV !== 'production'){
var handlers=[];
var instrumentedCallback=function(){var _this=this;
var originalReturn=NOT_INVOKED;
var boundArguments=arguments;
var invokeCallback=function(){
originalReturn = originalFunction.apply(_this,boundArguments);};

var wrapCallback=function(handler){
invokeCallback = handler.bind(_this,name,invokeCallback);};

handlers.forEach(wrapCallback);
if(aggregateHandlersByName.hasOwnProperty(name)){
aggregateHandlersByName[name].forEach(wrapCallback);}

invokeCallback();
if(originalReturn === NOT_INVOKED){
throw new Error(
'RelayProfiler: Handler did not invoke original function.');}


return originalReturn;};

instrumentedCallback.attachHandler = function(handler){
handlers.push(handler);};

instrumentedCallback.detachHandler = function(handler){
removeFromArray(handlers,handler);};

instrumentedCallback.displayName = '(instrumented ' + name + ')';
return instrumentedCallback;}

originalFunction.attachHandler = emptyFunction;
originalFunction.detachHandler = emptyFunction;
return originalFunction;},


















attachAggregateHandler:function(name,handler){
if(process.env.NODE_ENV !== 'production'){
if(!aggregateHandlersByName.hasOwnProperty(name)){
aggregateHandlersByName[name] = [];}

aggregateHandlersByName[name].push(handler);}},






detachAggregateHandler:function(name,handler){
if(process.env.NODE_ENV !== 'production'){
if(aggregateHandlersByName.hasOwnProperty(name)){
removeFromArray(aggregateHandlersByName[name],handler);}}},

















profile:function(name,state){
if(enableProfile){
if(profileHandlersByName.hasOwnProperty(name)){
var profileHandlers=profileHandlersByName[name];
for(var ii=profileHandlers.length - 1;ii >= 0;ii--) {
var profileHandler=profileHandlers[ii];
if(profileHandler.onStart){
profileHandler.onStart(name,state);}}


return {
stop:function(){
profileHandlersByName[name].forEach(function(profileHandler){
if(profileHandler.onStop){
profileHandler.onStop(name,state);}});}};}}






return defaultProfiler;},





attachProfileHandler:function(name,handler){
if(enableProfile){
if(!profileHandlersByName.hasOwnProperty(name)){
profileHandlersByName[name] = [];}

profileHandlersByName[name].push(handler);}},






detachProfileHandler:function(name,handler){
if(enableProfile){
if(profileHandlersByName.hasOwnProperty(name)){
removeFromArray(profileHandlersByName[name],handler);}}}};






module.exports = RelayProfiler;