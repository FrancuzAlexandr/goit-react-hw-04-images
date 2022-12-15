import { useState } from 'react';
import { ImSearch } from 'react-icons/im';
import PropTypes from 'prop-types';
import css from './Searchbar.module.css';

export const Searchbar = ({ prevSearchName, onSubmit, changePage }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    if (!query) {
      return;
    }

    if (prevSearchName && query === prevSearchName) {
      return;
    }

    onSubmit(query);
    changePage();
    setQuery('');
  };

  return (
    <header className={css.Searchbar}>
      <form className={css.SearchForm} onSubmit={handleSubmit}>
        <button type="submit" className={css.SearchForm__Button}>
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
          value={query}
          onChange={event => {
            setQuery(event.currentTarget.value);
          }}
        />
      </form>
    </header>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  prevSearchName: PropTypes.string.isRequired,
};
