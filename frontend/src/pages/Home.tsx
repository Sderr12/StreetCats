import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import streetimage from "../assets/siamese-cat-new.png";
import logo from "../assets/street.png";

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
      {/* Hero Section */}
      <section className="relative h-screen w-full">
        {/* Hero Image */}
        <div
          className="absolute inset-0 bg-cover bg-center lg:bg-[center_40%]"
          style={{ backgroundImage: `url(${streetimage})` }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Topbar */}
        <div
          className={`absolute top-0 left-0 w-full flex items-center justify-between h-20 px-4 sm:px-8 z-10 transition-colors duration-300 ${scrolled ? "bg-white shadow-md" : "bg-transparent"
            }`}
        >
          <img
            src={logo}
            alt="Logo"
            className="h-11 cursor-pointer transition-all duration-300"
            onClick={() => navigate("/home")}
          />
          <div className="flex items-center gap-2">
            <img className="w-10 h-10 rounded-full cursor-pointer" />
            <button className="md:hidden p-2">
              <svg
                className="w-6 h-6 text-white"
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
        <div className="relative z-10 flex flex-col items-start justify-center h-full p-10 md:p-20 lg:pl-40 lg:left-200 lg:top-30 top-30">
          <h1 className="text-4xl md:text-6xl font-serif text-amber-300 drop-shadow-xl">
            Welcome on <span className="font-bold text-white">StreetCats</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-100 mt-4 font-light">
            Help the cat's distribution system find its way!
          </p>
          <button className="mt-6 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-white font-semibold rounded-full transition-all duration-300">
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
    </div>
  );
};

export default Home;
