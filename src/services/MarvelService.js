import md5 from 'crypto-js/md5';

class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  _privateKey = 'f4a0f3dc13402f7a6c954a219f13c8f0d5524916';
  _apiKey = '67324afd241bb2e22ec94337fcf676da';
  _ts = new Date().valueOf();
  _hash = md5(this._ts + this._privateKey + this._apiKey);

  getResources = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${ url }, status: ${ res.status }`);
    }

    return await res.json();
  }

  getAllCharacters = async () => {
    const res = await this.getResources(`${ this._apiBase }characters?limit=9&offset=210&apikey=${ this._apiKey }&ts=${ this._ts }&hash=${ this._hash }`);
    return res.data.results.map(this._transformCharacter)
  }

  getCharacter = async (id) => {
    const res = await this.getResources(`${ this._apiBase }characters/${ id }?apikey=${ this._apiKey }`);
    return this._transformCharacter(res.data.results[0]);
  }

  _transformCharacter = (char) => {
    return {
      name: char.name,
      description: char.description,
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
    }
  }
}

export default MarvelService;