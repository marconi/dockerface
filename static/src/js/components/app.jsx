/** @jsx React.DOM */

var React = require('react'),
    Fluxxor = require('fluxxor'),
    $ = require('zepto-browserify').$,
    Container = require('./container.jsx'),
    FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var App = React.createClass({
  mixins: [FluxMixin, StoreWatchMixin('ContainerStore')],

  getInitialState: function() {
    return {
      isShownAll: false
    };
  },

  getStateFromFlux: function() {
    var flux = this.getFlux();
    return {
      containers: flux.store('ContainerStore').getState()
    };
  },

  componentDidMount: function() {
    this.getFlux().actions.container.filter();
  },

  handleShowAll: function(e) {
    var isShownAll = !this.state.isShownAll;
    this.getFlux().actions.container.filter({all: isShownAll});
    this.setState({isShownAll: isShownAll})
  },

  render: function() {

    var rows = $.map(this.state.containers, function(container, index) {
      return <Container key={index} container={container} />
    });

    return (
      <div>
        <h5>Containers</h5>
        <label>
          <input type="checkbox" onChange={this.handleShowAll} />
          <span className="label-body">Show all</span>
        </label>
        <table className="u-full-width">
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

module.exports = App;

