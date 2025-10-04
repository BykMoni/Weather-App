import React from 'react';

export default function AirConditions({ conditions = {} }) {
  return (
    <div className="card air">
      <h3>Air conditions</h3>
      <div className="air-grid">
        <div>
          <div className="muted">Real Feel</div>
          <div className="big">{conditions.realFeel}°</div>
        </div>
        <div>
          <div className="muted">Wind</div>
          <div className="big">{conditions.wind}</div>
        </div>
        <div>
          <div className="muted">Chance of rain</div>
          <div className="big">{conditions.chanceRain}</div>
        </div>
        <div>
          <div className="muted">UV Index</div>
          <div className="big">{conditions.uv}</div>
        </div>
      </div>
    </div>
  );
}
