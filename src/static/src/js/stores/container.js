var Fluxxor = require('fluxxor'),
    Constants = require('../constants'),
    Events = require('../events'),
    $ = require('zepto-browserify').$,
    _ = require('underscore'),
    moment = require('moment');

var ContainerStore = Fluxxor.createStore({
  initialize: function() {
    this.containers = {};

    this.bindActions(
      Constants.container.FILTER, this.onContainerFilter,
      Constants.container.START, this.onContainerStart,
      Constants.container.STOP, this.onContainerStop,
      Constants.container.INSPECT, this.onContainerInspect
    );
  },

  onContainerFilter: function(params) {
    params = params || [];
    $.getJSON('/api/containers', params, function(data) {
      this.containers = {}; // reset containers
      _.each(data, function(container, index) {
        container.ShortId = this._computeShortId(container);
        this.containers[container.ShortId] = container;
      }.bind(this));
      this.emit('change');
    }.bind(this));
  },

  onContainerStart: function(containerId) {
    $.post('/api/containers/' + containerId + '/start', function(containerState, status, xhr) {
      if (xhr.status === 200) {
        this.containers[containerId].Status = 'Up ' + moment(containerState.StartedAt).fromNow(true);
        this.emit('change');
        this.emit(Events.container.STARTED, containerId);
      } else {
        console.log('something went wrong:');
        console.log(arguments);
      }
    }.bind(this));
  },

  onContainerStop: function(containerId) {
    $.post('/api/containers/' + containerId + '/stop', function(containerState, status, xhr) {
      if (xhr.status === 200) {
        this.containers[containerId].Status = 'Exited (0) ' + moment(containerState.FinishedAt).fromNow();
        this.emit('change');
        this.emit(Events.container.STOPPED, containerId);
      } else {
        console.log('something went wrong:');
        console.log(arguments);
      }
    }.bind(this));
  },

  onContainerInspect: function(containerId) {
    $.getJSON('/api/containers/' + containerId, [], function(container) {
      container.ShortId = this._computeShortId(container);
      this.emit(Events.container.INSPECTED, container);
    }.bind(this));
  },

  getState: function() {
    return _.sortBy(_.values(this.containers), function(container) {
      return container.Created;
    }).reverse();
  },

  _computeShortId: function(container) {
    return container.Id.slice(0, 12);
  }
});

module.exports = ContainerStore;
