var Events = require('./events');

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

module.exports = ContainerStoreMixin;
