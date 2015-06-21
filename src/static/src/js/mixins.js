var Events = require('./events');

var ComponentEventMixin = {
  subscriptions: {},

  componentWillUnmount: function() {
    // auto remove all subscriptions of current component
    $.each(this.subscriptions, function(eventName, handler) {
      this.unsubscribe(eventName, handler);
    }.bind(this));
  },

  subscribe: function(eventName, handler) {
    this.getFlux()
      .store('ComponentEventHub')
      .on(eventName, handler);
    this.subscriptions[eventName] = handler;
  },

  unsubscribe: function(eventName, handler) {
    this.getFlux()
      .store('ComponentEventHub')
      .removeListener(eventName, handler);
  },

  dispatch: function(eventName, params) {
    this.getFlux()
      .store('ComponentEventHub')
      .emit(eventName, params);
  }
};

var ContainerStoreMixin = {
  componentDidMount: function() {
    this.getFlux()
      .store('ContainerStore')
      .on(Events.container.STARTED, this.onContainerStarted)
      .on(Events.container.STOPPED, this.onContainerStopped);
  },

  componentWillUnmount: function() {
    this.getFlux()
      .store('ContainerStore')
      .removeListener(Events.container.STARTED, this.onContainerStarted)
      .removeListener(Events.container.STOPPED, this.onContainerStopped);
  }
};

exports.ContainerStoreMixin = ContainerStoreMixin;
exports.ComponentEventMixin = ComponentEventMixin;
