import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { resorts } from '../data/resorts';
import { fetchWeather, getWeatherDescription } from '../services/weatherService';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const resort = resorts.find((r) => r.id === id);

  const { data: weather, isLoading, error } = useQuery({
    queryKey: ['weather', id],
    queryFn: () => {
      if (!resort) throw new Error('Resort not found');
      return fetchWeather(resort.latitude, resort.longitude);
    },
    enabled: !!resort,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  if (!resort) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Station non trouvée</h1>
          <Link to="/" className="text-blue-400 hover:text-blue-300">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  const weatherDesc = weather ? getWeatherDescription(weather.weathercode) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-gray-100">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link to="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Retour
          </Link>
          <h1 className="text-4xl font-bold mb-2">{resort.name}</h1>
          <p className="text-gray-400">{resort.region}, {resort.country} • Altitude: {resort.elevation} m</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {isLoading && <div className="text-center py-12 text-gray-400">Chargement des données météorologiques...</div>}

        {error && <div className="text-center py-12 text-red-400">Erreur lors du chargement des données</div>}

        {weather && weatherDesc && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Current Weather */}
            <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700">
              <h2 className="text-2xl font-semibold mb-6">Conditions actuelles</h2>

              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-3">{weatherDesc.icon}</div>
                  <p className="text-2xl font-bold">{weather.temperature}°C</p>
                  <p className="text-gray-400 text-lg">{weatherDesc.text}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-700">
                  <div>
                    <p className="text-gray-400 text-sm">Vitesse du vent</p>
                    <p className="text-2xl font-semibold">{weather.windspeed} km/h</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Direction du vent</p>
                    <p className="text-2xl font-semibold">{weather.winddirection}°</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Jour/Nuit</p>
                  <p className="text-xl font-semibold">{weather.is_day ? 'Jour' : 'Nuit'}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Heure de mise à jour</p>
                  <p className="font-mono text-sm">{new Date(weather.time).toLocaleString('fr-FR')}</p>
                </div>
              </div>
            </div>

            {/* Resort Info */}
            <div className="bg-slate-800/50 rounded-lg p-8 border border-slate-700">
              <h2 className="text-2xl font-semibold mb-6">Informations de la station</h2>

              <div className="space-y-6">
                <div>
                  <p className="text-gray-400 text-sm">Région</p>
                  <p className="text-xl font-semibold">{resort.region}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Pays</p>
                  <p className="text-xl font-semibold">{resort.country}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Altitude</p>
                  <p className="text-xl font-semibold">{resort.elevation} mètres</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Coordonnées GPS</p>
                  <p className="font-mono text-sm">{resort.latitude.toFixed(4)}, {resort.longitude.toFixed(4)}</p>
                </div>

                <div className="pt-4">
                  <p className="text-gray-400 text-xs">
                    {weatherDesc.isSnowyCondition
                      ? '❄️ Conditions neigeuses - Idéal pour le ski!'
                      : '⛷️ Vérifiez les conditions locales avant de partir'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>Données fournies par <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Open-Meteo</a></p>
        </div>
      </footer>
    </div>
  );
}
