import { useEffect, useState } from 'react';
import type { Resort } from '../App';

interface WeatherData {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: number;
  time: string;
}

interface ApiResponse {
  current_weather: WeatherData;
}

interface Props {
  resort: Resort;
}

const weatherCodeMap: Record<number, { text: string; icon: string }> = {
  0: { text: 'Clear sky', icon: '☀️' },
  1: { text: 'Mainly clear', icon: '🌤️' },
  2: { text: 'Partly cloudy', icon: '⛅' },
  3: { text: 'Overcast', icon: '☁️' },
  45: { text: 'Fog', icon: '🌫️' },
  48: { text: 'Depositing rime fog', icon: '🌫️' },
  51: { text: 'Drizzle: Light', icon: '🌦️' },
  53: { text: 'Drizzle: Moderate', icon: '🌧️' },
  55: { text: 'Drizzle: Dense intensity', icon: '🌧️' },
  61: { text: 'Rain: Slight', icon: '🌧️' },
  63: { text: 'Rain: Moderate', icon: '🌧️' },
  65: { text: 'Rain: Heavy intensity', icon: '🌧️' },
  71: { text: 'Snow fall: Slight', icon: '🌨️' },
  73: { text: 'Snow fall: Moderate', icon: '🌨️' },
  75: { text: 'Snow fall: Heavy intensity', icon: '🌨️' },
  95: { text: 'Thunderstorm: Slight or moderate', icon: '⛈️' },
  96: { text: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { text: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

function ResortCard({ resort }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${resort.latitude}&longitude=${resort.longitude}&current_weather=true&timezone=auto`;

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data: ApiResponse) => {
        setWeather(data.current_weather);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [resort.latitude, resort.longitude]);

  const renderContent = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;
    if (weather) {
      const codeInfo = weatherCodeMap[weather.weathercode] || { text: 'Unknown', icon: '❓' };
      return (
        <>
          <div className="weather-icon" aria-label={codeInfo.text}>
            {codeInfo.icon}
          </div>
          <div className="temp">
            {weather.temperature.toFixed(1)}°C
          </div>
          <div className="description">{codeInfo.text}</div>
          <div className="details">
            <small>Wind {weather.windspeed} km/h</small>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <h2>{resort.name}</h2>
      {renderContent()}
    </div>
  );
}

export default ResortCard;
