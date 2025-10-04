import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import WeatherPage from './pages/WeatherPage';
import CitiesPage from './pages/CitiesPage';
import MapPage from './pages/MapPage';
import SettingsPage from './pages/SettingsPage';
import './index.css';

export default function App() {
  return (
    <Router>
      <div className="app-root">
        <Sidebar />

        <div className="main-col">
          <Routes>
            <Route path="/" element={<Navigate to="/weather" replace />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/cities" element={<CitiesPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<div style={{ padding: 18 }} className="card">Page not found</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
