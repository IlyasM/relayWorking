'use strict';
















var OPTIMISTIC_MASK=0x01;



var ERROR_MASK=0x02;

function set(status,value,mask){
status = status || 0;
if(value){
return status | mask;}else 
{
return status & ~mask;}}



function check(status,mask){
return ((status || 0) & mask) != 0;}





var RelayRecordStatusMap={
setOptimisticStatus:function(status,value){
return set(status,value,OPTIMISTIC_MASK);},


isOptimisticStatus:function(status){
return check(status,OPTIMISTIC_MASK);},


setErrorStatus:function(status,value){
return set(status,value,ERROR_MASK);},


isErrorStatus:function(status){
return check(status,ERROR_MASK);}};



module.exports = RelayRecordStatusMap;