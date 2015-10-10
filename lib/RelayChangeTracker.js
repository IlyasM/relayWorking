Object.defineProperty(exports,'__esModule',{value:true});function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}












'use strict';var 
















RelayChangeTracker=(function(){



function RelayChangeTracker(){_classCallCheck(this,RelayChangeTracker);
this._created = {};
this._updated = {};}RelayChangeTracker.prototype.





createID = function createID(recordID){
this._created[recordID] = true;};RelayChangeTracker.prototype.





updateID = function updateID(recordID){
if(!this._created.hasOwnProperty(recordID)){
this._updated[recordID] = true;}};RelayChangeTracker.prototype.






hasChange = function hasChange(recordID){
return !!(this._updated[recordID] || this._created[recordID]);};RelayChangeTracker.prototype.





isNewRecord = function isNewRecord(recordID){
return !!this._created[recordID];};RelayChangeTracker.prototype.





getChangeSet = function getChangeSet(){
if(process.env.NODE_ENV !== 'production'){
return {
created:Object.freeze(this._created),
updated:Object.freeze(this._updated)};}


return {
created:this._created,
updated:this._updated};};return RelayChangeTracker;})();




module.exports = RelayChangeTracker;