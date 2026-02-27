import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { resorts } from '../data/resorts';
import { fetchWeather, getWeatherDescription } from '../services/weatherService';
import type { WeatherData } from '../types';

export default function ComparisonPage() {
  const [searchParams] = useSearchParams();
  const resortIds = searchParams.get('resorts')?.split(',') || [];

  if (resortIds.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Aucune station à comparer</h1>
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  const selectResorts = resorts.filter((r) => resortIds.includes(r.id));

  const { data: weatherData = {} } = useQuery({
    queryKey: ['compareWeather', resortIds],
    queryFn: async () => {
      const results: Record<string, WeatherData | null> = {};
      for (const resort of selectResorts) {
        try {
          results[resort.id] = await fetchWeather(resort.latitude, resort.longitude);
        } catch (e) {
          results[resort.id] = null;
        }
      }
      return results;
    },
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-gray-100">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link to="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Retour
          </Link>
          <h1 className="text-4xl font-bold mb-2">Comparaison des stations</h1>
          <p className="text-gray-400">{selectResorts.length} station(s) sélectionnée(s)</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Comparison Table */}
        <div className="overflow-x-auto bg-slate-800/50 rounded-lg border border-slate-700">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-6 py-4 text-left font-semibold">Station</th>
                <th className="px-6 py-4 text-left font-semibold">Température</th>
                <th className="px-6 py-4 text-left font-semibold">Conditions</th>
                <th className="px-6 py-4 text-left font-semibold">Vent</th>
                <th className="px-6 py-4 text-left font-semibold">État neige</th>
                <th className="px-6 py-4 text-left font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {selectResorts.map((resort) => {
                const weather = weatherData[resort.id];
                const desc = weather ? getWeatherDescription(weather.weathercode) : null;
                return (
                  <tr key={resort.id} className="border-b border-slate-700 hover:bg-slate-700/20">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">{resort.name}</p>
                        <p className="text-sm text-gray-400">{resort.region}, {resort.country}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-2xl font-bold">
                        {weather ? `${weather.temperature}°C` : '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {desc ? (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{desc.icon}</span>
                          <span className="text-sm">{desc.text}</span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p>{weather ? `${weather.windspeed} km/h` : '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      {desc ? (
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            desc.isSnowyCondition
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {desc.isSnowyCondition ? '❄️ Neige' : '⛷️ Pas de neige'}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/resort/${resort.id}`}
                        className="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Détails →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Cards View for Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 md:hidden">
          {selectResorts.map((resort) => {
            const weather = weatherData[resort.id];
            const desc = weather ? getWeatherDescription(weather.weathercode) : null;
            return (
              <div key={resort.id} className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="text-xl font-semibold mb-4">{resort.name}</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Température:</span> {weather ? `${weather.temperature}°C` : '-'}</p>
                  <p><span className="text-gray-400">Conditions:</span> {desc?.text || '-'}</p>
                  <p><span className="text-gray-400">Vent:</span> {weather ? `${weather.windspeed} km/h` : '-'}</p>
                  <p><span className="text-gray-400">Neige:</span> {desc?.isSnowyCondition ? '❄️ Oui' : '⛷️ Non'}</p>
                </div>
                <Link
                  to={`/resort/${resort.id}`}
                  className="mt-4 inline-block text-blue-400 hover:text-blue-300 font-medium"
                >
                  Détails →
                </Link>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>Données fournies par <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Open-Meteo</a></p>
        </div>
      </footer>
    </div>
  );
}
