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
  // Within our constructor, we:
  // - Set up the initial state of the application.
  // - Bind the App methods so that they can be used in child components.
  // - Instantiate the `MarvelService`.
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      searchType: 'Characters',
      results: [],
      selectedResult: null,
    };

    this.fetchCharacters = this.fetchCharacters.bind(this);
    this.fetchMoreCharacters = this.fetchMoreCharacters.bind(this);
    this.fetchCharacter = this.fetchCharacter.bind(this);

    this.fetchComics = this.fetchComics.bind(this);
    this.fetchMoreComics = this.fetchMoreComics.bind(this);
    this.fetchComic = this.fetchComic.bind(this);

    this.marvelService = new MarvelService({
      apiKey: this.props.apiKey,
    });
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  // Within this application, the `render()` method does the following:
  // - Determines whether to show an error message.
  // - Determines whether to show a loading message.
  // - Determines whether to show a list of search results.
  // - Determines whether to show a 'load more' prompt.
  // - Determines whether to show a 'modal' contains search result details.
  render() {
    // First we determine whether to display an error, a loading message, or a
    // list of results.
    //
    // If the application state includes the `hasError` property, then we assign
    // the <Error /> element to our `resultsElem` variable.
    //
    // Alternatively, If the application state includes the `isLoading`
    // property, then we assign the <Loading /> element to our `resultsElem`
    // variable.
    //
    // Finally, if the state *does not* contain either `hasError` or `isLoading`
    // then we assign the <ResultsList /> element to our `resultsElem` variable,
    // passing in all of the result data, search data, and a callback.
    const resultsElem = this.state.hasError
      ? <Error />
      : this.state.isLoading
        ? <Loading searchTerm={ this.state.searchTerm } />
        : (
          <ResultsList
            results={ this.state.results }
            searchTerm={ this.state.searchTerm }
            searchType={ this.state.searchType }
            onResultClick={ this.state.searchType === 'Characters' ? this.fetchCharacter : this.fetchComic }
          />
        );

    // After we've determined whether or not to display a list of results, we
    // move on to the 'load more' prompt. When present, this prompt allows users
    // to search for additional results using the same search term and search
    // type.
    //
    // We only display the 'load more' prompt if *all* of the following are
    // true:
    // - The `canLoadMore` property is true.
    // - The application is not in an error state.
    // - The application is not in a loading state (eg. currently searching).
    // - The application is not in a 'loading more' state.
    const loadMoreElem = (
      this.state.canLoadMore
      && !this.state.hasError
      && !this.state.isLoading
      && !this.state.isLoadingMore
    )
      ? <LoadMore onClick={ this.state.searchType === 'Characters' ? this.fetchMoreCharacters : this.fetchMoreComics } />
      : '';

    // Now we determine whether or not to display the 'details' element. This
    // element display additional information about a specific search result,
    // and is displayed when the user clicks on a 'result card' element.
    //
    // If the application state contains a `selectedResult` property, then we
    // assign the <ResultDetails /> element to our `detailsElem` variable. We
    // also pass in all the information that this element requires, including:
    // - The result image, title, and description.
    // - The stories in which this result appears.
    // - A list of supplementary URLs.
    // - A callback that allows the user to dismiss the element.
    const detailsElem = this.state.selectedResult
      ? (
        <ResultDetails
          image={ this.state.selectedResult.thumbnail.path +  '.' + this.state.selectedResult.thumbnail.extension }
          title={ this.state.searchType === 'Characters' ? this.state.selectedResult.name : this.state.selectedResult.title }
          description={ this.state.selectedResult.description }
          stories={ this.state.selectedResult.stories }
          urls={ this.state.selectedResult.urls }
          onClose={ () => this.setState({ selectedResult: null } )}
        />
      )
      : '';


    // Finally, we render our application. The markup representation of the App
    // component is made up of the elements defined above, as well as the
    // <SearchBar /> component (which is always present).
    return (
      <section className="app">
        <SearchBar
          searchTerm={ this.state.searchTerm }
          searchType={ this.state.searchType }
          onSubmit={ (searchTerm) => this.setState({ searchTerm }) }
          onSelect={ (searchType) => this.setState({ searchType }) }
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
  // Our App component includes the `componentDidUpdate()` lifecycle method,
  // which is responsible for fetching new character and comic data when the
  // application state changes.
  //
  // Since it's possible to create an infinite loop of update-fetch-update, we
  // want to be very careful about *when* we fetch new data. In this case,  In
  // this case, we only fetch new character or comic when:
  // - The `searchTerm` is not an empty string.
  // - The current search term does not match the previous search term.
  // - Or the current search type does not match the previous search type.
  //
  // This means that we'll fetch new data whenever the user supplies a new
  // search term, or when the user changes the search type (eg. from
  // 'Characters' to 'Comics').
  componentDidUpdate(_, prevState) {
    const searchTerm = this.state.searchTerm;
    const searchType = this.state.searchType;
    const prevSearchTerm = prevState.searchTerm;
    const prevSearchType = prevState.searchType;

    if (
      searchTerm
      && (searchTerm !== prevSearchTerm || searchType !== prevSearchType)
    ) {
      return searchType  === 'Characters'
        ? this.fetchCharacters()
        : this.fetchComics();
    }
  }

  // --------------------------------------------------
  // FETCHING CHARACTERS
  // --------------------------------------------------
  // Here we define a series of methods that are responsble for fetching
  // character-related data.
  //
  // The first method fetches character data using the current search term.
  // Before it does so, this method updates the application, setting `isLoading`
  // to true, and `hasError` to false. This ensures that the user is shown the
  // correct UI while the request is in-flight.
  //
  // After the application state has been updated, this method uses the
  // `marvelService` to retrieve character-related data. If the request is
  // successful, the results are extracted and applied to the application state.
  // Additionally, the `isLoading` property is reset to false, and a new value
  // for `canLoadMore` is computed.
  //
  // If the request fails, the error message is printed to the console and the
  // `hasError` property of the application state is set to true.
  fetchCharacters() {
    this.setState({ isLoading: true, hasError: false });

    return this.marvelService.getCharacters({ nameStartsWith: this.state.searchTerm })
      .then((data) => this.setState({
        results: data.results,
        isLoading: false,
        canLoadMore: data.total > (data.offset + data.count),
      }))
      .catch((err) => {
        console.error(err);
        this.setState({ isLoading: false, hasError: true });
      });
  }

  // `fetchMoreCharacters()` is similar to `fetchCharacters()`, although it is
  // *only* responsible for fetching additional results for the existing search
  // term. Both methods make use of the `marvelService`, but
  // `fetchMoreCharacters()` passes in an 'offset' value. This value is passed
  // to the underlying Marvel API, which excludes an equal number of items from
  // the response.
  //
  // For example, the initial request for character data will have an offset of
  // 0, meaning that the Marvel API will exclude 0 items from the response.
  // If this response includes 20 items, then the subsequent request will have
  // an offset value of 20. The response for the second request will exclude
  // the first 20 results, which means that there will not be an overlap between
  // the items returned by the first and second responses.
  fetchMoreCharacters() {
    this.setState({ isLoadingMore: true });

    return this.marvelService.getCharacters({
      nameStartsWith: this.state.searchTerm,
      offset: this.state.results.length
    })
      .then((data) => this.setState({
        results: [...this.state.results, ...data.results],
        isLoadingMore: false,
        canLoadMore: data.total > (data.offset + data.count),
      }))
      .catch((err) => {
        console.error(err);
        this.setState({ isLoadingMore: false, hasError: true });
      });
  }

  // Finally, `fetchCharacter()` is used to request information about a specific
  // character. Like `fetchCharacters()` and `fetchMoreCharacters()`, this
  // method also makes use of the `marvelService`, which talks to the underlying
  // Marvel API.
  //
  // Since we're interested in a specific character, we provide the ID of that
  // character. If the request is successful, we update the `selectedResult`
  // property of the application state, which will case hte 'details' element to
  // be displayed as part of the subsequent render.
  //
  // If the request is unsuccessful, we print the error message to the console.
  fetchCharacter(id) {
    return this.marvelService.getCharacter(id)
      .then((data) => this.setState({ selectedResult: data.results[0] }))
      .catch((err) => console.error(err));
  }

  // --------------------------------------------------
  // FETCHING COMICS
  // --------------------------------------------------
  // Here we define a series of methods that are responsble for fetching
  // comic-related data.
  //
  // These methods serve the same purpose as the character-related methods
  // above.
  // - `fetchComics()` retrieves comic data using the current search term.
  // - `fetchMoreComics()` retrieves 'more' comic data, accounting for offsets.
  // - `fetchComic()` retrieve data about a specific comic by ID.
  //
  // Each method also makes use of the `marvelService`, and updates the
  // `isLoading`, `isLoadingMore`, and `hasError` properties as necessary.
  fetchComics() {
    this.setState({ isLoading: true, hasError: false });

    this.marvelService.getComics({ titleStartsWith: this.state.searchTerm })
      .then((data) => this.setState({
        results: data.results,
        isLoading: false,
        canLoadMore: data.total > (data.offset + data.count),
      }))
      .catch((err) => {
        console.error(err);
        this.setState({ isLoading: false, hasError: true });
      });
  }

  fetchMoreComics() {
    this.setState({ isLoadingMore: true });

    return this.marvelService.getComics({
      titleStartsWith: this.state.searchTerm,
      offset: this.state.results.length,
    })
      .then((data) => this.setState({
        results: [...this.state.results, ...data.results],
        isLoadingMore: false,
        canLoadMore: data.total > (data.offset + data.count),
      }))
      .catch((err) => {
        console.error(err);
        this.setState({ isLoading: false, hasError: true });
      });
  }

  fetchComic(id) {
    return this.marvelService.getComic(id)
      .then((data) => this.setState({ selectedResult: data.results[0] }))
      .catch((err) => console.error(err));
  }
}

export default App;
