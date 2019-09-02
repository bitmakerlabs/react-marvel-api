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
    // console.warn('Whoops, it looks like this method hasn\'t been implemented yet.');

    // TODO:
    // - Create the `params` object.
    const params = { ...config, ...this.getAuthConfig() };

    // - Extract the correct endpoint from `ENDPOINTS`.
    const endpoint = MarvelService.ENDPOINTS.characters;

    // - Dispatch a request using `axios.get()`.
    return axios.get(endpoint, { params: params })
      .then((response) => {
        // - Parse and return the response.
        return response.data.data;
      });
  }

  getCharacter(id, config = {}) {
    // console.warn('Whoops, it looks like this method hasn\'t been implemented yet.');

    // TODO:
    // - Create the `params` object.
    const params = { ...config, ...this.getAuthConfig() };

    // - Extract the correct endpoint from `ENDPOINTS`; add the `id`.
    const endpoint = MarvelService.ENDPOINTS.character + '/' + id;

    // - Dispatch a request using `axios.get()`.
    return axios.get(endpoint, { params: params })
      .then((response) => {
        // - Parse and return the response.
        return response.data.data;
      });
  }

  // --------------------------------------------------
  // COMICS-RELATED METHODS
  // --------------------------------------------------
  getComics(config = {}) {
    const params = { ...config, ...this.getAuthConfig() };
    const endpoint = MarvelService.ENDPOINTS.comics;
    return axios.get(endpoint, { params: params })
      .then((response) => {
        return response.data.data;
      });
  }

  getComic(id, config = {}) {
    const params = { ...config, ...this.getAuthConfig() };
    const endpoint = MarvelService.ENDPOINTS.comic + '/' + id;
    return axios.get(endpoint, { params: params })
      .then((response) => {
        return response.data.data;
      });
  }
}
