function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}












'use strict';var 




















RelayRouteFragment=(function(){


function RelayRouteFragment(builder){_classCallCheck(this,RelayRouteFragment);
this._builder = builder;}RelayRouteFragment.prototype.





getFragmentForRoute = function getFragmentForRoute(
route)
{
return this._builder(route);};return RelayRouteFragment;})();



module.exports = RelayRouteFragment;