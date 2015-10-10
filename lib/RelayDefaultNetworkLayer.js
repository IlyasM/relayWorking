var _extends=Object.assign || function(target){for(var i=1;i < arguments.length;i++) {var source=arguments[i];for(var key in source) {if(Object.prototype.hasOwnProperty.call(source,key)){target[key] = source[key];}}}return target;};function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}












'use strict';

var Promise=require('fbjs/lib/Promise');



// var fetch=require('fbjs/lib/fetch');
// var fetchWithRetries=require('fbjs/lib/fetchWithRetries');
var 











RelayDefaultNetworkLayer=(function(){



function RelayDefaultNetworkLayer(uri,init){_classCallCheck(this,RelayDefaultNetworkLayer);
this._uri = uri;
this._init = _extends({},init);



var self=this;
self.sendMutation = this.sendMutation.bind(this);
self.sendQueries = this.sendQueries.bind(this);
self.supports = this.supports.bind(this);}RelayDefaultNetworkLayer.prototype.


sendMutation = function sendMutation(request){
return this._sendMutation(request).then(
function(result){return result.json();}).
then(function(payload){
if(payload.hasOwnProperty('errors')){
var error=new Error(
'Server request for mutation `' + request.getDebugName() + '` ' + 
'failed for the following reasons:\n\n' + 
formatRequestErrors(request,payload.errors));

error.source = payload;
request.reject(error);}else 
{
request.resolve({response:payload.data});}}).

catch(
function(error){return request.reject(error);});};RelayDefaultNetworkLayer.prototype.



sendQueries = function sendQueries(requests){var _this=this;
return Promise.all(requests.map(function(request){return (
_this._sendQuery(request).then(
function(result){return result.json();}).
then(function(payload){
if(payload.hasOwnProperty('errors')){
var error=new Error(
'Server request for query `' + request.getDebugName() + '` ' + 
'failed for the following reasons:\n\n' + 
formatRequestErrors(request,payload.errors));

error.source = payload;
request.reject(error);}else 
if(!payload.hasOwnProperty('data')){
request.reject(new Error(
'Server response was missing for query `' + request.getDebugName() + 
'`.'));}else 

{
request.resolve({response:payload.data});}}).

catch(
function(error){return request.reject(error);}));}));};RelayDefaultNetworkLayer.prototype.




supports = function supports(){

return false;};RelayDefaultNetworkLayer.prototype.





_sendMutation = function _sendMutation(request){
var init;
var files=request.getFiles();
if(files){
if(!global.FormData){
throw new Error('Uploading files without `FormData` not supported.');}

var formData=new FormData();
formData.append('query',request.getQueryString());
formData.append('variables',JSON.stringify(request.getVariables()));
for(var filename in files) {
if(files.hasOwnProperty(filename)){
formData.append(filename,files[filename]);}}


init = _extends({},
this._init,{
body:formData,
method:'POST'});}else 

{
init = _extends({},
this._init,{
body:JSON.stringify({
query:request.getQueryString(),
variables:request.getVariables()}),

headers:_extends({},
this._init.headers,{
'Content-Type':'application/json'}),

method:'POST'});}


return fetch(this._uri,init).then(throwOnServerError);};RelayDefaultNetworkLayer.prototype.





_sendQuery = function _sendQuery(request){
return fetch(this._uri,_extends({},
this._init,{
body:JSON.stringify({
query:request.getQueryString(),
variables:request.getVariables()}),

headers:_extends({},
this._init.headers,{
'Content-Type':'application/json'}),

method:'POST'}));};return RelayDefaultNetworkLayer;})();








function throwOnServerError(response){
if(response.status >= 200 && response.status < 300){
return response;}else 
{
throw response;}}






function formatRequestErrors(
request,
errors)
{
var CONTEXT_BEFORE=20;
var CONTEXT_LENGTH=60;

var queryLines=request.getQueryString().split('\n');
return errors.map(function(_ref,ii){var locations=_ref.locations;var message=_ref.message;
var prefix=ii + 1 + '. ';
var indent=' '.repeat(prefix.length);


var locationMessage=locations?
'\n' + locations.map(function(_ref2){var column=_ref2.column;var line=_ref2.line;
var queryLine=queryLines[line - 1];
var offset=Math.min(column - 1,CONTEXT_BEFORE);
return [
queryLine.substr(column - 1 - offset,CONTEXT_LENGTH),
' '.repeat(offset) + '^^^'].
map(function(messageLine){return indent + messageLine;}).join('\n');}).
join('\n'):
'';

return prefix + message + locationMessage;}).

join('\n');}


module.exports = RelayDefaultNetworkLayer;