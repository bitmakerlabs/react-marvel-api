import React, { Component } from 'react';

export class ResultDetails extends Component {
  render() {
    return (
      <article className="result-details">
        <div className="result-details__backdrop"></div>
        <div className="result-details__info">
          <div className="result-details__info__header">
            <figure>
              <img src={ this.props.image } alt={ this.props.title } />
            </figure>
          </div>
          <div className="result-details__info__body">
            <div className="result-details__info__body__content">
              <h1>{ this.props.title }</h1>
              <p><strong>Appears In: { this.props.stories.available || 0 } stories</strong></p>
              <p>{ this.props.description }</p>
              <p><strong>Links:</strong></p>
              <ul>
                { this.props.urls.map(({ url, type }, i) => <li key={ i }><a href={ url } target="_blank" rel="noopener noreferrer">{ type }</a></li>) }
              </ul>
            </div>
            <button onClick={ this.props.onClose }></button>
          </div>
        </div>
      </article>
    );
  }
}
