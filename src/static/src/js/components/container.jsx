/** @jsx React.DOM */

var React = require('react'),
    Fluxxor = require('fluxxor'),
    classNames = require('classnames'),
    moment = require('moment'),
    FluxMixin = Fluxxor.FluxMixin(React),
    sweetAlert = require('sweetalert');

var Container  = React.createClass({
  mixins: [FluxMixin],

  getInitialState: function() {
    return {
      shortId: null,
      hasExited: false,
      disabled: false,
      isStarting: false,
      isStopping: false,
      waitLabel: 'Wait...'
    };
  },

  componentWillMount: function() {
    this.setState({
      shortId: this.props.container.id.slice(0, 12),
      hasExited: (this.props.container.status.indexOf('Exited') !== -1) ? true : false
    });
  },

  componentWillReceiveProps: function(nextProps) {
    var shortId = nextProps.container.id.slice(0, 12);
    this.setState({
      shortId: shortId,
      hasExited: (nextProps.container.status.indexOf('Exited') !== -1) ? true : false,
      disabled: false
    });

    if (this.state.isStarting) {
      this.setState({isStarting: false});
      sweetAlert('Container started', 'Container ' + shortId + ' has been started.', 'success');
    } else if (this.state.isStopping) {
      this.setState({isStopping: false});
      sweetAlert('Container stopped', 'Container ' + shortId + ' has been stopped.', 'success');
    }
  },

  handleStart: function(e) {
    this._disable({isStarting: true});
    this.getFlux().actions.container.start(this.props.container.id);
  },

  handleStop: function(e) {
    this._disable({isStopping: true});
    this.getFlux().actions.container.stop(this.props.container.id);
  },

  _disable: function(moreStates) {
    moreStates = moreStates || {};
    this.setState($.extend({disabled: true}, moreStates));
  },

  render: function() {

    var statusClasses = classNames({
      'exited': this.state.hasExited
    });

    // if image is too long, strip the repo
    // and just retain image name
    var image = this.props.container.image;
    if (image.length > 20) {
      image = image.split('/')[1];
    }

    // figure out action handler and label
    var actionHandler, actionLabel;
    var actionClasses = classNames({
      'button-primary': true,
      'start': (this.state.hasExited) ? true : false,
      'stop': (this.state.hasExited) ? false : true,
      'disabled': this.state.disabled
    });
    if (this.state.hasExited) {
      actionHandler = this.handleStart;
      actionLabel = (this.state.disabled) ? this.state.waitLabel : 'Start';
    } else {
      actionHandler = this.handleStop;
      actionLabel = (this.state.disabled) ? this.state.waitLabel : 'Stop';
    }
    var action = (
      <button
        className={actionClasses}
        onClick={actionHandler}>{actionLabel}</button>
    )

    return (
      <tr>
        <td>{this.state.shortId}</td>
        <td>{image}</td>
        <td>{this.props.container.command}</td>
        <td>{moment.unix(this.props.container.created).fromNow()}</td>
        <td className={statusClasses}>{this.props.container.status}</td>
        <td>{action}</td>
      </tr>
    )
  }
});

module.exports = Container;
