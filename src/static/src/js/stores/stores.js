var Fluxxor = require('fluxxor'),
    ContainerStore = require('./container');

// specialized store specifically for events pubsub on components
var ComponentEventHub = Fluxxor.createStore({});

var Stores = {
  ContainerStore: new ContainerStore(),
  ComponentEventHub: new ComponentEventHub()
};

module.exports = Stores;
