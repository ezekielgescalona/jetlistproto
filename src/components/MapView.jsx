/**
 * MapView — interactive destination map (visualization #1).
 * Built with Leaflet + react-leaflet: free, no API key, and the dark
 * CARTO basemap matches the night-flight theme. Centered on the
 * lat/lon that OpenWeather returned for the searched city.
 */
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Vite bundles assets, so Leaflet's default marker images need
// explicit imports — a well-known fix for the "missing marker" bug.
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function MapView({ trip }) {
  const { lat, lon } = trip.weather;

  return (
    <div className="h-72 overflow-hidden rounded-2xl border border-white/10 sm:h-80">
      <MapContainer center={[lat, lon]} zoom={9} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[lat, lon]}>
          <Popup>
            <span className="font-mono text-xs">
              {trip.destination} · {trip.weather.tempF}°F {trip.weather.description}
            </span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
