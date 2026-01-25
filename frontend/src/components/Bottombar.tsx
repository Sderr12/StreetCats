import { FaMap } from "react-icons/fa6"
import { PiBinocularsFill } from "react-icons/pi"
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
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white backdrop-blur-md border-t border-gray-200 shadow-2xl flex justify-around items-center h-12 z-50 dark:bg-slate-900 dark:border-gray-800">
      <button
        className="flex flex-col items-center justify-center gap-1 hover:text-amber-400 transition-colors p-2"
        onClick={() => navigate("/map")}
      >
        <FaMap className="text-amber-400 h-6 w-6"></FaMap>
        <span className="text-xs font-medium text-white">Map</span>
      </button>

      <button
        className="flex flex-col items-center justify-center gap-1 text-amber-400 transition-colors p-2"
        onClick={() => navigate("/home")}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center -mt-6 shadow-lg">
          <img src={home} alt="home" className="w-6 h-6 brightness-0 invert" />
        </div>
        <span className="text-xs font-medium">Home</span>
      </button>

      <button
        className="flex flex-col items-center justify-center gap-1 text-black hover:text-amber-400 transition-colors p-2"
        onClick={handleClick}
      >
        <PiBinocularsFill className="text-amber-400 h-6 w-6"></PiBinocularsFill>
        <span className="text-xs font-medium dark:text-white">Spot</span>
      </button>
    </div>
  )
}

export default Bottombar;
