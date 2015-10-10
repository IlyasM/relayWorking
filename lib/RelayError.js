'use strict';














var sprintf=require('fbjs/lib/sprintf');






var RelayError={
create:function(name,format){for(var _len=arguments.length,args=Array(_len > 2?_len - 2:0),_key=2;_key < _len;_key++) {args[_key - 2] = arguments[_key];}
return createError('mustfix',name,format,args);},

createWarning:function(name,format){for(var _len2=arguments.length,args=Array(_len2 > 2?_len2 - 2:0),_key2=2;_key2 < _len2;_key2++) {args[_key2 - 2] = arguments[_key2];}
return createError('warn',name,format,args);},

createForResponse:function(
errorData)





{
var error=RelayError.create(
'RelayResponseError',
'%s (%s)\n%s',
errorData.description,
errorData.code,
errorData.debug_info || '');

error.source = errorData;
return error;}};






function createError(
type,
name,
format,
args)
{

var error=new Error(sprintf.apply(undefined,[format].concat(args)));

error.name = name;
error.type = type;
error.framesToPop = 2;
return error;}


module.exports = RelayError;