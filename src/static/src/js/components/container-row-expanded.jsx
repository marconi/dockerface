/** @jsx React.DOM */

var React = require('react'),
    Fluxxor = require('fluxxor'),
    FluxMixin = Fluxxor.FluxMixin(React);

var ContainerRowExpanded = React.createClass({
  mixins: [FluxMixin],

  render: function() {
    return (
      <tr>
        <td colSpan="6">
          Container details...
        </td>
      </tr>
    )
  }
});

module.exports = ContainerRowExpanded;
