function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass,superClass){if(typeof superClass !== 'function' && superClass !== null){throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__ = superClass;}












'use strict';

var Deferred=require('fbjs/lib/Deferred');





var invariant=require('fbjs/lib/invariant');
var isEmpty=require('fbjs/lib/isEmpty');
var printRelayQuery=require('./printRelayQuery');var 






RelayMutationRequest=(function(_Deferred){_inherits(RelayMutationRequest,_Deferred);




function RelayMutationRequest(
mutation,
files)
{_classCallCheck(this,RelayMutationRequest);
_Deferred.call(this);
this._mutation = mutation;
this._printedQuery = null;
this._files = files;}RelayMutationRequest.prototype.







getDebugName = function getDebugName(){
return this._mutation.getName();};RelayMutationRequest.prototype.







getFiles = function getFiles(){
return this._files;};RelayMutationRequest.prototype.








getVariables = function getVariables(){
var printedQuery=this._printedQuery;
if(!printedQuery){
printedQuery = printRelayQuery(this._mutation);
this._printedQuery = printedQuery;}

return printedQuery.variables;};RelayMutationRequest.prototype.







getQueryString = function getQueryString(){
var printedQuery=this._printedQuery;
if(!printedQuery){
printedQuery = printRelayQuery(this._mutation);
this._printedQuery = printedQuery;}

return printedQuery.text;};RelayMutationRequest.prototype.






getMutation = function getMutation(){
return this._mutation;};return RelayMutationRequest;})(Deferred);



module.exports = RelayMutationRequest;