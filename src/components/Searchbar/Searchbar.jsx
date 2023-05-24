import { useState } from 'react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PropTypes from 'prop-types';
import css from './Searchbar.module.css'




export default function Searchbar ({ onSubmit }) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchQueryChange = event => {
    setSearchQuery(event.currentTarget.value.toLowerCase());
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (searchQuery.trim() === '') {
      Notify.failure('Введите имя покемона');
      return;
    }

    onSubmit(searchQuery);
    setSearchQuery('');
  };

  
    return (
      <header className={css.searchbar}>
        <form className={css.searchForm} onSubmit={handleSubmit}>
          <button type="submit" className={css.searchForm__button}>
            <span className={css.searchForm__label}>Search</span>
          </button>

          <input
            className={css.searchForm__input}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
        </form>
      </header>
    );
  
}

Searchbar.propTypes = {
  onsubmit: PropTypes.func,
};