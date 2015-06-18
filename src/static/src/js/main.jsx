/** @jsx React.DOM */

var React = require('react'),
    Fluxxor = require('fluxxor'),
    $ = require('zepto-browserify').$,
    App = require('./components/app.jsx'),
    Stores = require('./stores/stores'),
    Actions = require('./actions');

var flux = new Fluxxor.Flux(Stores, Actions);
flux.on('dispatch', function(type, payload) {
  if (console && console.log) {
    console.log('[Dispatch]', type, payload);
  }
});

$(function() {
  React.render(<App flux={flux} />, document.getElementById('app'));
})
