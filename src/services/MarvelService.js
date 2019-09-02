import axios from 'axios';

export class MarvelService {

  // --------------------------------------------------
  // ENDPOINTS
  // --------------------------------------------------
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
  constructor(config) {
    this.apiKey = config.apiKey;
  }

  // --------------------------------------------------
  // AUTHENTICATION
  // --------------------------------------------------
  getAuthConfig() {
    return { apikey: this.apiKey };
  }

  // --------------------------------------------------
  // CHARACTERS-RELATED METHODS
  // --------------------------------------------------
  getCharacters(config = {}) {
    console.warn('Whoops, it looks like this method hasn\'t been implemented yet.');
    // TODO:
    // - Create the `params` object.
    // - Extract the correct endpoint from `ENDPOINTS`.
    // - Dispatch a request using `axios.get()`.
    // - Parse and return the response.
  }

  getCharacter(id, config = {}) {
    console.warn('Whoops, it looks like this method hasn\'t been implemented yet.');
    // TODO:
    // - Create the `params` object.
    // - Extract the correct endpoint from `ENDPOINTS`; add the `id`.
    // - Dispatch a request using `axios.get()`.
    // - Parse and return the response.
  }
}
