'use strict';Object.defineProperty(exports,'__esModule',{value:true});














var GraphQL=require('./GraphQL');
var RelayFragmentReference=require('./RelayFragmentReference');
var RelayRouteFragment=require('./RelayRouteFragment');

var invariant=require('fbjs/lib/invariant');
var warning=require('fbjs/lib/warning');














function RelayQL(
strings)

{
!
false?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQL: Unexpected invocation at runtime. Either the Babel transform ' + 
'was not set up, or it failed to identify this call site. Make sure it ' + 
'is being used verbatim as `Relay.QL`.'):invariant(false):undefined;}






Object.assign(RelayQL,{
__GraphQL:GraphQL,
__frag:function(substitution){
if(typeof substitution === 'function'){

return new RelayRouteFragment(substitution);}

if(substitution != null){
!(
substitution instanceof RelayFragmentReference || 
GraphQL.isFragment(substitution))?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayQL: Invalid fragment composition, use ' + 
'`${Child.getFragment(\'name\')}`.'):invariant(false):undefined;}


return substitution;},


__var:function(substitution){
if(substitution === undefined){
process.env.NODE_ENV !== 'production'?warning(false,'RelayQL: Invalid undefined argument; use null.'):undefined;
substitution = null;}else 
if(!GraphQL.isCallVariable(substitution)){
process.env.NODE_ENV !== 'production'?warning(
false,
'RelayQL: Invalid argument `%s` supplied via template substitution. ' + 
'Instead, use an inline argument (e.g. `field(size: 32)`) or a ' + 
'variable (e.g. `field(size: $size)`).',
substitution):undefined;}


return substitution;}});



module.exports = RelayQL;