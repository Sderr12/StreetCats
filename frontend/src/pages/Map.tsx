import { useState, useEffect, useCallback, useMemo, useContext } from "react";
import { useMap, useMapEvents, MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Catcard from "../components/Catcard";
import Searchbar from "../components/Searchbar";
import cat_white from "../assets/cat-white.png";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { renderToStaticMarkup } from "react-dom/server";
import Avatar from "../components/Avatar.tsx";
import { AuthContext } from "../context/AuthProvider";
import { Navigation } from "lucide-react";


const createCatMarkerIcon = (imageUrl: string, title: string) => {
  return L.divIcon({
    html: renderToStaticMarkup(
      <div className="relative flex items-center justify-center w-12 h-14 drop-shadow-[0_10px_8px_rgba(0,0,0,0.3)] hover:drop-shadow-[0_15px_12px_rgba(0,0,0,0.4)] transition-all duration-300">
        <div className="w-10 h-10 rounded-full border-[2.5px] border-orange-500 bg-white overflow-hidden flex items-center justify-center">
          <img
            src={imageUrl || 'https://via.placeholder.com/100?text=Cat'}
            alt={title}
            className="w-full h-full object-cover min-w-full min-h-full"
            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/100?text=Cat')}
          />
        </div>
        <div className="absolute bottom-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-orange-500"></div>
      </div>
    ),
    className: "cat-marker-container",
    iconSize: [48, 56],
    iconAnchor: [24, 56],
    popupAnchor: [0, -50],
  });
};

const createUserIcon = (name: string, avatarUrl?: string) => {
  return L.divIcon({
    html: renderToStaticMarkup(
      <div className="flex flex-col items-center">
        <div className="relative">
          <Avatar
            avatarUrl={avatarUrl}
            username={name}
            size="md"
            className="border-2 border-amber-500 shadow-xl"
          />
        </div>
        <div className="bg-white/90 dark:bg-slate-800/90 px-2 py-0.5 rounded-full shadow-md border border-gray-200 dark:border-slate-700 -mt-1 z-10">
          <span className="text-[10px] font-black text-gray-800 dark:text-white uppercase tracking-tighter">
            You
          </span>
        </div>
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white dark:border-t-slate-800 drop-shadow-sm"></div>
      </div>
    ),
    className: "custom-user-marker",
    iconSize: [40, 60],
    iconAnchor: [20, 60],
  });
};

const DEFAULT_POSITION: [number, number] = [41.212, 13.576];
const MAP_ZOOM = 15;
const FETCH_DEBOUNCE_MS = 600;
const NEARBY_RADIUS_KM = 10;

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
    if (shouldRecenter) map.flyTo(center, MAP_ZOOM, { duration: 1.5 });
  }, [center, shouldRecenter, map]);
  return null;
};

const Map = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [userPosition, setUserPosition] = useState<[number, number]>(DEFAULT_POSITION);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_POSITION);
  const [programmaticCenter, setProgrammaticCenter] = useState<[number, number]>(DEFAULT_POSITION);
  const [shouldRecenter, setShouldRecenter] = useState(false);
  const [cats, setCats] = useState<Cat[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchNearbyCats = useCallback(async (lat: number, lon: number) => {
    try {
      const { data } = await api.get<Cat[]>("/cats/nearby", {
        params: { lat, lon, radius: NEARBY_RADIUS_KM },
      });
      setCats(data);
    } catch (err) {
      console.error("Fetch nearby cats failed:", err);
    }
  }, []);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const p: [number, number] = [pos.coords.latitude, pos.coords.longitude];
      setUserPosition(p);
      setMapCenter(p);
      setProgrammaticCenter(p);
      setShouldRecenter(true);
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchNearbyCats(mapCenter[0], mapCenter[1]), FETCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [mapCenter, fetchNearbyCats]);

  const handleUserCenterChange = useCallback((lat: number, lng: number) => {
    setMapCenter([lat, lng]);
    setShouldRecenter(false);
  }, []);

  const handleRecenterClick = () => {
    setProgrammaticCenter(userPosition);
    setShouldRecenter(true);
    setTimeout(() => setShouldRecenter(false), 2000);
  };

  const catMarkers = useMemo(
    () =>
      cats.map((cat) => (
        <Marker
          key={cat.id}
          position={[cat.latitude, cat.longitude]}
          icon={createCatMarkerIcon(cat.photo, cat.title)}
        >
          <Popup>
            <div className="flex flex-col items-center gap-2 px-1 text-center">
              <h3 className="font-bold text-stone-700">{cat.title}</h3>
              <button
                onClick={() => navigate(`/catdetails/${cat.id}`)}
                className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full hover:bg-orange-600 transition-colors"
              >
                See profile
              </button>
            </div>
          </Popup>
        </Marker>
      )),
    [cats, navigate]
  );

  const SectionHeader = () => (
    <div className="flex items-center gap-2 justify-center">
      <h2 className="text-stone-700 dark:text-stone-200 font-semibold text-lg tracking-wide">
        Nearby Cats
      </h2>
      <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
        {cats.length}
      </span>
    </div>
  );

  const CatList = () => (
    <div className="flex flex-col gap-2.5">
      {cats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-stone-400 dark:text-stone-500 text-sm italic">No cats spotted nearby…</p>
        </div>
      ) : (
        cats.map((cat, i) => (
          <div key={cat.id} className="animate-card-up" style={{ animationDelay: `${i * 0.055}s` }}>
            <Catcard cat={cat} />
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="map-root mt-16 flex flex-row w-full h-[calc(100vh-64px)] overflow-hidden bg-stone-50 dark:bg-slate-800 relative">
      <aside className="hidden lg:flex flex-col w-80 min-w-[320px] border-r border-stone-200 dark:border-slate-600 bg-white/70 dark:bg-slate-800/75 backdrop-blur-lg overflow-y-auto z-20 px-5 py-7 gap-5">
        <Searchbar onSearch={(q) => console.log(q)} />
        <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        <SectionHeader />
        <CatList />
      </aside>

      <div className="flex-1 p-3 lg:p-4 flex relative overflow-hidden">
        <div className="flex-1 rounded-2xl overflow-hidden shadow-lg border border-black/5 z-0 relative">
          <MapContainer center={userPosition} zoom={MAP_ZOOM} className="w-full h-full" attributionControl={false}>
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEvents onCenterChange={handleUserCenterChange} />
            <RecenterMap center={programmaticCenter} shouldRecenter={shouldRecenter} />
            <Marker position={userPosition} icon={createUserIcon(user?.username || "Me", user?.avatarUrl)} />
            {catMarkers}
          </MapContainer>

          <button
            onClick={handleRecenterClick}
            className="absolute top-4 right-4 z-[500] flex items-center justify-center w-10 h-10 bg-white dark:bg-slate-800 border-2 border-amber-500/30 rounded-xl shadow-lg hover:bg-stone-50 dark:hover:bg-slate-700 transition-all active:scale-95 text-amber-600 dark:text-amber-400 group"
            title="Recenter on me"
          >
            <Navigation size={18} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="lg:hidden absolute bottom-8 right-8 z-[500] w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 border-[3px] border-white shadow-xl flex items-center justify-center active:scale-90 transition-transform dark:border-slate-800"
        >
          <img src={cat_white} alt="cats" className="w-7 h-7 transition-all duration-300 dark:invert dark:opacity-80" />
          {cats.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-white text-white text-[10px] font-bold flex items-center justify-center">
              {cats.length}
            </span>
          )}
        </button>
      </div>

      {isDrawerOpen && (
        <>
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/50 z-[2000] animate-fade-in lg:hidden"
          />
          <div
            className="fixed left-0 right-0 bottom-0 z-[2001] bg-white dark:bg-stone-900 rounded-t-3xl shadow-2xl flex flex-col animate-drawer-up lg:hidden"
            style={{ height: '70vh' }}
          >
            <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto my-3" />
            <div className="px-6 py-2 flex justify-between items-center">
              <SectionHeader />
              <button onClick={() => setIsDrawerOpen(false)} className="text-2xl text-stone-400">×</button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-10">
              <CatList />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Map;
