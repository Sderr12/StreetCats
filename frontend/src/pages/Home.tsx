import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import streetimage from "../assets/siamese-cat-new.png";


const Home = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const secondSection = document.getElementById("features");
      if (secondSection) {
        const top = secondSection.getBoundingClientRect().top;
        setScrolled(top <= 80);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!context) {
    throw new Error("Must be used inside AuthProvider");
  }
  const { user } = context;

  const handleClick = () => {
    if (!user) {
      navigate("/login", { replace: true });
    } else {
      navigate("/spot");
    }
  };

  const features = [
    {
      title: "Interactive Map",
      description: "Explore spotted cats on an interactive map with real-time updates from the community"
    },
    {
      title: "Report Sightings",
      description: "Share photos and locations of street cats you encounter to help build our database"
    },
    {
      title: "Community Care",
      description: "Connect with others who care about street cats and coordinate care efforts"
    },
    {
      icon: "👥",
      title: "Join the Movement",
      description: "Be part of a global community dedicated to monitoring and protecting street cats"
    }
  ];

  const stats = [
    { number: "2,547", label: "Cats Spotted" },
    { number: "1,234", label: "Active Users" },
    { number: "89", label: "Cities" },
    { number: "4.9", label: "Avg Rating" }
  ];

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center lg:bg-[center_30%] transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url(${streetimage})` }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent" />

        {/* Animated Elements */}

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-start justify-center h-full px-6 md:px-12 lg:px-40 max-w-7xl mx-auto">

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-2xl mb-6 leading-tight">
            Welcome to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 mt-2">
              StreetCats
            </span>
          </h1>

          <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 font-light mb-8 max-w-2xl leading-relaxed">
            Help the cat distribution system find its way through our global community
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleClick}
              className="group px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2 justify-center"
            >
              Spot a Street Cat
            </button>

            <button
              onClick={() => navigate("/map")}
              className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white/20 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105"
            >
              Explore the Map
            </button>
          </div>

        </div>

      </section>

      {/* Features Section */}
      <section
        id="features"
        className="w-full py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-orange-50 to-amber-50 dark:from-gray-50 dark:via-slate-400"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="bg-amber-400/20 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold">
                Why StreetCats?
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
              Making a Difference,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600"> Together</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of cat lovers worldwide in creating a safer, more caring environment for street cats
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="reveal group bg-white dark:bg-slate-400 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 lg:py-32 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 dark:from-slate-900 dark:via-orange-900/40 dark:to-slate-900 relative overflow-hidden transition-colors duration-500">
        <div className="absolute inset-0 bg-black/0 dark:bg-black/20" />

        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white dark:bg-orange-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white dark:bg-amber-500 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 dark:text-gray-300 mb-10 leading-relaxed">
            Every spotted cat counts. Join our community today and help us build a comprehensive database of street cats worldwide.
          </p>
          <button
            onClick={handleClick}
            className="group px-10 py-5 bg-white dark:bg-orange-600 dark:text-white dark:hover:bg-orange-500 text-orange-600 font-bold rounded-full transition-all duration-300 shadow-2xl hover:scale-105 text-lg inline-flex items-center gap-3"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}

      {/* Mobile Bottom Navigation */}
    </div>
  );
};

export default Home;
