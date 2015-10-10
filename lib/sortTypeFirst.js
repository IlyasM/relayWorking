'use strict';














var TYPE='__type__';

function sortTypeFirst(a,b){
if(a === b){
return 0;}

if(a === TYPE){
return -1;}

if(b === TYPE){
return 1;}

if(a < b){
return -1;}


return 1;}


module.exports = sortTypeFirst;