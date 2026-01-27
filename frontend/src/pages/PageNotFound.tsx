import { useNavigate } from 'react-router-dom';
import whereareyougoing from "../assets/whereareyougoing.jpg";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/home');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen dark:bg-gray-200 text-white p-6 w-full py-12">

      <div className="w-full max-w-xs md:max-w-lg lg:max-w-xl mb-6 md:mb-8">
        <img
          src={whereareyougoing}
          alt="404 - Miao Not Found"
          className="w-full h-auto rounded-2xl shadow-2xl border-2 border-orange-500/20"
        />
      </div>

      <h1 className="text-4xl md:text-6xl font-extrabold text-orange-500 mb-2 md:mb-4 drop-shadow-lg text-center leading-tight">
        404 <span className="block md:inline">-</span> NOT FOUND
      </h1>

      <p className="text-lg md:text-2xl text-gray-400 mb-8 md:mb-10 text-center max-w-md italic">
        Go back, that's none of your business.
      </p>

      <button
        onClick={handleGoHome}
        className="bg-amber-600 text-white font-bold py-4 px-10 rounded-2xl text-lg hover:bg-orange-700 active:scale-95 transition-all shadow-xl uppercase tracking-wider"
      >
        Go back to Home
      </button>
    </div>
  );
};

export default NotFoundPage;
