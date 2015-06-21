/** @jsx React.DOM */

var React = require('react'),
    Fluxxor = require('fluxxor'),
    Events = require('../events'),
    _ = require('underscore'),
    ContainerRow = require('./container-row.jsx'),
    ContainerRowExpanded = require('./container-row-expanded.jsx'),
    FluxMixin = Fluxxor.FluxMixin(React);

var ContainersTable = React.createClass({
  mixins: [FluxMixin],

  getInitialState: function() {
    return {
      isShownAll: false,
      expanded: {}
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var expanded = this.state.expanded;
    _.each(nextProps.containers, function(container) {
      if (expanded[container.ShortId] === undefined) {
        expanded[container.ShortId] = false;
      }
    });
    this.setState({expanded: expanded});
  },

  toggleExpanded: function(containerId) {
    var expanded = this.state.expanded;
    expanded[containerId] = !expanded[containerId];
    this.setState({expanded: expanded});
  },

  handleShowAll: function(e) {
    var isShownAll = !this.state.isShownAll;
    this.getFlux().actions.container.filter({all: isShownAll});
    this.setState({isShownAll: isShownAll})
  },

  render: function() {

    var rows = _.map(this.props.containers, function(container, index) {
      var containerRows = [
        <ContainerRow
          key={'row-' + index}
          container={container}
          toggleExpanded={this.toggleExpanded} />
      ];

      if (this.state.expanded[container.ShortId]) {
        containerRows.push(
          <ContainerRowExpanded
            key={'row-expanded-' + index}
            container={container} />
        )
      }

      return containerRows;
    }.bind(this));

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
