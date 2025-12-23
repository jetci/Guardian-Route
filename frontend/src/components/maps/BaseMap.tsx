import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';

// Fix Leaflet default icon issue with Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface BaseMapProps {
  center?: [number, number];
  zoom?: number;
  children?: React.ReactNode;
  className?: string;
}

export const BaseMap = ({
  center = [19.9167, 99.2333], // Default: ตำบลเวียง อ.ฝาง จ.เชียงใหม่ (พื้นที่พัฒนาตามคู่มือ)
  zoom = 13,
  children,
  className = 'h-96 w-full rounded-lg'
}: BaseMapProps) => {
  const { settings, fetchSettings } = useSettingsStore();
  const [enableRadar, setEnableRadar] = useState(false);
  const [radarTimestamp, setRadarTimestamp] = useState<number | null>(null);
  // Always use the correct default coordinates for ตำบลเวียง
  const [mapCenter, setMapCenter] = useState<[number, number]>([19.9167, 99.2333]);

  // Initial fetch
  useEffect(() => {
    fetchSettings();
  }, []);

  // Update local state when settings change
  useEffect(() => {
    if (settings) {
      setEnableRadar(settings.enableWeatherRadar);

      // REMOVED: Do not override with settings - always use correct coordinates
      // The correct coordinates are: ตำบลเวียง [19.9167, 99.2333]
    }
  }, [settings, center]);

  useEffect(() => {
    if (enableRadar) {
      const fetchRadarData = async () => {
        try {
          const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
          const data = await response.json();
          // Get the last available timestamp (latest weather data)
          if (data && data.radar && data.radar.past && data.radar.past.length > 0) {
            const latest = data.radar.past[data.radar.past.length - 1];
            setRadarTimestamp(latest.time);
          }
        } catch (error) {
          console.error('Failed to fetch radar data:', error);
        }
      };
      fetchRadarData();
    }
  }, [enableRadar]);

  return (
    <MapContainer
      center={mapCenter}
      key={`${mapCenter[0]}-${mapCenter[1]}`} // Force re-render when center changes
      zoom={zoom}
      className={className}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {enableRadar && radarTimestamp && (
        <TileLayer
          attribution='Weather data © <a href="https://www.rainviewer.com">RainViewer</a>'
          url={`https://tile.rainviewer.com/${radarTimestamp}/256/{z}/{x}/{y}/2/1_1.png`}
          opacity={0.7}
        />
      )}
      {children}
    </MapContainer>
  );
};
