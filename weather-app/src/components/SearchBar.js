import React from 'react';

export default function SearchBar({ city, onCityChange, onSearch, loading = false }) {
  const handleKey = (e) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className="searchbar" role="search">
      <input
        aria-label="Search for cities"
        placeholder="Search for cities (e.g. Accra)"
        value={city}
        onChange={(e) => onCityChange(e.target.value)}
        onKeyDown={handleKey}
      />
      <button onClick={onSearch} aria-label="Search" className="search-btn">
        {loading ? '...' : 'Search'}
      </button>
    </div>
  );
}
