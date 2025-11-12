import { useNavigate } from "react-router-dom";
import logo from '../assets/onlycat-removebg-preview.png'

const Topbar = () => {
  const navigate = useNavigate();

  return (
    <div
      className='h-20 w-full fixed top-0 left-0 bg-white border-b border-b-gray-300 shadow-md z-50 flex items-center justify-between px-6'>
      < div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/home")}>
        <img src={logo} alt="Logo" className="h-10" />
        <span className="hidden md:inline text-2xl text-amber-300 text-opacity-80 font-semibold">StreetCats</span>
      </div >

      <div className="hidden lg:flex gap-8 text-lg text-black font-medium">
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
          onClick={() => navigate("/addCat")}
        >
          Spot
        </button>
      </div>

      {/* Sezione destra: profilo + menu mobile */}
      <div className="flex items-center gap-3">
        <img
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
    </div >
  )

}

export default Topbar;
