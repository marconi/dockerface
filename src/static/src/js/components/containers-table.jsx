/** @jsx React.DOM */

var React = require('react'),
    Fluxxor = require('fluxxor'),
    Events = require('../events'),
    $ = require('zepto-browserify').$,
    ContainerRow = require('./container-row.jsx'),
    FluxMixin = Fluxxor.FluxMixin(React);

var ContainersTable = React.createClass({
  mixins: [FluxMixin],

  getInitialState: function() {
    return {
      isShownAll: false
    };
  },

  handleShowAll: function(e) {
    var isShownAll = !this.state.isShownAll;
    this.getFlux().actions.container.filter({all: isShownAll});
    this.setState({isShownAll: isShownAll})
  },

  render: function() {

    var rows = $.map(this.props.containers, function(container, index) {
      return <ContainerRow key={index} container={container} />
    });

    return (
      <div>
        <h5>Containers</h5>
        <label>
          <input type="checkbox" onChange={this.handleShowAll} />
          <span className="label-body">Show all</span>
        </label>
        <table id="containers" className="u-full-width">
          <thead>
            <tr>
              <th>Container ID</th>
              <th>Image</th>
              <th>Command</th>
              <th>Created</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    )
  }
});

module.exports = ContainersTable;
