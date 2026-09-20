import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { RecyclingPoint } from '../../types';

// Иконка маркера — самодельная через divIcon (не тянем картинки из leaflet)
const markerIcon = L.divIcon({
  className: 'ecocycle-marker',
  html: `<div style="
    width: 28px; height: 28px;
    background: #7CA982;
    border: 3px solid #FFFFFF;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 4px 12px rgba(26,36,25,0.25);
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

interface Props {
  points: RecyclingPoint[];
}

export const PointsMap = ({ points }: Props) => {
  const withCoords = points.filter(
    (p) => p.latitude != null && p.longitude != null
  );

  if (withCoords.length === 0) {
    return (
      <div className="bg-surface border border-line rounded-card p-8 text-center text-muted text-sm">
        На карте пока нет пунктов с координатами.
      </div>
    );
  }

  // Центр — среднее по точкам
  const avgLat =
    withCoords.reduce((s, p) => s + (p.latitude ?? 0), 0) / withCoords.length;
  const avgLng =
    withCoords.reduce((s, p) => s + (p.longitude ?? 0), 0) / withCoords.length;

  return (
    <div className="bg-surface border border-line rounded-card overflow-hidden">
      <MapContainer
        center={[avgLat, avgLng]}
        zoom={8}
        scrollWheelZoom={false}
        style={{ height: '420px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {withCoords.map((p) => (
          <Marker
            key={p.id}
            position={[p.latitude as number, p.longitude as number]}
            icon={markerIcon}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <strong style={{ color: '#1A2419' }}>{p.name}</strong>
                <div style={{ fontSize: 12, color: '#5A6354', marginTop: 4 }}>
                  {p.address}
                </div>
                {p.workingHours && (
                  <div style={{ fontSize: 12, color: '#8A9384', marginTop: 4 }}>
                    {p.workingHours}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};