import { Link } from 'react-router-dom';
import { getWeatherDescription } from '../services/weatherService';
import type { Resort, WeatherData } from '../types';

interface Props {
  resort: Resort;
  weather: WeatherData | null;
}

export default function ResortCard({ resort, weather }: Props) {
  const desc = weather ? getWeatherDescription(weather.weathercode) : null;

  return (
    <Link to={`/resort/${resort.id}`}>
      <div className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 hover:border-blue-500 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 cursor-pointer h-full">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{resort.name}</h2>
          <p className="text-sm text-gray-400">{resort.region}, {resort.country}</p>
        </div>

        {/* Weather Info */}
        {weather && desc ? (
          <div className="space-y-4">
            {/* Temperature and Condition */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-blue-400">{weather.temperature}°C</p>
              </div>
              <div className="text-5xl">{desc.icon}</div>
            </div>

            {/* Description */}
            <p className="text-gray-300 font-medium">{desc.text}</p>

            {/* Wind Info */}
            <div className="pt-4 border-t border-slate-700 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Vent</p>
                <p className="text-lg font-semibold text-gray-100">{weather.windspeed} km/h</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Altitude</p>
                <p className="text-lg font-semibold text-gray-100">{resort.elevation} m</p>
              </div>
            </div>

            {/* Snow Condition Badge */}
            <div className="pt-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
                  desc.isSnowyCondition
                    ? 'bg-blue-500/20 text-blue-300 group-hover:bg-blue-500/40'
                    : 'bg-amber-500/20 text-amber-300 group-hover:bg-amber-500/40'
                }`}
              >
                {desc.isSnowyCondition ? '❄️ Conditions de neige' : '⛷️ Pas de neige'}
              </span>
            </div>

            {/* Time */}
            <p className="text-xs text-gray-500">Mis à jour: {new Date(weather.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-400">
            <p className="text-sm">Chargement des données météorologiques...</p>
          </div>
        )}
      </div>
    </Link>
  );
}
