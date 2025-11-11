import { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Catcard from "../components/Catcard";
import cat_white from '../assets/cat-white.png'
import "leaflet/dist/leaflet.css";

const catIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});


const RecenterOnUser = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 15);
  }, [position, map]);
  return null;
};

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
  <RecenterOnUser position={userPosition} />
  return (
    <div className="mt-20 flex flex-col md:flex-row w-full h-[calc(100vh-5rem)]">
      {/* Sidebar desktop */}
      <div className="hidden lg:flex flex-col w-1/3 h-full bg-gray-300 p-4 border-r border-amber-200 overflow-y-auto">
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

          <RecenterOnUser position={userPosition} />
        </MapContainer>

        {/* Button on mobile to open slider */}
        <button
          onClick={() => setIsSliderOpen(true)}
          className="box flex items-center gap-2 absolute bottom-4 right-4 bg-amber-300 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg lg:hidden transition-all"
        >
          <img src={cat_white} alt={"cat"} className="h-6 w-6" />
          <p> Around you</p>
        </button>

        {/* Slider mobile */}
        <div
          className={`fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-lg flex flex-col transition-transform duration-300 ${isSliderOpen ? "translate-y-0" : "translate-y-full"
            }`}
          style={{ height: "70vh" }}         >
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
