import React from 'react';

function SmallIcon({ icon }) {
  if (!icon) return <div style={{ width: 28, height: 28 }} />;
  const src = `https://openweathermap.org/img/wn/${icon}.png`;
  return <img src={src} alt="" style={{ width: 28, height: 28 }} />;
}

export default function WeekForecast({ daily = [] }) {
  return (
    <div className="card week">
      <h3>7-Day Forecast</h3>
      <div className="week-list">
        {daily.map((d, i) => (
          <div className="week-item" key={i}>
            <div className="week-day">{d.day}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SmallIcon icon={d.icon} />
              <div className="week-desc">{d.description}</div>
            </div>
            <div className="week-temp">{d.high}/{d.low}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
