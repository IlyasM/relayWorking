'use strict';






















function containsRelayQueryRootCall(
thisRoot,
thatRoot)
{
if(thisRoot === thatRoot){
return true;}

if(
getCanonicalName(thisRoot.getFieldName()) !== 
getCanonicalName(thatRoot.getFieldName()))
{
return false;}

var thisIdentifyingArg=thisRoot.getIdentifyingArg();
var thatIdentifyingArg=thatRoot.getIdentifyingArg();
var thisValue=thisIdentifyingArg && thisIdentifyingArg.value || null;
var thatValue=thatIdentifyingArg && thatIdentifyingArg.value || null;
if(thisValue == null && thatValue == null){
return true;}

if(thisValue == null || thatValue == null){
return false;}

if(Array.isArray(thisValue)){
var thisArray=thisValue;
if(Array.isArray(thatValue)){
return thatValue.every(function(eachValue){return thisArray.indexOf(eachValue) >= 0;});}else 
{
return thisValue.indexOf(thatValue) >= 0;}}else 

{
if(Array.isArray(thatValue)){
return thatValue.every(function(eachValue){return eachValue === thisValue;});}else 
{
return thatValue === thisValue;}}}




var canonicalRootCalls={
'nodes':'node',
'usernames':'username'};







function getCanonicalName(name){
if(canonicalRootCalls.hasOwnProperty(name)){
return canonicalRootCalls[name];}

return name;}


module.exports = containsRelayQueryRootCall;