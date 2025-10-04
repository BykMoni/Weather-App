// src/pages/CitiesPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'weather_favorites_v1';

export default function CitiesPage() {
  const [input, setInput] = useState('');
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setFavorites(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  function addCity() {
    const name = input.trim();
    if (!name) return;
    if (favorites.includes(name)) {
      setInput('');
      return;
    }
    setFavorites((s) => [name, ...s]);
    setInput('');
  }

  function removeCity(name) {
    setFavorites((s) => s.filter((c) => c !== name));
  }

  function openWeather(name) {
    // navigate to weather route and pass city in state
    navigate('/weather', { state: { city: name } });
  }

  return (
    <div style={{ padding: 18 }}>
      <div className="card">
        <h2>Saved Cities</h2>

        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <input
            placeholder="Add city (e.g. Accra)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid rgba(255,255,255,0.03)', background: 'transparent', color: 'inherit' }}
          />
          <button onClick={addCity} style={{ padding: '8px 12px' }}>Add</button>
        </div>

        <div style={{ marginTop: 14 }}>
          {favorites.length === 0 && <p style={{ color: '#9fa3a6' }}>No saved cities yet — add one above.</p>}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {favorites.map((c) => (
              <li key={c} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button onClick={() => openWeather(c)} style={{ background: 'transparent', border: 0, color: '#1f6fff', cursor: 'pointer' }}>{c}</button>
                  <small style={{ color: '#9fa3a6' }}> — open weather</small>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openWeather(c)} style={{ padding: '6px 10px' }}>Open</button>
                  <button onClick={() => removeCity(c)} style={{ padding: '6px 10px', background: '#2b0a0a', color: '#ffd7d7' }}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
