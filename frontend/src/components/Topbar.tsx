import { useNavigate } from "react-router-dom";
import logo from '../assets/onlycat-removebg-preview.png'
import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react"

const Topbar = () => {
  const navigate = useNavigate();
  const useAuth = useContext(AuthContext);
  if (!useAuth) { throw new Error("Must be inside authprovider") }
  const { user } = useAuth;
  
  const handleClick = () => {
    if (!user) { navigate("/login", { replace: true }) }
    else { navigate("/spot") }
  }
  
  return (
    <div className='w-full fixed z-50 left-0 top-0 right-0 h-16 bg-white border-b border-b-gray-300 shadow-md flex items-center justify-between px-6'>
      {/* Logo a sinistra */}
      <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => navigate("/home")}>
        <img src={logo} alt="Logo" className="h-10" />
        <span className="hidden md:inline text-2xl text-amber-300 text-opacity-80 font-semibold">StreetCats</span>
      </div>
      
      {/* Menu centrale */}
      <div className="hidden lg:flex items-center gap-8 text-lg text-black font-medium absolute left-1/2 transform -translate-x-1/2">
        <button
          className="hover:text-amber-400 transition-colors"
          onClick={() => navigate("/home")}
        >
          Home
        </button>
        <button
          className="hover:text-amber-400 transition-colors"
          onClick={() => navigate("/map")}
        >
          Map
        </button>
        <button
          className="hover:text-amber-400 transition-colors"
          onClick={handleClick}
        >
          Spot
        </button>
      </div>
      
      {/* Profilo a destra */}
      <div className="flex items-center gap-3 flex-1 justify-end">
        <img
          src="https://i.pravatar.cc/150?img=8"
          alt="Profile"
          className="w-10 h-10 rounded-full cursor-pointer border border-white/40 bg-amber-200"
          onClick={() => navigate("/self")}
        />
        {/* Menu burger solo su mobile */}
        <button className="lg:hidden p-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Topbar;
