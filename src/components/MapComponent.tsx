import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { getWeatherDescription } from '../services/weatherService';
import type { Resort, WeatherData } from '../types';

// Fix for default marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.setIcon(DefaultIcon);

interface Props {
  resorts: Resort[];
  weatherData?: Record<string, WeatherData | null>;
}

function MapBounds({ resorts }: { resorts: Resort[] }) {
  const map = useMap();
  if (resorts.length > 0) {
    const bounds = L.latLngBounds(resorts.map((r) => [r.latitude, r.longitude]));
    map.fitBounds(bounds, { padding: [50, 50] });
  }
  return null;
}

export default function MapComponent({ resorts, weatherData = {} }: Props) {
  const center: [number, number] = [46.2, 7.5];

  return (
    <div className="mb-8 h-96 rounded-lg overflow-hidden border border-slate-700">
      <MapContainer center={center} zoom={8} className="w-full h-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapBounds resorts={resorts} />
        {resorts.map((resort) => {
          const weather = weatherData[resort.id];
          const desc = weather ? getWeatherDescription(weather.weathercode) : null;
          return (
            <Marker key={resort.id} position={[resort.latitude, resort.longitude]}>
              <Popup>
                <div className="p-2">
                  <Link to={`/resort/${resort.id}`} className="block font-semibold hover:underline mb-2">
                    {resort.name}
                  </Link>
                  {weather && desc ? (
                    <div className="text-sm">
                      <p>
                        <span className="font-semibold">{weather.temperature}°C</span> {desc.icon}
                      </p>
                      <p className="text-gray-600">{desc.text}</p>
                      <p className="text-gray-600">Vent: {weather.windspeed} km/h</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">Chargement...</p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
