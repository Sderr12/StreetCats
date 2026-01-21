import { Link } from "react-router-dom"

const Register = () => {
  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6">
        Crea un account
      </h1>

      <form className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        <button
          type="submit"
          className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-white font-semibold rounded-xl transition"
        >
          Registrati
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Hai già un account?{" "}
        <Link to="/login" className="text-amber-400 font-medium">
          Login
        </Link>
      </p>
    </>
  )
}

export default Register;
