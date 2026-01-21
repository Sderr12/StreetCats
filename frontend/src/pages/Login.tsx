import { useLocation, useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth.ts"; 

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/home";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    const fakeUser = { 
      id: "1", 
      name: "Supremo Leader", 
      email: "leader@streetcats.com",
      avatarUrl: "https://i.pravatar.cc/150?img=8"
    };

    try {
      login(fakeUser);
      
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6">
        Accedi a <span className="text-amber-400">StreetCats</span>
      </h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        <input
          type="password"
          placeholder="Password"
          required
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        <button
          type="submit"
          className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-white font-semibold rounded-xl transition"
        >
          Login
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Non hai un account?{" "}
        <Link to="/register" className="text-amber-400 font-medium">
          Register 
        </Link>
      </p>
    </>
  );
};

export default Login;
