var Fluxxor = require('fluxxor'),
    Constants = require('../constants');

var ContainerStore = Fluxxor.createStore({
  initialize: function() {
    this.containers = [];

    this.bindActions(
      Constants.container.FILTER, this.onContainerFilter,
      Constants.container.START, this.onContainerStart,
      Constants.container.STOP, this.onContainerStop
    );
  },

  onContainerFilter: function(params) {
    params = params || [];
    $.getJSON('/api/containers', params, function(data) {
      this.containers = data || [];
      this.emit('change');
    }.bind(this));
  },

  onContainerStart: function(containerId) {
    $.post('/api/containers/' + containerId + '/start', function(startedContainer, status, xhr) {
      if (xhr.status === 200) {
        this._getContainer(containerId, function(storedContainer, index) {
          this.containers[index] = startedContainer;
          this.emit('change');
        }.bind(this));
      } else {
        console.log('something went wrong:');
        console.log(arguments);
      }
    }.bind(this));
  },

  onContainerStop: function(containerId) {
    $.post('/api/containers/' + containerId + '/stop', function(stoppedContainer, status, xhr) {
      if (xhr.status === 200) {
        this._getContainer(containerId, function(storedContainer, index) {
          this.containers[index] = stoppedContainer;
          this.emit('change');
        }.bind(this));
      } else {
        console.log('something went wrong:');
        console.log(arguments);
      }
    }.bind(this));
  },

  getState: function() {
    return this.containers;
  },

  _getContainer: function(containerId, callback) {
    $.each(this.containers, function(index, container) {
      if (container.id === containerId) {
        callback(container, index);
        return false;
      }
    });
  }
});

module.exports = ContainerStore;
