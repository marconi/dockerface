var Fluxxor = require('fluxxor'),
    Constants = require('../constants'),
    $ = require('zepto-browserify').$,
    _ = require('underscore'),
    moment = require('moment');

var ContainerStore = Fluxxor.createStore({
  initialize: function() {
    this.containers = {};

    this.bindActions(
      Constants.container.FILTER, this.onContainerFilter,
      Constants.container.START, this.onContainerStart,
      Constants.container.STOP, this.onContainerStop
    );
  },

  onContainerFilter: function(params) {
    params = params || [];
    $.getJSON('/api/containers', params, function(data) {
      this.containers = {}; // reset containers
      $.each(data, function(index, container) {
        this.containers[container.id] = container;
      }.bind(this));
      this.emit('change');
    }.bind(this));
  },

  onContainerStart: function(containerId) {
    $.post('/api/containers/' + containerId + '/start', function(containerState, status, xhr) {
      if (xhr.status === 200) {
        status = 'Up ' + moment(containerState.state.startedat).fromNow(true);
        this.containers[containerId].status = status;
        this.emit('change');
      } else {
        console.log('something went wrong:');
        console.log(arguments);
      }
    }.bind(this));
  },

  onContainerStop: function(containerId) {
    $.post('/api/containers/' + containerId + '/stop', function(containerState, status, xhr) {
      if (xhr.status === 200) {
        status = 'Exited ('+ containerState.state.exitcode +') ' + moment(containerState.state.finishedat).fromNow();
        this.containers[containerId].status = status;
        this.emit('change');
      } else {
        console.log('something went wrong:');
        console.log(arguments);
      }
    }.bind(this));
  },

  getState: function() {
    return _.sortBy(_.values(this.containers), function(container) {
      return container.created;
    });
  }
});

module.exports = ContainerStore;
