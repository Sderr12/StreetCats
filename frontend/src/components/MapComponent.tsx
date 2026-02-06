import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import Avatar from "./Avatar.tsx";
import "../pages/map.css";

// --- CUSTOM ICONS ---
const createSelectionIcon = () => L.divIcon({
  html: renderToStaticMarkup(
    <div className="flex flex-col items-center animate-bounce">
      <div className="w-11 h-11 bg-amber-500 dark:bg-amber-600 rounded-full border-[3px] border-white dark:border-slate-800 shadow-2xl flex items-center justify-center text-white">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21c-4.5 0-8-3.5-8-8 0-3.5 3-6.5 4-7l2 2h4l2-2c1 .5 4 3.5 4 7 0 4.5-3.5 8-8 8z" />
          <path d="M9 13h.01M15 13h.01" />
          <path d="M11 16h2" />
        </svg>
      </div>
      <div className="w-3 h-3 bg-amber-600 dark:bg-amber-400 rounded-full mt-1 border-2 border-white dark:border-slate-800 shadow-lg"></div>
    </div>
  ),
  className: "", iconSize: [44, 54], iconAnchor: [22, 54]
});

const createCatMarkerIcon = (imageUrl: string, title: string) => L.divIcon({
  html: renderToStaticMarkup(
    <div className="relative flex flex-col items-center justify-center w-12 h-14 drop-shadow-xl">
      <div className="w-10 h-10 rounded-full border-[2.5px] border-orange-500 bg-white overflow-hidden flex items-center justify-center z-10 shadow-sm">
        <img src={imageUrl || 'https://via.placeholder.com/100?text=Cat'} alt={title} className="w-full h-full object-cover min-w-full min-h-full block" />
      </div>
      <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-orange-500 -mt-[2px]"></div>
    </div>
  ),
  className: "cat-marker-container", iconSize: [48, 56], iconAnchor: [24, 52], popupAnchor: [0, -50],
});

const createUserIcon = (name: string, avatarUrl?: string) => L.divIcon({
  html: renderToStaticMarkup(
    <div className="flex flex-col items-center">
      <Avatar avatarUrl={avatarUrl} username={name} size="md" className="border-2 border-amber-500 shadow-xl" />
      <div className="bg-white/90 dark:bg-slate-800/90 px-2 py-0.5 rounded-full shadow-md border border-gray-200 -mt-1 z-10 text-[10px] font-black uppercase dark:text-white transition-colors">You</div>
    </div>
  ),
  className: "custom-user-marker", iconSize: [40, 60], iconAnchor: [20, 60],
});

// --- MAP EVENTS LOGIC ---
const MapEvents = ({
  onCenterChange,
  onMapClick
}: {
  onCenterChange?: (lat: number, lng: number) => void;
  onMapClick?: (lat: number, lng: number) => void;
}) => {
  const map = useMapEvents({
    // moveend per la MapPage (ordinamento lista)
    moveend: () => {
      const center = map.getCenter();
      if (onCenterChange) onCenterChange(center.lat, center.lng);
    },
    // click per AddCat (posizionamento marker)
    click: (e) => {
      if (onMapClick) onMapClick(e.latlng.lat, e.latlng.lng);
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 300);
    return () => clearTimeout(timer);
  }, [map]);

  return null;
};

const RecenterMap = ({ center, shouldRecenter }: { center: [number, number]; shouldRecenter: boolean }) => {
  const map = useMap();
  useEffect(() => {
    if (shouldRecenter && center && center[0] !== 0) {
      map.flyTo(center, map.getZoom(), { duration: 1.5 });
    }
  }, [center, shouldRecenter, map]);
  return null;
};

interface MapComponentProps {
  cats: any[];
  userPosition: [number, number];
  selectedCatPos?: [number, number];
  programmaticCenter?: [number, number];
  shouldRecenter?: boolean;
  user: any;
  onCenterChange?: (lat: number, lng: number) => void;
  onMapClick?: (lat: number, lng: number) => void; // Aggiunta prop
  onSeeProfile?: (id: string) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  cats, userPosition, selectedCatPos, programmaticCenter, shouldRecenter, user, onCenterChange, onMapClick, onSeeProfile
}) => {
  return (
    <MapContainer center={userPosition} zoom={15} className="w-full h-full z-0" attributionControl={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <MapEvents onCenterChange={onCenterChange} onMapClick={onMapClick} />

      {programmaticCenter && <RecenterMap center={programmaticCenter} shouldRecenter={shouldRecenter || false} />}

      <Marker position={userPosition} icon={createUserIcon(user?.username || "Me", user?.avatarUrl)} />

      {selectedCatPos && selectedCatPos[0] !== 0 && (
        <Marker position={selectedCatPos} icon={createSelectionIcon()} />
      )}

      {cats.map((cat) => (
        <Marker
          key={cat.id}
          position={[cat.latitude, cat.longitude]}
          icon={createCatMarkerIcon(cat.photo, cat.title)}
          eventHandlers={{ click: () => onSeeProfile?.(cat.id) }}
        />
      ))}
    </MapContainer>
  );
};

export default React.memo(MapComponent);
