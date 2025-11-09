import { useNavigate } from "react-router-dom";
import logo from '../assets/street.png'

const Topbar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between w-full h-20 bg-amber-100 px-4 sm:px-8">
      <img
        src={logo}
        alt="Logo"
        className="h-11 cursor-pointer"
        onClick={() => navigate("/home")}
      />

      <div className="flex items-center gap-2 md:gap-1">
        <img
          //src={auth?.image || ""}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full cursor-pointer"
          onClick={() => navigate("/self")}
        />

        <div className="flex items-center md:hidden ml-2">
          <button className="p-2 focus:outline-none">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )

}

export default Topbar;
