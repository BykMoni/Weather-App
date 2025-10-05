// src/pages/MapPage.js
import React, { useState } from 'react';

export default function MapPage() {
  const [city, setCity] = useState('Accra');
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_KEY = process.env.REACT_APP_WEATHER_KEY || localStorage.getItem('REACT_APP_WEATHER_KEY_RUNTIME');

  // We'll use OpenWeather 'weather' endpoint to get coords for the city
  async function lookup() {
    if (!city) return;
    setLoading(true);
    try {
      const query = city.toLowerCase().includes(',') ? city : `${city},gh`;
      const apiKey = API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${apiKey}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.cod && Number(json.cod) !== 200) {
        alert(json.message || 'City not found');
        setCoords(null);
      } else {
        setCoords({ lat: json.coord.lat, lon: json.coord.lon, name: json.name, country: json.sys.country });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to lookup city coordinates.');
    } finally {
      setLoading(false);
    }
  }

  const openOSM = coords
    ? `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lon}#map=12/${coords.lat}/${coords.lon}`
    : 'https://www.openstreetmap.org';

  return (
    <div style={{ padding: 18 }}>
      <div className="card">
        <h2>Map</h2>
        <p style={{ color: '#9fa3a6' }}>
          Find city coordinates and open the location in OpenStreetMap.
        </p>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city (e.g. Accra)"
            style={{ flex: 1, padding: 8, borderRadius: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.03)', color: 'inherit' }}
          />
          <button onClick={lookup} style={{ padding: '8px 12px' }}>{loading ? '...' : 'Lookup'}</button>
        </div>

        {coords && (
          <div style={{ marginTop: 12 }}>
            <p style={{ margin: 0 }}><strong>{coords.name}, {coords.country}</strong></p>
            <p style={{ color: '#9fa3a6', marginTop: 6 }}>lat: {coords.lat}, lon: {coords.lon}</p>

            <div style={{ marginTop: 12 }}>
              <a href={openOSM} target="_blank" rel="noopener noreferrer">
                <button style={{ padding: '8px 12px' }}>Open in OpenStreetMap</button>
              </a>
            </div>

            <div style={{ marginTop: 12 }}>
              <iframe
                title="osm"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lon - 0.15}%2C${coords.lat - 0.15}%2C${coords.lon + 0.15}%2C${coords.lat + 0.15}&layer=mapnik&marker=${coords.lat}%2C${coords.lon}`}
                style={{ width: '100%', height: 360, border: 0, borderRadius: 8 }}
              />
              <p style={{ color: '#9fa3a6', marginTop: 6, fontSize: 13 }}>Interactive embed (OpenStreetMap). Use the Open in OpenStreetMap button to view full map.</p>
            </div>
          </div>
        )}
      </div>

      <aside style={{ marginTop: 12, color: '#9fa3a6' }}>
      </aside>
    </div>
  );
}
