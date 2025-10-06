// src/pages/WeatherPage.js
import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import HourlyForecast from '../components/HourlyForecast';
import AirConditions from '../components/AirConditions';
import WeekForecast from '../components/WeekForecast';

const KEYS = {
  UNITS: 'weather_units_v1',
  DEFAULT_CITY: 'weather_default_city_v1',
  AUTO_REFRESH: 'weather_autorefresh_v1',
};

// Try to get API key from .env or window (runtime injection)
const API_KEY =
  window.__WEATHER_KEY__ || process.env.REACT_APP_WEATHER_KEY;

export default function WeatherPage() {
  // Load preferences from localStorage
  const savedUnits = localStorage.getItem(KEYS.UNITS) || 'metric';
  const savedCity = localStorage.getItem(KEYS.DEFAULT_CITY) || 'Accra';
  const refreshMins = parseInt(localStorage.getItem(KEYS.AUTO_REFRESH) || 0);

  const [city, setCity] = useState(savedCity);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    // Fetch default city when app starts
    fetchWeather(city);

    // Auto refresh if user set interval
    if (refreshMins > 0) {
      const id = setInterval(() => fetchWeather(city), refreshMins * 60000);
      return () => clearInterval(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchWeather(qCity) {
    setError(null);

    if (!API_KEY) {
      setError('⚠️ No API key found. Please contact support or add it in deployment settings.');
      console.error('Missing API key: Check .env or Netlify Environment Variables.');
      return;
    }
    if (!qCity) return;

    setLoading(true);
    try {
      const query = qCity.toLowerCase().includes(',') ? qCity : `${qCity},gh`;

      // Get current weather (to get coordinates)
      const curUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        query
      )}&appid=${API_KEY}&units=${savedUnits}`;
      const curRes = await fetch(curUrl);
      const curJson = await curRes.json();

      if (curJson.cod && Number(curJson.cod) !== 200) {
        setError(curJson.message || 'City not found');
        setPayload(null);
        setLoading(false);
        return;
      }

      const { coord, name, sys } = curJson;

      // Try OneCall 3.0 (preferred)
      const onecall3Url = `https://api.openweathermap.org/data/3.0/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,alerts&units=${savedUnits}&appid=${API_KEY}`;
      const onecall3Res = await fetch(onecall3Url);
      const onecall3Json = await onecall3Res.json();

      if (onecall3Res.ok && !onecall3Json.cod) {
        const mapped = {
          location: `${name}, ${sys.country}`,
          current: {
            temp: Math.round(onecall3Json.current.temp),
            condition: onecall3Json.current.weather?.[0]?.main || '',
            icon: onecall3Json.current.weather?.[0]?.icon || '',
            chanceRain: onecall3Json.hourly?.[0]?.pop
              ? Math.round(onecall3Json.hourly[0].pop * 100)
              : 0,
          },
          hourly: (onecall3Json.hourly || []).slice(0, 12).map((h) => ({
            time: new Date(h.dt * 1000).toLocaleTimeString([], {
              hour: 'numeric',
              hour12: true,
            }),
            temp: Math.round(h.temp),
            pop: Math.round((h.pop || 0) * 100),
            icon: h.weather?.[0]?.icon || '',
          })),
          daily: (onecall3Json.daily || []).slice(0, 7).map((d) => ({
            day: new Date(d.dt * 1000).toLocaleDateString([], {
              weekday: 'short',
            }),
            description: d.weather?.[0]?.main || '',
            icon: d.weather?.[0]?.icon || '',
            high: Math.round(d.temp.max),
            low: Math.round(d.temp.min),
          })),
          air: {
            realFeel: Math.round(onecall3Json.current.feels_like),
            wind: `${onecall3Json.current.wind_speed} m/s`,
            chanceRain: onecall3Json.hourly?.[0]
              ? `${Math.round(onecall3Json.hourly[0].pop * 100)}%`
              : '0%',
            uv: onecall3Json.current.uvi || 0,
          },
        };

        setPayload(mapped);
        setLoading(false);
        return;
      }

      // Fallback if OneCall 3.0 fails
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}&units=${savedUnits}`;
      const forecastRes = await fetch(forecastUrl);
      const forecastJson = await forecastRes.json();

      if (forecastJson.cod && Number(forecastJson.cod) !== 200) {
        setError(forecastJson.message || 'Forecast API error');
        setPayload(null);
        setLoading(false);
        return;
      }

      const hours = (forecastJson.list || []).slice(0, 12).map((h) => ({
        time: new Date(h.dt * 1000).toLocaleTimeString([], {
          hour: 'numeric',
          hour12: true,
        }),
        temp: Math.round(h.main.temp),
        pop: h.pop ? Math.round(h.pop * 100) : 0,
        icon: h.weather?.[0]?.icon || '',
      }));

      const dayMap = {};
      (forecastJson.list || []).forEach((item) => {
        const d = new Date(item.dt * 1000);
        const key = d.toLocaleDateString();
        if (!dayMap[key])
          dayMap[key] = {
            highs: [],
            lows: [],
            desc: item.weather?.[0]?.main || '',
            icon: item.weather?.[0]?.icon || '',
          };
        dayMap[key].highs.push(item.main.temp_max);
        dayMap[key].lows.push(item.main.temp_min);
      });

      const daily = Object.keys(dayMap)
        .slice(0, 7)
        .map((k) => {
          const obj = dayMap[k];
          const high = Math.round(Math.max(...obj.highs));
          const low = Math.round(Math.min(...obj.lows));
          const d = new Date(k);
          return {
            day: d.toLocaleDateString([], { weekday: 'short' }),
            description: obj.desc,
            icon: obj.icon,
            high,
            low,
          };
        });

      const mappedFallback = {
        location: `${name}, ${sys.country}`,
        current: {
          temp: Math.round(curJson.main.temp),
          condition: curJson.weather?.[0]?.main || '',
          icon: curJson.weather?.[0]?.icon || '',
          chanceRain: hours[0] ? hours[0].pop : 0,
        },
        hourly: hours,
        daily,
        air: {
          realFeel: Math.round(curJson.main.feels_like || curJson.main.temp),
          wind: `${curJson.wind?.speed || 0} m/s`,
          chanceRain: hours[0] ? `${hours[0].pop}%` : '0%',
          uv: 'n/a',
        },
      };

      setPayload(mappedFallback);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Network or fetch error (see console).');
      setPayload(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="weather-page">
      <header className="top-row" style={{ padding: 12 }}>
        <SearchBar
          city={city}
          onCityChange={setCity}
          onSearch={() => fetchWeather(city)}
          loading={loading}
        />
      </header>

      {error && (
        <div
          className="card"
          style={{ color: '#ffb4b4', margin: 12 }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      <main className="content-grid" style={{ padding: 12 }}>
        <section className="left-panel">
          {!payload && !error && (
            <div className="card">
              Search a Ghana city (e.g. Accra) to load live data.
            </div>
          )}
          {payload && (
            <>
              <CurrentWeather
                current={payload.current}
                location={payload.location}
              />
              <HourlyForecast hourly={payload.hourly} />
              <AirConditions conditions={payload.air} />
            </>
          )}
        </section>

        <aside className="right-panel">
          {payload ? (
            <WeekForecast daily={payload.daily} />
          ) : (
            <div className="card">
              <h3>7-Day Forecast</h3>
              <p style={{ color: '#9fa3a6' }}>
                Search a city to load forecast
              </p>
            </div>
          )}
        </aside>
      </main>

      <footer className="app-footer" style={{ padding: 12 }}>
        {refreshMins > 0
          ? `Auto-refresh every ${refreshMins} mins`
          : 'Manual refresh only'}{' '}
        • Weather App by Daniel
      </footer>
    </div>
  );
}
