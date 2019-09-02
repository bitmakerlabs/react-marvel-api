import React, { Component } from 'react';
import './App.css';
import { ResultsList } from './components/ResultsList';
import { ResultDetails } from './components/ResultDetails';
import { SearchBar } from './components/SearchBar';
import { Error } from './components/Error';
import { Loading } from './components/Loading';
import { MarvelService } from './services/MarvelService';

class App extends Component {
  // --------------------------------------------------
  // SETUP
  // --------------------------------------------------
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      results: [],
      selectedResult: null,
    };

    this.fetchCharacters = this.fetchCharacters.bind(this);
    this.fetchCharacter = this.fetchCharacter.bind(this);

    this.marvelService = new MarvelService({
      apiKey: this.props.apiKey,
    });
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  render() {
    const resultsElem = this.state.hasError
      ? <Error />
      : this.state.isLoading
        ? <Loading searchTerm={ this.state.searchTerm } />
        : (
          <ResultsList
            results={ this.state.results }
            searchTerm={ this.state.searchTerm }
            onResultClick={ this.fetchCharacter }
          />
        );

    const detailsElem = this.state.selectedResult
      ? (
        <ResultDetails
          image={ this.state.selectedResult.thumbnail.path +  '.' + this.state.selectedResult.thumbnail.extension }
          title={ this.state.selectedResult.name }
          description={ this.state.selectedResult.description }
          stories={ this.state.selectedResult.stories }
          urls={ this.state.selectedResult.urls }
          onClose={ () => this.setState({ selectedResult: null } )}
        />
      )
      : '';

    return (
      <section className="app">
        <SearchBar
          searchTerm={ this.state.searchTerm }
          onSubmit={ (searchTerm) => this.setState({ searchTerm }) }
        />
        { resultsElem }
        { detailsElem }
      </section>
    );
  }

  // --------------------------------------------------
  // LIFECYCLE
  // --------------------------------------------------
  componentDidUpdate(_, prevState) {
    const searchTerm = this.state.searchTerm;
    const prevSearchTerm = prevState.searchTerm;

    if (
      searchTerm
      && (searchTerm !== prevSearchTerm)
    ) {
      this.fetchCharacters();
    }
  }

  // --------------------------------------------------
  // FETCHING CHARACTERS
  // --------------------------------------------------
  fetchCharacters() {
    console.warn('Whoops, it looks like this method hasn\'t been implemented yet');
    // TODO:
    // Put the application into a loading state.
    // Invoke the `getCharacters()` method on the marvel service.
    // Pass in the current `searchTerm` as `nameStartsWith`,
    // Update the application state using the resulting data.
    // Remove the loading state.
    // Handle potential errors.
  }

  fetchCharacter(id) {
    console.warn('Whoops, it looks like this method hasn\'t been implemented yet');
    // TODO:
    // Invoke the `getCharacter()` method on the marvel service.
    // Pass in the `id`.
    // Update the application state using the resulting data.
    // Handle potential errors.
  }
}

export default App;
