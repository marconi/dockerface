/** @jsx React.DOM */

var React = require('react'),
    Router = require('react-router'),
    Fluxxor = require('fluxxor'),
    FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin,
    RouteHandler = Router.RouteHandler;

var Containers = React.createClass({
  mixins: [
    FluxMixin,
    StoreWatchMixin('ContainerStore')
  ],

  componentDidMount: function() {
    this.getFlux().actions.container.filter();
  },

  getStateFromFlux: function() {
    return {
      containers: this.getFlux().store('ContainerStore').getState()
    };
  },

  render: function() {
    return (
      <div>
        <RouteHandler containers={this.state.containers} />
      </div>
    )
  }
});

module.exports = Containers;
