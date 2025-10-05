// src/pages/SettingsPage.js
import React, { useEffect, useState } from 'react';

const KEYS = {
  UNITS: 'weather_units_v1',
  DEFAULT_CITY: 'weather_default_city_v1',
  AUTO_REFRESH: 'weather_autorefresh_v1',
  FONT_SIZE: 'weather_font_v1',
  FAVORITES: 'weather_favorites_v1',
};

export default function SettingsPage() {
  // local state
  const [units, setUnits] = useState('metric'); // metric = °C, imperial = °F
  const [defaultCity, setDefaultCity] = useState('');
  const [autoRefresh, setAutoRefresh] = useState('off'); // off | 5 | 15 | 30
  const [fontSize, setFontSize] = useState('normal'); // small | normal | large

  // small UI messages shown under actions
  const [message, setMessage] = useState('');

  useEffect(() => {
    // load saved prefs
    setUnits(localStorage.getItem(KEYS.UNITS) || 'metric');
    setDefaultCity(localStorage.getItem(KEYS.DEFAULT_CITY) || '');
    setAutoRefresh(localStorage.getItem(KEYS.AUTO_REFRESH) || 'off');
    setFontSize(localStorage.getItem(KEYS.FONT_SIZE) || 'normal');

    // apply saved font immediately
    applyFont(localStorage.getItem(KEYS.FONT_SIZE) || 'normal');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function saveUnits(next) {
    setUnits(next);
    localStorage.setItem(KEYS.UNITS, next);
    setMessage('Units saved. The app will reload so changes apply.');
    // small delay so user sees message, then reload
    setTimeout(() => window.location.reload(), 900);
  }

  function saveDefaultCity() {
    const c = defaultCity.trim();
    if (c) {
      localStorage.setItem(KEYS.DEFAULT_CITY, c);
      setMessage(`Default city saved: ${c}. The app will reload and show this city on startup.`);
    } else {
      localStorage.removeItem(KEYS.DEFAULT_CITY);
      setMessage('Default city removed. The app will use its built-in default.');
    }
    setTimeout(() => window.location.reload(), 900);
  }

  function saveAutoRefresh(val) {
    setAutoRefresh(val);
    localStorage.setItem(KEYS.AUTO_REFRESH, val);
    setMessage(val === 'off' ? 'Auto-refresh turned off.' : `Auto-refresh set to every ${val} minutes.`);
  }

  function applyFont(size) {
    setFontSize(size);
    localStorage.setItem(KEYS.FONT_SIZE, size);
    // quick application for accessibility
    switch (size) {
      case 'small':
        document.documentElement.style.fontSize = '14px';
        break;
      case 'large':
        document.documentElement.style.fontSize = '18px';
        break;
      default:
        document.documentElement.style.fontSize = '';
    }
    setMessage('Font size updated.');
  }

  function clearSavedData() {
    const ok = window.confirm('Clear saved cities and default city? This will NOT remove app files.');
    if (!ok) return;
    localStorage.removeItem(KEYS.FAVORITES);
    localStorage.removeItem(KEYS.DEFAULT_CITY);
    setDefaultCity('');
    setMessage('Saved cities and default city cleared.');
    // no reload needed
  }

  function resetAll() {
    const ok = window.confirm('Reset ALL settings (units, default city, auto-refresh, font size) ?');
    if (!ok) return;
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    setUnits('metric');
    setDefaultCity('');
    setAutoRefresh('off');
    applyFont('normal');
    setMessage('All settings reset to defaults. The app will reload.');
    setTimeout(() => window.location.reload(), 900);
  }

  return (
    <div style={{ padding: 18 }}>
      <div className="card" style={{ maxWidth: 980, margin: '0 auto' }}>
        <h2 style={{ marginBottom: 6 }}>Settings</h2>

        {/* Units */}
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700 }}>Units</div>
            <div style={{ color: '#9fa3a6' }}>Choose how temperatures show: Celsius (°C) or Fahrenheit (°F).</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => saveUnits('metric')}
              style={{
                padding: '8px 12px',
                background: units === 'metric' ? '#1f6fff' : 'transparent',
                color: units === 'metric' ? '#fff' : '#9fa3a6',
                border: units === 'metric' ? 'none' : '1px solid rgba(255,255,255,0.04)',
                borderRadius: 8,
              }}
            >
              °C
            </button>
            <button
              onClick={() => saveUnits('imperial')}
              style={{
                padding: '8px 12px',
                background: units === 'imperial' ? '#1f6fff' : 'transparent',
                color: units === 'imperial' ? '#fff' : '#9fa3a6',
                border: units === 'imperial' ? 'none' : '1px solid rgba(255,255,255,0.04)',
                borderRadius: 8,
              }}
            >
              °F
            </button>
          </div>
        </div>

        {/* Default city */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 700 }}>Default city</div>
          <div style={{ color: '#9fa3a6', marginTop: 6 }}>Pick a city that loads automatically when you open the app (e.g. Accra).</div>

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input
              value={defaultCity}
              onChange={(e) => setDefaultCity(e.target.value)}
              placeholder="e.g. Accra"
              style={{ flex: 1, padding: 8, borderRadius: 6, background: 'transparent', border: '1px solid rgba(255,255,255,0.03)', color: 'inherit' }}
            />
            <button onClick={saveDefaultCity} style={{ padding: '8px 12px' }}>
              Save
            </button>
          </div>
        </div>

        {/* Auto refresh */}
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700 }}>Auto-refresh</div>
            <div style={{ color: '#9fa3a6' }}>If you keep the app open, automatically refresh the weather every few minutes.</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <select value={autoRefresh} onChange={(e) => saveAutoRefresh(e.target.value)} style={{ padding: '8px 10px', borderRadius: 8 }}>
              <option value="off">Off</option>
              <option value="5">Every 5 minutes</option>
              <option value="15">Every 15 minutes</option>
              <option value="30">Every 30 minutes</option>
            </select>
          </div>
        </div>

        {/* Font size */}
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700 }}>Text size</div>
            <div style={{ color: '#9fa3a6' }}>Make text smaller or larger for easier reading.</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => applyFont('small')}
              style={{
                padding: '8px 10px',
                background: fontSize === 'small' ? '#1f6fff' : 'transparent',
                color: fontSize === 'small' ? '#fff' : '#9fa3a6',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              A-
            </button>
            <button
              onClick={() => applyFont('normal')}
              style={{
                padding: '8px 10px',
                background: fontSize === 'normal' ? '#1f6fff' : 'transparent',
                color: fontSize === 'normal' ? '#fff' : '#9fa3a6',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              A
            </button>
            <button
              onClick={() => applyFont('large')}
              style={{
                padding: '8px 10px',
                background: fontSize === 'large' ? '#1f6fff' : 'transparent',
                color: fontSize === 'large' ? '#fff' : '#9fa3a6',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              A+
            </button>
          </div>
        </div>

        {/* Maintenance: clear / reset */}
        <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
          <button onClick={clearSavedData} style={{ padding: '8px 12px', background: 'transparent',  color: '#ffd7d7', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 8 }}>
            Clear saved cities
          </button>
          <button onClick={resetAll} style={{ padding: '8px 12px', background: '#2b0a0a', color: '#ffd7d7', borderRadius: 8 }}>
            Reset everything
          </button>
        </div>

        {/* small feedback message area */}
        {message && <div style={{ marginTop: 12, color: '#9fa3a6' }}>{message}</div>}

        <div style={{ marginTop: 14 }}>
          <small style={{ color: '#9fa3a6' }}>
            Note: These settings are stored in your browser so they only affect this device and browser. If you change units or default city the app will reload so the change applies everywhere.
          </small>
        </div>
      </div>
    </div>
  );
}
