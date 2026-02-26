import ResortCard from './components/ResortCard';
import './index.css';

export interface Resort {
  name: string;
  latitude: number;
  longitude: number;
}

const resorts: Resort[] = [
  { name: 'Chamonix', latitude: 45.9237, longitude: 6.8694 },
  { name: 'Verbier', latitude: 46.0952, longitude: 7.2262 },
  { name: 'Zermatt', latitude: 46.0207, longitude: 7.7491 },
  { name: 'Gstaad', latitude: 46.4859, longitude: 7.2836 },
  { name: 'Crans-Montana', latitude: 46.3166, longitude: 7.5171 },
];

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Ski Resort Weather Dashboard</h1>
        <p className="subtitle">Météo des neiges pour la région de Genève</p>
      </header>
      <main className="card-grid">
        {resorts.map((r) => (
          <ResortCard key={r.name} resort={r} />
        ))}
      </main>
      <footer>
        <p>
          Data provided by <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer">Open-Meteo</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
