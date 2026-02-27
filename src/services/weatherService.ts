import type { ApiResponse, WeatherDescription, WeatherData } from '../types';

const API_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeather(latitude: number, longitude: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current_weather: 'true',
    timezone: 'Europe/Zurich',
  });

  const response = await fetch(`${API_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.statusText}`);
  }

  const data: ApiResponse = await response.json();
  return data.current_weather;
}

export function getWeatherDescription(weathercode: number): WeatherDescription {
  const weatherMap: Record<number, WeatherDescription> = {
    0: { text: 'Ciel dégagé', icon: '☀️', isSnowyCondition: false },
    1: { text: 'Principalement dégagé', icon: '🌤️', isSnowyCondition: false },
    2: { text: 'Partiellement nuageux', icon: '⛅', isSnowyCondition: false },
    3: { text: 'Couvert', icon: '☁️', isSnowyCondition: false },
    45: { text: 'Brouillard', icon: '🌫️', isSnowyCondition: false },
    48: { text: 'Brouillard givrant', icon: '🌫️', isSnowyCondition: false },
    51: { text: 'Bruine faible', icon: '🌦️', isSnowyCondition: false },
    53: { text: 'Bruine modérée', icon: '🌧️', isSnowyCondition: false },
    55: { text: 'Bruine dense', icon: '🌧️', isSnowyCondition: false },
    61: { text: 'Pluie faible', icon: '🌧️', isSnowyCondition: false },
    63: { text: 'Pluie modérée', icon: '🌧️', isSnowyCondition: false },
    65: { text: 'Pluie forte', icon: '⛈️', isSnowyCondition: false },
    71: { text: 'Neige faible', icon: '🌨️', isSnowyCondition: true },
    73: { text: 'Neige modérée', icon: '🌨️', isSnowyCondition: true },
    75: { text: 'Neige forte', icon: '🌨️', isSnowyCondition: true },
    77: { text: 'Grains de neige', icon: '🌨️', isSnowyCondition: true },
    80: { text: 'Averses faibles', icon: '🌧️', isSnowyCondition: false },
    81: { text: 'Averses modérées', icon: '⛈️', isSnowyCondition: false },
    82: { text: 'Averses violentes', icon: '⛈️', isSnowyCondition: false },
    85: { text: 'Averses de neige faibles', icon: '🌨️', isSnowyCondition: true },
    86: { text: 'Averses de neige fortes', icon: '🌨️', isSnowyCondition: true },
    95: { text: 'Orage', icon: '⛈️', isSnowyCondition: false },
    96: { text: 'Orage avec grêle', icon: '⛈️', isSnowyCondition: false },
    99: { text: 'Orage avec grêle', icon: '⛈️', isSnowyCondition: false },
  };

  return weatherMap[weathercode] || { text: 'Inconnu', icon: '❓', isSnowyCondition: false };
}
