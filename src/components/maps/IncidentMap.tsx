import React, { useEffect, useState } from 'react';
import { Incident } from '../../types';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ShieldAlert, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

// Fix Leaflet default icon path issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored pin generator for Leaflet
function createCustomPin(color: string) {
  return L.divIcon({
    className: 'custom-pin-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28],
  });
}

const pinColors: Record<string, string> = {
  Critique: '#DC2626',
  Moyenne: '#F59E0B',
  Faible: '#10B981',
};

interface IncidentMapProps {
  incidents: Incident[];
  onSelectIncident?: (incident: Incident) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  interactive?: boolean;
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export const IncidentMap: React.FC<IncidentMapProps> = ({
  incidents,
  onSelectIncident,
  center = [14.6937, -17.4441], // Dakar, Senegal center
  zoom = 12,
  height = '100%',
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div 
        style={{ height }} 
        className="w-full bg-[#F8FAFC] rounded-2xl flex items-center justify-center text-[#6B7280] font-medium border border-[#E5E7EB]"
      >
        Chargement de la carte des incidents...
      </div>
    );
  }

  return (
    <div style={{ height }} className="w-full relative rounded-2xl overflow-hidden shadow-inner border border-[#E5E7EB]">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={[center[0], center[1]]} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {incidents.map((inc) => {
          const color = pinColors[inc.urgency] || '#1E5EFF';
          return (
            <Marker
              key={inc.id}
              position={[inc.location.lat, inc.location.lng]}
              icon={createCustomPin(color)}
              eventHandlers={{
                click: () => onSelectIncident?.(inc),
              }}
            >
              <Popup className="rounded-xl overflow-hidden shadow-lg border-0">
                <div className="p-1 max-w-[220px]">
                  {inc.photoUrl && (
                    <img 
                      src={inc.photoUrl} 
                      alt={inc.title} 
                      className="w-full h-24 object-cover rounded-lg mb-2" 
                    />
                  )}
                  <div className="flex items-center gap-1.5 mb-1">
                    <span 
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: color }}
                    >
                      {inc.urgency}
                    </span>
                    <span className="text-[10px] font-semibold text-[#6B7280] bg-slate-100 px-2 py-0.5 rounded-full">
                      {inc.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-[#1F2937] line-clamp-2 leading-snug mb-1">
                    {inc.title}
                  </h4>
                  <p className="text-[11px] text-[#6B7280] line-clamp-1 mb-2">
                    📍 {inc.location.address}
                  </p>
                  <button
                    onClick={() => onSelectIncident?.(inc)}
                    className="w-full py-1.5 bg-[#1E5EFF] hover:bg-blue-700 text-white text-[11px] font-semibold rounded-lg transition text-center block"
                  >
                    Voir le signalement
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
