var Constants = require('./constants');

var Actions = {
  container: {
    filter: function(params) {
      this.dispatch(Constants.container.FILTER, params);
    },

    start: function(containerId) {
      this.dispatch(Constants.container.START, containerId);
    },

    stop: function(containerId) {
      this.dispatch(Constants.container.STOP, containerId);
    },

    inspect: function(containerId) {
      this.dispatch(Constants.container.INSPECT, containerId);
    }
  }
};

module.exports = Actions;
