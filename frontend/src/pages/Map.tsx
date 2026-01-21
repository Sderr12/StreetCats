import { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Catcard from "../components/Catcard";
import Searchbar from "../components/Searchbar";
import cat_white from '../assets/cat-white.png'
import "leaflet/dist/leaflet.css";

const catIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const RecenterMap = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15, { duration: 1.5 }); 
  }, [center, map]);
  return null;
};

const Map = () => {
  const [userPosition, setUserPosition] = useState<[number, number]>([
    41.212, 13.576,
  ]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    41.212, 13.576,
  ]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const position: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserPosition(position);
          setMapCenter(position);
        },
        (err) => {
          console.warn("Error recovering position", err);
        }
      );
    }
  }, []);

  const handleLocationSearch = async (query: string) => {
    console.log("Cercando:", query);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );
      const data = await response.json();
      console.log("Risultati:", data);
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newCenter: [number, number] = [parseFloat(lat), parseFloat(lon)];
        console.log("Nuove coordinate:", newCenter);
        setMapCenter(newCenter);
      } else {
        console.log("Nessun risultato trovato per:", query);
      }
    } catch (error) {
      console.error("Errore nella ricerca:", error);
    }
  };

  return (
    <div className="mt-20 flex flex-col md:flex-row w-full h-[calc(100vh-5rem)]">
      {/* Sidebar desktop */}
      <div className="hidden lg:flex flex-col items-center w-1/3 h-full bg-white p-4 border-r border-amber-200 overflow-y-auto">
        <Searchbar onSearch={handleLocationSearch} />

        <div className="w-full flex items-center justify-center my-4">
          <div className="flex-grow w-1/2 border-t border-t-2 border-amber-200 opacity-70 px-2"></div>
          <span className="mx-3 text-amber-400 opacity-70 font-semibold text-lg whitespace-nowrap">
            Cats around you
          </span>
          <div className="flex-grow w-1/2 border-t border-t-2 border-amber-200 opacity-70"></div>
        </div>

        {/* Cards */}
        <div className="flex flex-col items-center gap-3 w-full">
          <Catcard />
          <Catcard />
          <Catcard />
          <Catcard />
          <Catcard />
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={userPosition}
          zoom={15}
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={userPosition} icon={catIcon}>
            <Popup>You are here!</Popup>
          </Marker>

          <RecenterMap center={mapCenter} />
        </MapContainer>

        {/* Button on mobile to open slider */}
        <button
          onClick={() => setIsSliderOpen(true)}
          className="box flex items-center gap-2 absolute bottom-20 right-4 bg-amber-400 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg lg:hidden transition-all"
        >
          <img src={cat_white} alt={"cat"} className="h-6 w-6" />
          <p> Around you</p>
        </button>

        {/* Slider mobile */}
        <div
          className={`fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-lg flex flex-col transition-transform duration-300 ${
            isSliderOpen ? "translate-y-0" : "translate-y-full"
          }`}
          style={{ height: "70vh" }}
        >
          {/* Slider's topbar */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white rounded-t-2xl flex-shrink-0">
            <h2 className="text-lg font-semibold text-amber-900 text-opacity-80">
              Cats around you
            </h2>
            <button
              onClick={() => setIsSliderOpen(false)}
              className="text-gray-600 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-4 px-3 py-4">
            <div className="flex flex-col items-center w-full gap-4">
              <Catcard />
              <Catcard />
              <Catcard />
              <Catcard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
