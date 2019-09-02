import React, { Component } from 'react';
import { SearchTypeControls } from './SearchTypeControls';

export class SearchBar extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      searchTerm: props.searchTerm,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <form className="search-bar" onSubmit={ this.handleSubmit }>
        <input
          className="search-bar__field"
          type="text"
          value={ this.state.searchTerm }
          placeholder="Heroes search (eg. Spider-Man)"
          onChange={ (e) => this.setState({ searchTerm: e.target.value })}
        />
        <SearchTypeControls
          searchType={ this.props.searchType }
          onCharactersClick={ () => this.props.onSelect('Characters') }
          onComicsClick={ () => this.props.onSelect('Comics') }
        />
        <button className="search-bar__submit" type="submit">Search</button>
      </form>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onSubmit(this.state.searchTerm);
  }
}
