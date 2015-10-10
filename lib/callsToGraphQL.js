'use strict';















var GraphQL=require('./GraphQL');






function callsToGraphQL(calls){
return calls.map(function(_ref){var name=_ref.name;var value=_ref.value;return new GraphQL.Callv(name,value);});}


module.exports = callsToGraphQL;