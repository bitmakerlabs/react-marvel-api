import React, { Component } from 'react';
import './App.css';
import { ResultsList } from './components/ResultsList';
import { ResultDetails } from './components/ResultDetails';
import { SearchBar } from './components/SearchBar';
import { Error } from './components/Error';
import { Loading } from './components/Loading';
import { LoadMore } from './components/LoadMore';
import { MarvelService } from './services/MarvelService';

class App extends Component {
  // --------------------------------------------------
  // SETUP
  // --------------------------------------------------
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      searchType: 'Characters',
      results: [],
      canLoadMore: false,
      selectedResult: null,
    };

    this.fetchCharacters = this.fetchCharacters.bind(this);
    this.fetchCharacter = this.fetchCharacter.bind(this);
    this.fetchMoreCharacters = this.fetchMoreCharacters.bind(this);

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

    const loadMoreElem = this.state.canLoadMore
      ? <LoadMore onClick={ this.fetchMoreCharacters }/>
      : '';

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
          searchType={ this.state.searchType }
          onSubmit={ (searchTerm) => this.setState({ searchTerm }) }
        />
        { resultsElem }
        { loadMoreElem }
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
    //console.warn('Whoops, it looks like this method hasn\'t been implemented yet');

    // TODO:
    // Put the application into a loading state.
    this.setState({ isLoading: true });

    // Invoke the `getCharacters()` method on the marvel service.
    // Pass in the current `searchTerm` as `nameStartsWith`,
    this.marvelService.getCharacters({
      nameStartsWith: this.state.searchTerm,
    })
      .then((data) => {
        // Update the application state using the resulting data.
        // Remove the loading state.
        this.setState({
          results: data.results,
          canLoadMore: data.total > data.offset + data.count,
          isLoading: false,
        });
      })
      .catch((err) => {
        // Handle potential errors.
        console.error(err);
        this.setState({ hasError: true });
      });
  }

  fetchCharacter(id) {
    // console.warn('Whoops, it looks like this method hasn\'t been implemented yet');

    // TODO:
    // Invoke the `getCharacter()` method on the marvel service.
    // Pass in the `id`.
    this.marvelService.getCharacter(id)
      .then((data) => {
        // Update the application state using the resulting data.
        this.setState({ selectedResult: data.results[0] });
      })
      .catch((err) => {
        // Handle potential errors.
        console.error(err);
        this.setState({ hasError: true });
      });
  }

  fetchMoreCharacters() {
    this.marvelService.getCharacters({
      nameStartsWith: this.state.searchTerm,
      offset: this.state.results.length,
    })
      .then((data) => {
        this.setState({
          results: [...this.state.results, ...data.results],
          canLoadMore: data.total > data.offset + data.count,
        });
      })
      .catch((err) => {
        // Handle potential errors.
        console.error(err);
        this.setState({ hasError: true });
      });
  }
}

export default App;
