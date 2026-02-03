import { useNavigate } from "react-router-dom";
import logo from '../assets/onlycat-removebg-preview.png';
import { AuthContext } from "../context/AuthProvider";
import { useContext } from "react";
import Avatar from "./Avatar";
import ThemeToggle from "../components/DarkModeToggle.tsx"

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
    <div className='h-16 w-full fixed top-0 left-0 bg-white border-b dark:border-b-gray-800 border-b-gray-300 shadow-md z-50 grid grid-cols-3 items-center px-6 dark:bg-slate-900'>
      {/* Logo a sinistra */}
      <div className="flex items-center gap-3 cursor-pointer justify-start" onClick={() => navigate("/home")}>
        <img src={logo} alt="Logo" className="h-10" />
        <span className="hidden md:inline text-2xl text-amber-300 text-opacity-80 font-semibold">StreetCats</span>
      </div>

      <div className="hidden lg:flex items-center gap-8 text-lg text-black dark:text-white font-medium justify-center">
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

      <div className="lg:hidden"></div>

      <div className="flex items-center justify-end">
        {user ? (
          <Avatar
            avatarUrl={user.avatarUrl}
            username={user.username}
            size="md"
            onClick={() => navigate("/self")}
          />
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-[#a6ba28] hover:bg-[#81941c] text-white font-semibold rounded-lg transition-colors text-sm"
          >
            Login
          </button>
        )}
      </div>
    </div>
  )
}

export default Topbar;
