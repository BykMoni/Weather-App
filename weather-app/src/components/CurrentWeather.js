import React from 'react';

function WeatherIcon({ icon, size = 120 }) {
  if (!icon) return null;
  const src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  return <img src={src} alt="weather icon" style={{ width: size, height: size }} />;
}

export default function CurrentWeather({ current = {}, location = '' }) {
  return (
    <div className="card current-weather">
      <div className="cw-top">
        <div>
          <div className="location">{location}</div>
          <div className="rain-chance">Chance of rain: {current.chanceRain}%</div>
        </div>

        <div className="cw-temp">{current.temp}°</div>
      </div>

      <div className="cw-main">
        <div className="cw-icon">
          <WeatherIcon icon={current.icon} />
        </div>

        <div className="cw-right">
          <div className="cw-forecast">Today's Forecast</div>
        </div>
      </div>
    </div>
  );
}
