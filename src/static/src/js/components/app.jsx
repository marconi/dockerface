/** @jsx React.DOM */

var React = require('react'),
    Router = require('react-router'),
    Fluxxor = require('fluxxor'),
    NotificationSystem = require('react-notification-system'),
    ContainerStoreMixin = require('../mixins'),
    FluxMixin = Fluxxor.FluxMixin(React),
    RouteHandler = Router.RouteHandler;

var App = React.createClass({
  mixins: [
    FluxMixin,
    ContainerStoreMixin
  ],

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
    return (
      <div>
        <RouteHandler />
        <NotificationSystem ref="notification" allowHTML={true} />
      </div>
    )
  }
});

module.exports = App;
