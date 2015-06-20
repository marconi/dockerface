/** @jsx React.DOM */

var React = require('react'),
    Fluxxor = require('fluxxor'),
    NotificationSystem = require('react-notification-system'),
    Events = require('../events'),
    $ = require('zepto-browserify').$,
    Container = require('./container.jsx'),
    ContainerStoreMixin = require('../mixins'),
    FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

var App = React.createClass({
  mixins: [
    FluxMixin,
    StoreWatchMixin('ContainerStore'),
    ContainerStoreMixin
  ],

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

  onContainerStarted: function(containerId) {
    this.refs.notification.addNotification({
      title: 'Container Started',
      message: 'Container <strong>' + containerId + '</strong> successfully started.',
      level: 'success'
    });
  },

  onContainerStopped: function(containerId) {
    this.refs.notification.addNotification({
      title: 'Container Stopped',
      message: 'Container <strong>' + containerId + '</strong> successfully stopped.',
      level: 'success'
    });
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
        <NotificationSystem ref="notification" allowHTML={true} />
      </div>
    )
  }
});

module.exports = App;

