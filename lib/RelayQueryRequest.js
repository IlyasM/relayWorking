function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass,superClass){if(typeof superClass !== 'function' && superClass !== null){throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__ = superClass;}












'use strict';

var Deferred=require('fbjs/lib/Deferred');




var printRelayQuery=require('./printRelayQuery');var 






RelayQueryRequest=(function(_Deferred){_inherits(RelayQueryRequest,_Deferred);



function RelayQueryRequest(query){_classCallCheck(this,RelayQueryRequest);
_Deferred.call(this);
this._printedQuery = null;
this._query = query;}RelayQueryRequest.prototype.







getDebugName = function getDebugName(){
return this._query.getName();};RelayQueryRequest.prototype.









getID = function getID(){
return this._query.getID();};RelayQueryRequest.prototype.








getVariables = function getVariables(){
var printedQuery=this._printedQuery;
if(!printedQuery){
printedQuery = printRelayQuery(this._query);
this._printedQuery = printedQuery;}

return printedQuery.variables;};RelayQueryRequest.prototype.







getQueryString = function getQueryString(){
var printedQuery=this._printedQuery;
if(!printedQuery){
printedQuery = printRelayQuery(this._query);
this._printedQuery = printedQuery;}

return printedQuery.text;};RelayQueryRequest.prototype.






getQuery = function getQuery(){
return this._query;};return RelayQueryRequest;})(Deferred);



module.exports = RelayQueryRequest;