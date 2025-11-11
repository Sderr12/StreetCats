import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import streetimage from "../assets/siamese-cat-new.png";
import logo from "../assets/onlycat-removebg-preview.png";
import binoculars from '../assets/binoculars-white.png'
import map from '../assets/map-white.png'
import home from '../assets/home-white.png'

const Home = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const secondSection = document.getElementById("second");
      if (secondSection) {
        const top = secondSection.getBoundingClientRect().top;
        setScrolled(top <= 80);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full overflow-y-scroll">
      <section className="relative h-screen w-full">
        <div
          className="absolute inset-0 bg-cover bg-center lg:bg-[center_40%]"
          style={{ backgroundImage: `url(${streetimage})` }}
        />
        <div className="absolute inset-0 bg-black/50" />

        <div
          className={`fixed top-0 shadow-md left-0 w-full flex items-center justify-between h-20 px-4 sm:px-8 z-50 transition-colors duration-300 ${scrolled ? "bg-white shadow-md text-black" : "bg-transparent text-white"
            }`}
        >
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/home")}>
            <img src={logo} alt="Logo" className="h-10" />
            <span className="hidden lg:inline text-2xl text-amber-300 text-opacity-80 font-semibold">StreetCats</span>
          </div>

          <div className="hidden lg:flex gap-8 text-lg font-medium">
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
          </div>

          {/* Sezione destra: profilo + menu mobile */}
          <div className="flex items-center gap-3">
            <img
              className="w-10 h-10 rounded-full cursor-pointer border border-white/40"
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

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-start justify-center h-full p-10 md:p-20 lg:pl-40  lg:top-30 top-30">
          <h1 className="text-4xl md:text-6xl font-serif text-amber-300 drop-shadow-xl">
            Welcome on <span className="font-bold text-white">StreetCats</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-100 mt-4 font-light">
            Help the cat's distribution system find its way!
          </p>
          <button className="mt-6 px-6 py-3 bg-amber-400 opacity-90 hover:bg-amber-500 text-white font-semibold rounded-full transition-all duration-300">
            Spot a stray cat
          </button>
        </div>
      </section>

      {/* Second Section */}
      <section
        id="second"
        className="w-full h-screen bg-gray-400 flex items-center justify-center"
      >
        <h2 className="text-4xl font-bold text-white">Second Section</h2>
      </section>



      <footer className="bg-gray-900 text-gray-300 py-8 px-6 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">StreetCats</h3>
            <p className="text-sm text-gray-400">
              Let's help cats, one pawn at time! 🐾
            </p>
          </div>

          <div>
            <h4 className="text-md font-semibold text-white mb-2">Explore</h4>
            <ul className="space-y-1">
              <li><a href="/home" className="hover:text-amber-400">Home</a></li>
              <li><a href="/map" className="hover:text-amber-400">Map</a></li>
              <li><a href="/about" className="hover:text-amber-400">Who are we?</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold text-white mb-2">Support</h4>
            <ul className="space-y-1">
              <li><a href="/contact" className="hover:text-amber-400">Contacts</a></li>
              <li><a href="/privacy" className="hover:text-amber-400">Privacy</a></li>
              <li><a href="/terms" className="hover:text-amber-400">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} StreetCats — All rights reserved.
        </div>
      </footer>

      <div className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-t-gray-300 shadow-md flex justify-around items-center h-12 z-50">
        <button className="bg-amber-400 w-9 h-9 rounded-full flex flex-col items-center justify-center"
          onClick={() => navigate("/map")}>
          <img src={map} alt={"map"} className='w-6 h-6 ' />
        </button>
        <button className="bg-amber-400 w-9 h-9 rounded-full flex flex-col items-center justify-center"
          onClick={() => navigate("/home")}>
          <img src={home} alt={"home"} className='w-6 h-6 ' />
        </button>
        <button className="bg-amber-400 w-9 h-9 rounded-full flex flex-col items-center justify-center"
          onClick={() => navigate("/")}>
          <img src={binoculars} alt={"binoculars"} className='w-6 h-6 ' />
        </button>
      </div>
    </div>
  );
};

export default Home;
