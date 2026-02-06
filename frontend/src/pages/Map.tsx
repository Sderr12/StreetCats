import React, { useState, useEffect, useCallback, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthProvider";
import MapComponent from "../components/MapComponent";
import Catcard from "../components/Catcard";
import { Navigation, X, Loader2 } from "lucide-react";
import cat_white from "../assets/cat-white.png";

const DEFAULT_POSITION: [number, number] = [41.212, 13.576];

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2));
};

const CatListContent = React.memo(({ cats }: { cats: any[] }) => (
  <div className="flex flex-col gap-2.5">
    {cats.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-stone-400 text-sm italic">No cats spotted nearby…</p>
      </div>
    ) : (
      cats.map((cat) => (
        <div key={cat.id} className="animate-card-up">
          <Catcard cat={cat} />
        </div>
      ))
    )}
  </div>
));

const MapPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [userPosition, setUserPosition] = useState<[number, number]>(DEFAULT_POSITION);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_POSITION);
  const [programmaticCenter, setProgrammaticCenter] = useState<[number, number]>(DEFAULT_POSITION);
  const [shouldRecenter, setShouldRecenter] = useState(false);
  const [cats, setCats] = useState<any[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const fetchNearbyCats = useCallback(async (lat: number, lon: number) => {
    setIsFetching(true);
    try {
      const { data } = await api.get("/cats/nearby", { params: { lat, lon, radius: 10 } });
      setCats(data);
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const p: [number, number] = [pos.coords.latitude, pos.coords.longitude];
      setUserPosition(p);
      setMapCenter(p);
      setProgrammaticCenter(p);
      setShouldRecenter(true);
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchNearbyCats(mapCenter[0], mapCenter[1]), 600);
    return () => clearTimeout(t);
  }, [mapCenter, fetchNearbyCats]);

  const sortedCats = useMemo(() => {
    if (!cats.length) return [];
    return [...cats].sort((a, b) => {
      const distA = getDistance(mapCenter[0], mapCenter[1], a.latitude, a.longitude);
      const distB = getDistance(mapCenter[0], mapCenter[1], b.latitude, b.longitude);
      return distA - distB;
    });
  }, [cats, mapCenter]);

  const memoizedCatList = useMemo(() => <CatListContent cats={sortedCats} />, [sortedCats]);

  return (
    <div className="map-root mt-16 flex flex-row w-full h-[calc(100vh-64px)] overflow-hidden bg-stone-50 dark:bg-slate-800 relative z-10">

      <aside className="hidden lg:flex flex-col w-80 border-r border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-y-auto z-20 px-5 py-7 gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-stone-700 dark:text-stone-200 font-semibold text-left">Nearby Cats</h2>
            <span className="bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full">{cats.length}</span>
          </div>
          {isFetching && <Loader2 className="animate-spin text-orange-500" size={16} />}
        </div>
        {memoizedCatList}
      </aside>

      {/* MAIN MAP AREA */}
      <main className="flex-1 relative h-full w-full z-10">
        <div className="w-full h-full relative z-0 text-left">
          <MapComponent
            cats={cats}
            userPosition={userPosition}
            programmaticCenter={programmaticCenter}
            shouldRecenter={shouldRecenter}
            user={user}
            onCenterChange={(lat, lng) => {
              setMapCenter([lat, lng]);
              if (shouldRecenter) setShouldRecenter(false);
            }}
            onSeeProfile={(id) => navigate(`/catdetails/${id}`)}
          />

          <button
            onClick={() => { setProgrammaticCenter(userPosition); setShouldRecenter(true); }}
            className="absolute top-4 right-4 z-[40] w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center text-amber-600 border border-stone-100 dark:border-slate-700 active:scale-95 transition-all"
          >
            <Navigation size={22} fill="currentColor" />
          </button>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="lg:hidden absolute bottom-20 left-1/2 -translate-x-1/2 z-[40] px-8 py-4 rounded-full bg-orange-600 text-white shadow-[0_10px_30px_rgba(234,88,12,0.4)] flex items-center gap-3 border-2 border-white/20 active:scale-90 transition-all font-bold"
          >
            {isFetching ? <Loader2 className="animate-spin" size={24} /> : <img src={cat_white} className="w-6 h-6" alt="cats" />}
            <span className="uppercase text-sm tracking-widest">See {cats.length} cats</span>
          </button>
        </div>
      </main>

      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
        <div className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-[40px] shadow-2xl transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) flex flex-col ${isDrawerOpen ? 'translate-y-0' : 'translate-y-full'}`} style={{ height: '75vh' }}>
          <div className="flex-shrink-0" onClick={() => setIsDrawerOpen(false)}>
            <div className="w-16 h-1.5 bg-stone-300 dark:bg-slate-700 rounded-full mx-auto my-5" />
            <div className="px-8 pb-6 flex justify-between items-center text-left">
              <div>
                <h2 className="text-2xl font-black text-stone-800 dark:text-white uppercase tracking-tighter">Nearby Cats</h2>
                <p className="text-stone-500 text-xs"> {cats.length} cats around</p>
              </div>
              <button className="p-3 bg-stone-100 dark:bg-slate-800 rounded-2xl text-stone-500">
                <X size={24} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-12">
            <div className="bg-stone-50 dark:bg-slate-800/50 rounded-3xl p-4">
              {memoizedCatList}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
