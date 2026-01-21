import binoculars from '../assets/binoculars-white.png'
import map from '../assets/map-white.png'
import home from '../assets/home-white.png'
import useAuth from '../hooks/useAuth.ts'

import { useNavigate } from 'react-router-dom'

const Bottombar = () => {
  const navigate = useNavigate()
  const { user } = useAuth();
  
  const handleClick = () => {
    if (!user) {
      navigate("/login", { replace: true });
    } else {
      navigate("/spot");
    }
  };


  return (
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white backdrop-blur-md border-t border-gray-200 shadow-2xl flex justify-around items-center h-12 z-50">
        <button 
          className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-amber-400 transition-colors p-2"
          onClick={() => navigate("/map")}
        >
          <img src={map} alt="map" className="w-6 h-6" />
          <span className="text-xs font-medium">Map</span>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center gap-1 text-amber-400 transition-colors p-2"
          onClick={() => navigate("/home")}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center -mt-6 shadow-lg">
            <img src={home} alt="home" className="w-6 h-6 brightness-0 invert" />
          </div>
          <span className="text-xs font-medium mt-1">Home</span>
        </button>
        
        <button 
          className="flex flex-col items-center justify-center gap-1 text-black hover:text-amber-400 transition-colors p-2"
          onClick={handleClick}
        >
          <img src={binoculars} alt="spot" className="w-6 h-6 text-black" />
          <span className="text-xs font-medium">Spot</span>
        </button>
      </div>
  )
}

export default Bottombar;
