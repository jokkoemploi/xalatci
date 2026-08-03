import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LocationPickerMapProps {
  position: [number, number];
  onPositionChange: (pos: [number, number]) => void;
  height?: string;
}

function LocationMarker({ position, onPositionChange }: { position: [number, number]; onPositionChange: (pos: [number, number]) => void }) {
  const map = useMap();
  
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });

  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);

  return <Marker position={position} draggable={true} eventHandlers={{
    dragend(e) {
      const marker = e.target;
      if (marker) {
        const latLng = marker.getLatLng();
        onPositionChange([latLng.lat, latLng.lng]);
      }
    }
  }} />;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  position,
  onPositionChange,
  height = '100%',
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div style={{ height }} className="w-full bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
        Chargement de la carte GPS...
      </div>
    );
  }

  return (
    <div style={{ height }} className="w-full relative rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      <MapContainer 
        center={position} 
        zoom={14} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} onPositionChange={onPositionChange} />
      </MapContainer>
    </div>
  );
};
