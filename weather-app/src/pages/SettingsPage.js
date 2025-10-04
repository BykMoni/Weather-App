// src/pages/SettingsPage.js
import React, { useState, useEffect } from 'react';

const UNITS_KEY = 'weather_units_v1';
const RUNTIME_KEY = 'REACT_APP_WEATHER_KEY_RUNTIME';

export default function SettingsPage() {
  const [units, setUnits] = useState('metric'); // metric = C, imperial = F
  const [runtimeKey, setRuntimeKey] = useState('');

  useEffect(() => {
    const u = localStorage.getItem(UNITS_KEY) || 'metric';
    setUnits(u);
    const k = localStorage.getItem(RUNTIME_KEY) || '';
    setRuntimeKey(k);
  }, []);

  function toggleUnits() {
    const next = units === 'metric' ? 'imperial' : 'metric';
    setUnits(next);
    localStorage.setItem(UNITS_KEY, next);
    window.location.reload(); // quick way to ensure WeatherPage picks it up (could also use context)
  }

  function saveKey() {
    if (runtimeKey && runtimeKey.trim()) {
      localStorage.setItem(RUNTIME_KEY, runtimeKey.trim());
      alert('Runtime API key saved to localStorage. Restart app if necessary.');
      window.location.reload();
    } else {
      localStorage.removeItem(RUNTIME_KEY);
      alert('Runtime API key removed; app will use .env key on restart.');
      window.location.reload();
    }
  }

  return (
    <div style={{ padding: 18 }}>
      <div className="card">
        <h2>Settings</h2>

        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700 }}>Units</div>
              <div style={{ color: '#9fa3a6' }}>Switch between Celsius and Fahrenheit</div>
            </div>
            <div>
              <button onClick={toggleUnits} style={{ padding: '8px 12px' }}>
                {units === 'metric' ? 'Switch to °F' : 'Switch to °C'}
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ fontWeight: 700 }}>Runtime API Key (optional)</div>
          <div style={{ color: '#9fa3a6', marginTop: 6 }}>You can set a key here for demos. This will be stored in localStorage and override .env key at runtime.</div>

          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <input
              value={runtimeKey}
              onChange={(e) => setRuntimeKey(e.target.value)}
              placeholder="Paste API key here"
              style={{ flex: 1, padding: 8, borderRadius: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.03)', color: 'inherit' }}
            />
            <button onClick={saveKey} style={{ padding: '8px 12px' }}>Save</button>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <small style={{ color: '#9fa3a6' }}>
            Note: For production keep API keys server-side. The runtime key stored here is for local demos only.
          </small>
        </div>
      </div>
    </div>
  );
}
