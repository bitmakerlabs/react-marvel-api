import React, { Component } from 'react';

export class NoResults extends Component {
  render() {
    const msg = this.props.searchTerm
      ? 'Whoops, we couldn\'t find any results for "' + this.props.searchTerm + '". Why don\'t you try another one?'
      : 'Whoops, it looks like you haven\'t searched for anything yet. Use the search bar above to get started!';

    return (
      <div className="no-results">
        <h1>{ msg }</h1>
      </div>
    );
  }
}
