/** @jsx React.DOM */

var React = require('react'),
    Router = require('react-router'),
    Fluxxor = require('fluxxor'),
    classNames = require('classnames'),
    moment = require('moment'),
    FluxMixin = Fluxxor.FluxMixin(React);

var ContainerRow  = React.createClass({
  mixins: [FluxMixin],

  getInitialState: function() {
    return {
      hasExited: this._hasExited(this.props.container),
      disabled: false,
      isStarting: false,
      isStopping: false,
      isExpanded: false,
      waitLabel: 'Wait...',
      createdHuman: moment.unix(this.props.container.Created).fromNow()
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      hasExited: this._hasExited(nextProps.container),
      createdHuman: moment.unix(nextProps.container.Created).fromNow(),
      disabled: false
    });

    if (this.state.isStarting) {
      this.setState({isStarting: false});
    } else if (this.state.isStopping) {
      this.setState({isStopping: false});
    }
  },

  handleStart: function(e) {
    this._disable({isStarting: true});
    this.getFlux().actions.container.start(this.props.container.ShortId);
  },

  handleStop: function(e) {
    this._disable({isStopping: true});
    this.getFlux().actions.container.stop(this.props.container.ShortId);
  },

  handleToggleExpanded: function(e) {
    var isExpanded = !this.state.isExpanded;
    this.setState({isExpanded: isExpanded});
    this.props.toggleExpanded(this.props.container.ShortId);
  },

  _disable: function(moreStates) {
    moreStates = moreStates || {};
    this.setState($.extend({disabled: true}, moreStates));
  },

  _hasExited: function(container) {
    return (container.Status.indexOf('Exited') !== -1) ? true : false
  },

  render: function() {

    var statusClasses = classNames({
      'exited': this.state.hasExited
    });

    var rowClasses = classNames({
      'expanded': this.state.isExpanded
    });

    // if image is too long, strip the repo
    // and just retain image name
    var image = this.props.container.Image;
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

    return (
      <tr className={rowClasses}>
        <td>
          <a href="#" onClick={this.handleToggleExpanded}>
            {this.props.container.ShortId}
          </a>
        </td>
        <td>{image}</td>
        <td>{this.props.container.Command}</td>
        <td>{this.state.createdHuman}</td>
        <td className={statusClasses}>{this.props.container.Status}</td>
        <td className="action">
          <button
            className={actionClasses}
            onClick={actionHandler}>{actionLabel}</button>
        </td>
      </tr>
    )
  }
});

module.exports = ContainerRow;
