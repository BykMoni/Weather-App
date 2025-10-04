import React from 'react';

function SmallIcon({ icon }) {
  if (!icon) return <div style={{ height: 32 }} />;
  const src = `https://openweathermap.org/img/wn/${icon}.png`;
  return <img src={src} alt="" style={{ width: 32, height: 32 }} />;
}

export default function HourlyForecast({ hourly = [] }) {
  return (
    <div className="card hourly">
      <h3>Today's forecast</h3>
      <div className="hourly-strip">
        {hourly.map((h, i) => (
          <div className="hour" key={i}>
            <div className="hour-time">{h.time}</div>
            <div className="hour-icon small"><SmallIcon icon={h.icon} /></div>
            <div className="hour-temp">{h.temp}°</div>
          </div>
        ))}
      </div>
    </div>
  );
}
