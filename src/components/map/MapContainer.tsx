import React from 'react';
import { MapContainer as LeafletMap, TileLayer, useMapEvents, Circle, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAnalysisStore } from '../../store/analysisStore';

// Fix for default marker icon in leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapEvents = () => {
  const setLocation = useAnalysisStore((state) => state.setLocation);
  useMapEvents({
    click(e) {
      setLocation(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

export const MapContainer: React.FC = () => {
  const { lat, lon, radius_m } = useAnalysisStore();

  return (
    <div style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative', zIndex: 10 }}>
      <LeafletMap 
        center={[lat, lon]} 
        zoom={13} 
        style={{ height: '100%', width: '100%', background: 'transparent' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapEvents />
        <Marker position={[lat, lon]} />
        <Circle 
          center={[lat, lon]} 
          radius={radius_m} 
          pathOptions={{ color: 'var(--accent-primary)', fillColor: 'var(--accent-primary)', fillOpacity: 0.15, weight: 2 }} 
        />
      </LeafletMap>
    </div>
  );
};
