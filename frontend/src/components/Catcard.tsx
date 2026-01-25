import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const Catcard = ({ cat }: { cat: any }) => {
  const navigate = useNavigate();


  return (
    <div
      onClick={() => navigate(`/catdetails/${cat.id}`)}
      className="flex items-center gap-4 p-3 w-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-amber-100 dark:border-slate-700 cursor-pointer hover:shadow-md transition-shadow"
    >
      <img
        src={cat.photo}
        alt={cat.title}
        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
      />
      <div className="flex flex-col">
        <h3 className="font-bold text-amber-900 dark:text-amber-500">{cat.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
          {cat.description || "Nessuna descrizione"}
        </p>
        <span className="text-xs mt-1 text-amber-600 font-semibold italic">
          Clicca per dettagli
        </span>
      </div>
    </div>
  );
};

export default Catcard;
