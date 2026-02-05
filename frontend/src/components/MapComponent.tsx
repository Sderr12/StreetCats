import React, { useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import Avatar from "./Avatar.tsx";
import "../pages/map.css"

const createCatMarkerIcon = (imageUrl: string, title: string) => L.divIcon({
  html: renderToStaticMarkup(
    <div className="relative flex items-center justify-center w-12 h-14 drop-shadow-md">
      <div className="w-10 h-10 rounded-full border-[2.5px] border-orange-500 bg-white overflow-hidden flex items-center justify-center">
        <img
          src={imageUrl || 'https://via.placeholder.com/100?text=Cat'}
          alt={title}
          className="w-full h-full object-cover min-w-full min-h-full block"
          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/100?text=Cat')}
        />
      </div>
      <div className="absolute bottom-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-orange-500"></div>
    </div>
  ),
  className: "cat-marker-container",
  iconSize: [48, 56],
  iconAnchor: [24, 56],
  popupAnchor: [0, -50],
});

const createUserIcon = (name: string, avatarUrl?: string) => L.divIcon({
  html: renderToStaticMarkup(
    <div className="flex flex-col items-center">
      <Avatar avatarUrl={avatarUrl} username={name} size="md" className="border-2 border-amber-500 shadow-xl" />
      <div className="bg-white/90 dark:bg-slate-800/90 px-2 py-0.5 rounded-full shadow-md border border-gray-200 -mt-1 z-10 text-[10px] font-black uppercase dark:text-white">You</div>
      <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white dark:border-t-slate-800"></div>
    </div>
  ),
  className: "custom-user-marker",
  iconSize: [40, 60], iconAnchor: [20, 60],
});

const MapEvents = ({ onCenterChange }: { onCenterChange: (lat: number, lng: number) => void }) => {
  const map = useMapEvents({
    dragend: () => onCenterChange(map.getCenter().lat, map.getCenter().lng),
    zoomend: () => onCenterChange(map.getCenter().lat, map.getCenter().lng),
  });
  return null;
};

const RecenterMap = ({ center, shouldRecenter }: { center: [number, number]; shouldRecenter: boolean }) => {
  const map = useMap();
  useEffect(() => {
    if (shouldRecenter) {
      map.flyTo(center, 15, { duration: 1.5 });
    }
  }, [center, shouldRecenter, map]);
  return null;
};

interface MapComponentProps {
  cats: any[];
  userPosition: [number, number];
  programmaticCenter: [number, number];
  shouldRecenter: boolean;
  user: any;
  onCenterChange: (lat: number, lng: number) => void;
  onSeeProfile: (id: string) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  cats, userPosition, programmaticCenter, shouldRecenter, user, onCenterChange, onSeeProfile
}) => {
  return (
    <MapContainer center={userPosition} zoom={15} className="w-full h-full z-0" attributionControl={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapEvents onCenterChange={onCenterChange} />
      <RecenterMap center={programmaticCenter} shouldRecenter={shouldRecenter} />

      <Marker position={userPosition} icon={createUserIcon(user?.username || "Me", user?.avatarUrl)} />

      {cats.map((cat) => (
        <Marker key={cat.id} position={[cat.latitude, cat.longitude]} icon={createCatMarkerIcon(cat.photo, cat.title)}>
          <Popup>
            <div className="flex flex-col items-center gap-2 px-1 text-center">
              <h3 className="font-bold text-stone-700">{cat.title}</h3>
              <button onClick={() => onSeeProfile(cat.id)} className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                See profile
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default React.memo(MapComponent);
