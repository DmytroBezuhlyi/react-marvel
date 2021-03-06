import { Component } from "react";
import Spinner from "../spinner/Spinner";
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
  state = {
    char: {},
    loading: true,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChar();
  }

  onCharLoaded = (char) => {
    this.setState({
      char,
      loading: false,
      error: false,
    });
  };

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    })
  };

  updateChar = () => {
    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
    this.marvelService
      .getCharacter(id)
      .then(this.onCharLoaded)
      .catch(this.onError);
  };

  onTryIt = async () => {
    this.setState({ loading: true, error: false });
    await this.updateChar();
  }

  render() {
    const { char, loading, error } = this.state;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? <View char={ char } /> : null;

    return (
      <div className="randomchar">
        { errorMessage }
        { spinner }
        { content }
        <div className="randomchar__static">
          <p className="randomchar__title">
            Random character for today!<br />
            Do you want to get to know him better?
          </p>
          <p className="randomchar__title">
            Or choose another one
          </p>
          <button className="button button__main">
            <div className="inner" onClick={ this.onTryIt }>try it</div>
          </button>
          <img src={ mjolnir } alt="mjolnir" className="randomchar__decoration" />
        </div>
      </div>
    );
  };
}

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki } = char;
  const objectFit = thumbnail.indexOf('image_not_available', 0) > 0 ? { objectFit: "contain" } : { objectFit: 'cover' };
  console.log(objectFit)
  return (
    <div className="randomchar__block">
      <img src={ thumbnail } alt="Random character" className="randomchar__img" style={ objectFit } />
      <div className="randomchar__info">
        <p className="randomchar__name">{ name }</p>
        <p
          className="randomchar__descr">{ description || 'There\'s no description' }</p>
        <div className="randomchar__btns">
          <a href={ homepage } className="button button__main">
            <div className="inner">homepage</div>
          </a>
          <a href={ wiki } className="button button__secondary">
            <div className="inner">Wiki</div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default RandomChar;