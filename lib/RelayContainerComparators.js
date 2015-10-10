'use strict';




















function compareObjects(
isEqual,
objectA,
objectB,
filter)
{
var key;


for(key in objectA) {
if(filter && !filter.hasOwnProperty(key)){
continue;}


if(objectA.hasOwnProperty(key) && (
!objectB.hasOwnProperty(key) || 
!isEqual(objectA[key],objectB[key],key))){
return false;}}



for(key in objectB) {
if(filter && !filter.hasOwnProperty(key)){
continue;}


if(objectB.hasOwnProperty(key) && !objectA.hasOwnProperty(key)){
return false;}}


return true;}


function isScalarAndEqual(valueA,valueB){
return valueA === valueB && (valueA === null || typeof valueA !== 'object');}


function isQueryDataEqual(
fragmentPointers,
currProp,
nextProp,
propName)
{
return (

fragmentPointers[propName] && currProp === nextProp || 

isScalarAndEqual(currProp,nextProp));}



function isNonQueryPropEqual(
fragments,
currProp,
nextProp,
propName)
{
return (

fragments.hasOwnProperty(propName) || 

isScalarAndEqual(currProp,nextProp));}







var RelayContainerComparators={
areQueryResultsEqual:function(
fragmentPointers,
prevQueryData,
nextQueryData)
{
return compareObjects(
isQueryDataEqual.bind(null,fragmentPointers),
prevQueryData,
nextQueryData);},



areNonQueryPropsEqual:function(
fragments,
props,
nextProps)
{
return compareObjects(
isNonQueryPropEqual.bind(null,fragments),
props,
nextProps);},



areQueryVariablesEqual:function(
variables,
nextVariables)
{
return compareObjects(isScalarAndEqual,variables,nextVariables);}};



module.exports = RelayContainerComparators;