import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <nav className="sidebar" aria-label="Main navigation">
      <div className="sidebar-inner">
        <div className="brand">☁️</div>
        <ul>
          <li>
            <NavLink to="/weather" className={({ isActive }) => (isActive ? 'active' : '')}>Weather</NavLink>
          </li>
          <li>
            <NavLink to="/cities" className={({ isActive }) => (isActive ? 'active' : '')}>Cities</NavLink>
          </li>
          <li>
            <NavLink to="/map" className={({ isActive }) => (isActive ? 'active' : '')}>Map</NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')}>Settings</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
