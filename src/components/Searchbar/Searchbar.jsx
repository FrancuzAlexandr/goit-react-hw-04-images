import React, { Component } from 'react';
import { ImSearch } from 'react-icons/im';
import PropTypes from 'prop-types';
import css from './Searchbar.module.css';

export class Searchbar extends Component {
  state = { query: '' };

  handleSubmit = event => {
    const { query } = this.state;
    const { prevSearchName, onSubmit } = this.props;

    event.preventDefault();
    if (!query) {
      return;
    }

    if (prevSearchName && query === prevSearchName) {
      return;
    }

    onSubmit(query);
    this.setState({ query: '' });
  };

  handleChangeName = event => {
    this.setState({
      query: event.currentTarget.value,
    });
  };

  render() {
    return (
      <header className={css.Searchbar}>
        <form className={css.SearchForm} onSubmit={this.handleSubmit}>
          <button type="submit" className={css.SearchFormButton}>
            <span>
              <ImSearch />
            </span>
          </button>

          <input
            className={css.SearchFormInput}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search photos"
            value={this.state.query}
            onChange={this.handleChangeName}
          />
        </form>
      </header>
    );
  }
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  prevSearchName: PropTypes.string.isRequired,
};
