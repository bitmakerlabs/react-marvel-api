import React, { Component } from 'react';

export class LoadMore extends Component {
  render() {
    return (
      <button className="load-more" onClick={ this.props.onClick }>Load More</button>
    );
  }
}
