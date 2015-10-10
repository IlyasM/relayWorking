'use strict';

var ReactUpdates = require('ReactUpdates');

// Temporary shim required for Relay.
var ReactDOM = {
  unstable_batchedUpdates: ReactUpdates.batchedUpdates,
};

module.exports = ReactDOM;