import React, { Component } from 'react';

export class Loading extends Component {
  render() {
    return (
      <div className="loading">
        <h1>{ 'Loading results for "' + this.props.searchTerm + '".' }</h1>
      </div>
    );
  }
}
