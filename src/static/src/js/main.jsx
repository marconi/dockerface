/** @jsx React.DOM */

var React = require('react'),
    Router = require('react-router'),
    Fluxxor = require('fluxxor'),
    $ = require('zepto-browserify').$,
    App = require('./components/app.jsx'),
    Containers = require('./components/containers.jsx'),
    ContainersTable = require('./components/containers-table.jsx'),
    Container = require('./components/container.jsx'),
    Stores = require('./stores/stores'),
    Actions = require('./actions'),
    Route = Router.Route,
    DefaultRoute = Router.DefaultRoute,
    Redirect = Router.Redirect;

var flux = new Fluxxor.Flux(Stores, Actions);
flux.on('dispatch', function(type, payload) {
  console.log('[Dispatch]', type, payload);
});

var routes = (
  <Route handler={App}>
    <Route name="containers" handler={Containers}>
      <Route name="container" path=":containerId" handler={Container} />
      <DefaultRoute handler={ContainersTable} />
    </Route>
    <Redirect to="containers" />
  </Route>
);

$(function() {
  Router.run(routes, function(Handler) {
    React.render(<Handler flux={flux} />, document.getElementById('app'));
  });
});
