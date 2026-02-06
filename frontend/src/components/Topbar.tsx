import { useNavigate } from "react-router-dom";
import logo from '../assets/onlycat-removebg-preview.png';
import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";
import Avatar from "./Avatar";

const Topbar = () => {
  const navigate = useNavigate();
  const useAuth = useContext(AuthContext);
  if (!useAuth) { throw new Error("Must be inside authprovider"); }
  const { user } = useAuth;

  const handleClick = () => {
    if (!user) { navigate("/login", { replace: true }) }
    else { navigate("/spot") }
  }

  return (
    <div className='h-16 w-full fixed top-0 left-0 bg-white border-b dark:border-b-gray-800 border-b-gray-300 shadow-md z-50 flex items-center px-4 md:px-6 dark:bg-slate-900'>

      <div className="flex-1 flex justify-start">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/home")}>
          <img src={logo} alt="Logo" className="h-8 md:h-10" />
          <span className="text-xl md:text-2xl text-amber-300 text-opacity-80 font-semibold tracking-tight">StreetCats</span>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 justify-center items-center gap-8 text-lg text-black dark:text-white font-medium">
        <button className="hover:text-amber-400 transition-colors" onClick={() => navigate("/home")}>Home</button>
        <button className="hover:text-amber-400 transition-colors" onClick={() => navigate("/map")}>Map</button>
        <button className="hover:text-amber-400 transition-colors" onClick={handleClick}>Spot</button>
      </div>

      <div className="flex-1 flex items-center justify-end gap-3 md:gap-6">
        <button
          className="flex items-center hover:opacity-70 transition-opacity"
          title="Switch Language"
        >
          <img
            src="https://flagcdn.com/w40/gb.png"
            alt="English"
            className="w-5 h-3.5 md:w-6 md:h-4 object-cover rounded-sm shadow-sm"
          />
        </button>

        {user ? (
          <Avatar
            avatarUrl={user.avatarUrl}
            username={user.username}
            size="md"
          />
        ) : (
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-stone-600 dark:text-stone-300 hover:text-amber-500 font-semibold transition-colors text-xs md:text-sm"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-3 py-1.5 md:px-5 md:py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md shadow-lg transition-all text-[10px] md:text-sm uppercase tracking-wide whitespace-nowrap"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Topbar;
