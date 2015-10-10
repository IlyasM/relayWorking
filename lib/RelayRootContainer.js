var _extends=Object.assign || function(target){for(var i=1;i < arguments.length;i++) {var source=arguments[i];for(var key in source) {if(Object.prototype.hasOwnProperty.call(source,key)){target[key] = source[key];}}}return target;};function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function');}}function _inherits(subClass,superClass){if(typeof superClass !== 'function' && superClass !== null){throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__ = superClass;}












'use strict';

var GraphQLFragmentPointer=require('./GraphQLFragmentPointer');
var React=require('react-native');
var RelayDeprecated=require('./RelayDeprecated');

var RelayStore=require('./RelayStore');
var RelayStoreData=require('./RelayStoreData');
var RelayPropTypes=require('./RelayPropTypes');







var StaticContainer=require('react-static-container');

var getRelayQueries=require('./getRelayQueries');
var invariant=require('fbjs/lib/invariant');
var mapObject=require('fbjs/lib/mapObject');var 


























PropTypes=React.PropTypes;

var storeData=RelayStoreData.getDefaultInstance();var 



























































RelayRootContainer=(function(_React$Component){_inherits(RelayRootContainer,_React$Component);




function RelayRootContainer(props,context){_classCallCheck(this,RelayRootContainer);
_React$Component.call(this,props,context);
this.mounted = true;
this.state = this._runQueries(this.props);}RelayRootContainer.prototype.


getChildContext = function getChildContext(){
return {route:this.props.route};};RelayRootContainer.prototype.





_runQueries = function _runQueries(
_ref)
{var _this=this;var Component=_ref.Component;var forceFetch=_ref.forceFetch;var refetchRoute=_ref.refetchRoute;var route=_ref.route;
var querySet=getRelayQueries(Component,route);
var onReadyStateChange=function(readyState){
if(!_this.mounted){
_this._handleReadyStateChange(_extends({},readyState,{mounted:false}));
return;}var _state=

_this.state;var fragmentPointers=_state.fragmentPointers;var pendingRequest=_state.pendingRequest;
if(request !== pendingRequest){

return;}

if(readyState.aborted || readyState.done || readyState.error){
pendingRequest = null;}

if(readyState.ready && !fragmentPointers){
fragmentPointers = mapObject(
querySet,
function(query){return query?
GraphQLFragmentPointer.createForRoot(
storeData.getQueuedStore(),
query):

null;});}


_this.setState({
activeComponent:Component,
activeRoute:route,
error:readyState.error,
fragmentPointers:fragmentPointers,
pendingRequest:pendingRequest,
readyState:_extends({},readyState,{mounted:true}),
fetchState:{
done:readyState.done,
stale:readyState.stale}});};




if(typeof refetchRoute !== 'undefined'){
RelayDeprecated.warn({
was:'RelayRootContainer.refetchRoute',
now:'RelayRootContainer.forceFetch'});

forceFetch = refetchRoute;}


var request=forceFetch?
RelayStore.forceFetch(querySet,onReadyStateChange):
RelayStore.primeCache(querySet,onReadyStateChange);

return {
activeComponent:null,
activeRoute:null,
error:null,
fragmentPointers:null,
pendingRequest:request,
readyState:null,
fetchState:{
done:false,
stale:false}};};RelayRootContainer.prototype.











_shouldUpdate = function _shouldUpdate(){
return (
this.props.Component === this.state.activeComponent && 
this.props.route === this.state.activeRoute);};RelayRootContainer.prototype.








_retry = function _retry(){
!
this.state.error?process.env.NODE_ENV !== 'production'?invariant(false,
'RelayRootContainer: Can only invoke `retry` in a failure state.'):invariant(false):undefined;

this.setState(this._runQueries(this.props));};RelayRootContainer.prototype.


componentWillReceiveProps = function componentWillReceiveProps(nextProps){
if(nextProps.Component !== this.props.Component || 
nextProps.route !== this.props.route){
if(this.state.pendingRequest){
this.state.pendingRequest.abort();}

this.setState(this._runQueries(nextProps));}};RelayRootContainer.prototype.



componentDidUpdate = function componentDidUpdate(
prevProps,
prevState)
{

var readyState=this.state.readyState;
if(readyState){
if(!prevState || readyState !== prevState.readyState){
this._handleReadyStateChange(readyState);}}};RelayRootContainer.prototype.







_handleReadyStateChange = function _handleReadyStateChange(readyState){
var onReadyStateChange=this.props.onReadyStateChange;
if(onReadyStateChange){
onReadyStateChange(readyState);}};RelayRootContainer.prototype.



componentWillUnmount = function componentWillUnmount(){
if(this.state.pendingRequest){
this.state.pendingRequest.abort();}

this.mounted = false;};RelayRootContainer.prototype.


render = function render(){
var children=null;
var shouldUpdate=this._shouldUpdate();
if(shouldUpdate && this.state.error){
var renderFailure=this.props.renderFailure;
if(renderFailure){
children = renderFailure(this.state.error,this._retry.bind(this));}}else 

if(shouldUpdate && this.state.fragmentPointers){
var renderFetched=this.props.renderFetched;
if(renderFetched){
children = renderFetched(_extends({},
this.props.route.params,
this.state.fragmentPointers),
this.state.fetchState);}else 
{
var Component=this.props.Component;
children = 
React.createElement(Component,_extends({},
this.props.route.params,
this.state.fragmentPointers));}}else 


{
var renderLoading=this.props.renderLoading;
if(renderLoading){
children = renderLoading();}else 
{
children = undefined;}

if(children === undefined){
children = null;
shouldUpdate = false;}}


return (
React.createElement(StaticContainer,{shouldUpdate:shouldUpdate},
children));};return RelayRootContainer;})(React.Component);





RelayRootContainer.propTypes = {
Component:RelayPropTypes.Container,
forceFetch:PropTypes.bool,
onReadyStateChange:PropTypes.func,
renderFailure:PropTypes.func,
renderFetched:PropTypes.func,
renderLoading:PropTypes.func,
route:RelayPropTypes.QueryConfig.isRequired};


RelayRootContainer.childContextTypes = {
route:RelayPropTypes.QueryConfig.isRequired};


module.exports = RelayRootContainer;