import React, { Component } from 'react';

export class ResultCard extends Component {
  render() {
    const additionalClasses = this.props.searchType === 'Comics'
      ? 'result-card--is-comic'
      : '';

    return (
      <button className={ 'result-card  ' + additionalClasses } onClick={ this.props.onClick }>
        <figure className="result-card__image">
          <img src={ this.props.image } alt={ this.props.title } />
        </figure>
        <div className="result-card__info">
          <h2>{ this.props.title }</h2>
        </div>
      </button>
    );
  }
}
