/** @jsx React.DOM */

var React = require('react'),
    Fluxxor = require('fluxxor'),
    Mixins = require('../mixins'),
    _ = require('underscore'),
    Events = require('../events'),
    FluxMixin = Fluxxor.FluxMixin(React),
    ContainerStoreMixin = Mixins.ContainerStoreMixin;

var ContainerRowExpanded = React.createClass({
  mixins: [
    FluxMixin,
    ContainerStoreMixin
  ],

  getInitialState: function() {
    return {
      isLoading: false,
      container: null
    }
  },

  componentDidMount: function() {
    var flux = this.getFlux();
    flux.store('ContainerStore')
      .on(
        Events.container.INSPECTED,
        this.onContainerInspected
      );

    this.setState({isLoading: true});
    flux.actions.container.inspect(this.props.container.ShortId);
  },

  componentWillUnmount: function() {
    var flux = this.getFlux();
    flux.store('ContainerStore')
      .removeListener(
        Events.container.INSPECTED,
        this.onContainerInspected
      );
  },

  onContainerInspected: function(container) {
    if (container.ShortId === this.props.container.ShortId) {
      this.setState({
        container: container,
        isLoading: false
      });
    }
  },

  render: function() {

    var details;
    if (!this.state.isLoading && this.state.container) {
      var container = this.state.container;
      var ports = [];
      if (container.NetworkSettings.Ports) {
        _.each(container.NetworkSettings.Ports, function(hostBindings, containerPort) {
          if (hostBindings) {
            _.each(hostBindings, function(binding, index) {
              ports.push(
                <li key={index}>{binding.HostIP + ':' + binding.HostPort + ' -> ' + containerPort}</li>
              );
            });
          }
        });
      }

      var volumes = [];
      if (container.Volumes) {
        _.each(container.Volumes, function(hostMountPoint, containerMountPoint) {
          var sep = (container.VolumesRW[containerMountPoint]) ? '<->' : '->';
          volumes.push(
            <li key={containerMountPoint}>
              {containerMountPoint + ' ' + sep + ' ' + hostMountPoint}
            </li>
          );
        });
      }

      var envs = [];
      if (container.Config.Env) {
        _.each(container.Config.Env, function(env, index) {
          var tmp = env.split('=');
          envs.push(
            <li key={index}>
              <strong>{tmp[0]}</strong>
              <div>{tmp[1]}</div>
            </li>
          );
        });
      }

      details = (
        <div className="row">
          <div className="four columns">
            <div className="row">
              <div className="twelve columns">
                <h6>Port Bindings</h6>
                <ul>
                  {ports}
                </ul>
              </div>
            </div>

            <div className="row">
              <div className="twelve columns">
                <h6>IP Address</h6>
                <ul>
                  <li>{this.state.container.NetworkSettings.IPAddress}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="eight columns">
            <div className="row">
              <div className="twelve columns">
                <h6>Volumes</h6>
                <ul>
                  {volumes}
                </ul>
              </div>
            </div>

            <div className="row">
              <div className="twelve columns">
                <h6>Environment Variables</h6>
                <ul>
                  {envs}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      details = <p className="wait">Inspecting container...</p>
    }

    var tail;
    if (!this.state.isLoading) {
      tail = <a href="#">Tail Container &raquo;</a>
    }

    return (
      <tr className="details">
        <td colSpan="6">
          {details}
          {tail}
        </td>
      </tr>
    )
  }
});

module.exports = ContainerRowExpanded;
