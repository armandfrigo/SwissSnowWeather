import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { resorts } from '../data/resorts';
import { fetchWeather, getWeatherDescription } from '../services/weatherService';
import ResortCard from '../components/ResortCard';
import MapComponent from '../components/MapComponent';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import type { WeatherData } from '../types';

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResorts, setSelectedResorts] = useState<Set<string>>(new Set());
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'temperature' | 'snowy'>('name');
  const [showMap, setShowMap] = useState(false);

  // Fetch weather for all resorts
  const { data: weatherData = {} } = useQuery({
    queryKey: ['allWeather'],
    queryFn: async () => {
      const results: Record<string, WeatherData | null> = {};
      for (const resort of resorts) {
        try {
          results[resort.id] = await fetchWeather(resort.latitude, resort.longitude);
        } catch (e) {
          results[resort.id] = null;
        }
      }
      return results;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Filter and sort resorts
  const filteredResorts = useMemo(() => {
    let filtered = resorts.filter((resort) => {
      const matchesSearch = resort.name.toLowerCase().includes(searchTerm.toLowerCase());
      const weather = weatherData[resort.id];

      if (!matchesSearch) return false;

      if (filterCondition === 'all') return true;
      if (filterCondition === 'snowy') {
        if (!weather) return false;
        const desc = getWeatherDescription(weather.weathercode);
        return desc.isSnowyCondition;
      }
      if (filterCondition === 'cold') {
        if (!weather) return false;
        return weather.temperature < 0;
      }
      if (filterCondition === 'clear') {
        if (!weather) return false;
        return weather.weathercode <= 2;
      }
      return true;
    });

    // Sort
    if (sortBy === 'temperature') {
      filtered.sort((a, b) => {
        const tempA = weatherData[a.id]?.temperature ?? 0;
        const tempB = weatherData[b.id]?.temperature ?? 0;
        return tempA - tempB;
      });
    } else if (sortBy === 'snowy') {
      filtered.sort((a, b) => {
        const weatherA = weatherData[a.id];
        const weatherB = weatherData[b.id];
        const isSnowyA = weatherA ? getWeatherDescription(weatherA.weathercode).isSnowyCondition : false;
        const isSnowyB = weatherB ? getWeatherDescription(weatherB.weathercode).isSnowyCondition : false;
        return isSnowyB ? 1 : isSnowyA ? -1 : 0;
      });
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [searchTerm, weatherData, filterCondition, sortBy]);

  const toggleResortSelection = (resortId: string) => {
    const newSelection = new Set(selectedResorts);
    if (newSelection.has(resortId)) {
      newSelection.delete(resortId);
    } else {
      newSelection.add(resortId);
    }
    setSelectedResorts(newSelection);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-gray-100">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">Météo des Neiges</h1>
          <p className="text-gray-400">Tableaux de bord météo pour les stations de ski près de Genève</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Controls */}
        <div className="mb-8 space-y-4">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <div className="flex gap-4 flex-wrap items-center">
            <FilterBar filterCondition={filterCondition} onFilterChange={setFilterCondition} sortBy={sortBy} onSortChange={setSortBy} />
            <button
              onClick={() => setShowMap(!showMap)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              {showMap ? 'Masquer la carte' : 'Afficher la carte'}
            </button>
            {selectedResorts.size > 0 && (
              <Link
                to={`/compare?resorts=${Array.from(selectedResorts).join(',')}`}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
              >
                Comparer ({selectedResorts.size})
              </Link>
            )}
          </div>
        </div>

        {/* Map View */}
        {showMap && <MapComponent resorts={filteredResorts} />}

        {/* Resort Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResorts.map((resort) => {
            const weather = weatherData[resort.id];
            const isSelected = selectedResorts.has(resort.id);
            return (
              <div
                key={resort.id}
                className={`cursor-pointer transition-transform ${isSelected ? 'ring-2 ring-purple-500 transform scale-105' : ''}`}
                onClick={() => toggleResortSelection(resort.id)}
              >
                <ResortCard resort={resort} weather={weather} />
              </div>
            );
          })}
        </div>

        {filteredResorts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Aucune station trouvée correspondant à vos critères.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>Données météorologiques fournies par <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Open-Meteo</a></p>
        </div>
      </footer>
    </div>
  );
}
