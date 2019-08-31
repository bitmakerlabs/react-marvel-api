import axios from 'axios';

// The MarvelService is responsible for communicating directly with the Marvel
// API. It exposes a series of utility methods, such as `getCharacters()` and
// `getComics()`, that simplify the process of fetching Marvel-related data,
// authenticating with the Marvel API, and parsing the corresponding responses.
export class MarvelService {

  // --------------------------------------------------
  // ENDPOINTS
  // --------------------------------------------------
  // The MarvelService maintains a dictionary of relevant endpoints, which can
  // be accessed via the `ENDPOINTS` property of the class itself.
  static get ENDPOINTS() {
    return {
      comic: 'https://gateway.marvel.com:443/v1/public/comics',
      comics: 'https://gateway.marvel.com:443/v1/public/comics',
      character: 'https://gateway.marvel.com:443/v1/public/characters',
      characters: 'https://gateway.marvel.com:443/v1/public/characters',
    };
  }

  // --------------------------------------------------
  // SETUP
  // --------------------------------------------------
  // The MarvelService expects to receive a valid Marvel API key at
  // instantiation time, which it will persist for later use.
  constructor(config) {
    this.apiKey = config.apiKey;
  }

  // --------------------------------------------------
  // AUTHENTICATION
  // --------------------------------------------------
  // This method returns an object containing an `apikey` property, which is
  // required by the Marvel API. The value of this property is set equal to the
  // `apiKey` received when the service was instantiated.
  getAuthConfig() {
    return { apikey: this.apiKey };
  }

  // --------------------------------------------------
  // CHARACTERS-RELATED METHODS
  // --------------------------------------------------
  // These methods retrieve characters-related data from the Marvel API. Each
  // method follows the same general pattern:
  // - The user-supplied `config` is combined with the internally defined 'auth
  // config' to create an object of request params.
  // - The request endpoint is extracted from the `ENDPOINTS` property, and
  // enhanced if necessary.
  // - The request is dispatched via Axios, using the `endpoint` and `params`
  // data.
  // - The respones is parsed and return in the form of a Promise.
  getCharacters(config = {}) {
    const params = { ...config, ...this.getAuthConfig() };
    const endpoint = MarvelService.ENDPOINTS.characters;

    return axios.get(endpoint, { params })
      .then((response) => response.data.data);
  }

  getCharacter(id, config = {}) {
    const params = { ...config, ...this.getAuthConfig() };
    const endpoint = `${MarvelService.ENDPOINTS.character}/${id}`;

    return axios.get(endpoint, { params })
      .then((response) => response.data.data);
  }

  // --------------------------------------------------
  // COMICS-RELATED METHODS
  // --------------------------------------------------
  // These methods  retrieve comics-related data, and are equivalent to the
  // characters-related methods above.
  getComics(config = {}) {
    const params = { ...config, ...this.getAuthConfig() };
    const endpoint = MarvelService.ENDPOINTS.comics;

    return axios.get(endpoint, { params })
      .then((response) => response.data.data);
  }

  getComic(id, config = {}) {
    const params = { ...config, ...this.getAuthConfig() };
    const endpoint = `${MarvelService.ENDPOINTS.comic}/${id}`;

    return axios.get(endpoint, { params })
      .then((response) => response.data.data);
  }
}
