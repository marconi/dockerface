/** @jsx React.DOM */

var React = require('react'),
    Fluxxor = require('fluxxor'),
    FluxMixin = Fluxxor.FluxMixin(React);

var Container = React.createClass({
  mixins: [FluxMixin],

  render: function() {
    return (
      <div>
        Container {this.props.params.containerId}
      </div>
    )
  }
});

module.exports = Container;
