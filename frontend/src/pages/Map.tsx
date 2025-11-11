import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Catcard from "../components/Catcard";
import "leaflet/dist/leaflet.css";

const catIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const Map = () => {
  const [userPosition, setUserPosition] = useState<[number, number]>([
    41.212, 13.576,
  ]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.warn("Error recovering position", err);
        }
      );
    }
  }, []);

  return (
    <div className="mt-20 flex flex-col md:flex-row w-full h-[calc(100vh-5rem)]">
      {/* Sidebar desktop */}
      <div className="hidden lg:flex flex-col w-1/3 h-full bg-amber-50 p-4 border-r border-amber-200 overflow-y-auto">
        <input
          type="text"
          placeholder="🔍 Search for a city!"
          className="mb-4 p-2 rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400 top-60"
        />
        <div className="flex flex-col items-center gap-2 p-7">
          <Catcard />
          <Catcard />
          <Catcard />
          <Catcard />
          <Catcard />
        </div>
      </div>

      {/* Mappa */}
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
        </MapContainer>

        {/* Bottone mobile per aprire slider */}
        <button
          onClick={() => setIsSliderOpen(true)}
          className="absolute bottom-4 right-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg md:hidden transition-all"
        >
          😺 Cats around you
        </button>

        {/* Slider mobile */}
        <div
          className={`fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-lg transition-transform duration-300 ${isSliderOpen ? "translate-y-0" : "translate-y-full"
            }`}
        >
          {/* Barra superiore dello slider */}
          <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b border-gray-200 bg-white rounded-t-2xl">
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

          {/* Lista cat card */}
          <div className="p-4 overflow-y-auto max-h-[70vh] flex flex-col items-center gap-4">
            <Catcard />
            <Catcard />
            <Catcard />
            <Catcard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
