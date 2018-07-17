import React, { Component } from 'react';

import './Square.css';

export default class Square extends Component {
  render() {
    return (
      <div className="Square" onClick={this.props.onClick}>
        <span className="Square-label">{this.props.value}</span>
      </div>
    );
  }
}
