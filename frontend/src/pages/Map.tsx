import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useMap, useMapEvents, MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import Catcard from "../components/Catcard";
import Searchbar from "../components/Searchbar";
import cat_white from '../assets/cat-white.png';
import "leaflet/dist/leaflet.css";

const catIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/616/616430.png",
  iconSize: [30, 30],
  iconAnchor: [22.5, 45],
  popupAnchor: [0, -45],
});

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/219/219983.png",
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -45],
});

const MapEvents = ({ onCenterChange }: { onCenterChange: (lat: number, lng: number) => void }) => {
  const map = useMapEvents({
    dragend: () => onCenterChange(map.getCenter().lat, map.getCenter().lng),
    zoomend: () => onCenterChange(map.getCenter().lat, map.getCenter().lng),
  });
  return null;
};

const RecenterMap = ({ center, shouldRecenter }: { center: [number, number], shouldRecenter: boolean }) => {
  const map = useMap();
  useEffect(() => {
    if (shouldRecenter) map.flyTo(center, 15, { duration: 1.5 });
  }, [center, shouldRecenter, map]);
  return null;
};

const Map = () => {
  const navigate = useNavigate();
  const [userPosition, setUserPosition] = useState<[number, number]>([41.212, 13.576]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([41.212, 13.576]);
  const [programmaticCenter, setProgrammaticCenter] = useState<[number, number]>([41.212, 13.576]);
  const [shouldRecenter, setShouldRecenter] = useState(false);
  const [cats, setCats] = useState<any[]>([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  const fetchNearbyCats = useCallback(async (lat: number, lon: number) => {
    try {
      const response = await axios.get(`/cats/nearby`, { params: { lat, lon, radius: 10 } });
      setCats(response.data);
    } catch (error) {
      console.error("Errore radar:", error);
    }
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const p: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPosition(p); setMapCenter(p); setProgrammaticCenter(p); setShouldRecenter(true);
      });
    }
  }, []);

  useEffect(() => { fetchNearbyCats(mapCenter[0], mapCenter[1]); }, [mapCenter, fetchNearbyCats]);

  const handleUserCenterChange = useCallback((lat: number, lng: number) => {
    setMapCenter([lat, lng]);
    setShouldRecenter(false);
  }, []);

  const catMarkers = useMemo(() => cats.map((cat) => (
    <Marker key={cat.id} position={[cat.latitude, cat.longitude]} icon={catIcon}>
      <Popup>
        <div className="text-center p-1">
          <h3 className="font-bold mb-1">{cat.title}</h3>
          <button
            onClick={() => navigate(`/catdetails/${cat.id}`)}
            className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-orange-600 transition-all"
          >
            DETTAGLI
          </button>
        </div>
      </Popup>
    </Marker>
  )), [cats, navigate]);

  return (
    <div className="mt-20 flex flex-col lg:flex-row w-full h-[calc(100vh-5rem)] pb-16 lg:pb-0 overflow-hidden">

      {/* Sidebar Desktop */}
      <div className="hidden lg:flex flex-col w-1/3 bg-white dark:bg-slate-900 p-4 border-r border-amber-200 dark:border-slate-800 overflow-y-auto z-10">
        <Searchbar onSearch={(q) => console.log(q)} />
        <h2 className="my-6 text-amber-600 font-bold text-center border-b border-amber-100 pb-2 italic">Cats around</h2>
        <div className="flex flex-col gap-4">
          {cats.map(cat => <Catcard key={cat.id} cat={cat} />)}
        </div>
      </div>

      <div className="flex-1 relative z-0">
        <MapContainer center={userPosition} zoom={15} className="w-full h-full z-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents onCenterChange={handleUserCenterChange} />
          <RecenterMap center={programmaticCenter} shouldRecenter={shouldRecenter} />
          <Marker position={userPosition} icon={userIcon} />
          {catMarkers}
        </MapContainer>

        {/* Pulsante Mobile - z-index alto per stare sopra la mappa */}
        <button
          onClick={() => setIsSliderOpen(true)}
          className="fixed bottom-24 right-6 bg-amber-500 p-4 rounded-full lg:hidden z-[999] shadow-2xl border-2 border-white transform active:scale-90 transition-transform h-15 w-15"
        >
          <img src={cat_white} className="w-7 h-7" alt="cats" />
        </button>

        {/* Slider Mobile */}
        {isSliderOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 z-[1001] lg:hidden animate-fade-in" onClick={() => setIsSliderOpen(false)} />
            <div
              className="fixed bottom-0 w-full bg-white dark:bg-slate-900 rounded-t-3xl p-6 shadow-2xl z-[1002] lg:hidden h-[65vh] overflow-y-auto transition-all"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-amber-800 dark:text-amber-500">Gatti vicini</h3>
                <button onClick={() => setIsSliderOpen(false)} className="text-3xl text-gray-400 font-light">&times;</button>
              </div>
              <div className="flex flex-col gap-4 pb-20">
                {cats.map(cat => <Catcard key={cat.id} cat={cat} />)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Map;
