import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, MessageCircle, ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from "../context/AuthProvider";
import CommentItem from "../components/CommentItem.tsx"
import ReactMarkdown from 'react-markdown';

const CatDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [cat, setCat] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatData = async () => {
      try {
        const [catRes, commentsRes] = await Promise.all([
          axios.get(`http://localhost:3000/cats/${id}`),
          axios.get(`http://localhost:3000/cats/${id}/comments`)
        ]);

        if (catRes.data) {
          const mappedCat = {
            ...catRes.data,
            // Gestione Immagine
            displayImage: catRes.data.photo.startsWith('http')
              ? catRes.data.photo
              : `http://localhost:3000/${catRes.data.photo}`,

            // TRASFORMAZIONE DATA: Da 'createdAt' del DB a 'date' per la UI
            date: new Date(catRes.data.createdAt).toLocaleDateString('it-IT', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })
          };
          setCat(mappedCat);
        }

        // --- MAPPING COMMENTI ---
        const mappedComments = commentsRes.data.map((c: any) => ({
          id: c.id,
          text: c.text,
          date: new Date(c.createdAt).toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }),
          author: {
            username: c.user?.username || "Utente Anonimo",
            avatarUrl: c.user?.avatarUrl
              ? `http://localhost:3000/${c.user.avatarUrl}`
              : undefined
          }
        }));
        setComments(mappedComments);

      } catch (err) {
        console.error("Errore fatale, Supremo Leader:", err);
        setCat(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCatData();
  }, [id]);

  // Gestione caricamento
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4 text-orange-500">
        <Loader2 className="animate-spin" size={48} />
        <span className="font-medium animate-pulse">Recupero dati imperiali...</span>
      </div>
    </div>
  );

  // Gestione gatto inesistente
  if (!cat) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 px-4 text-center">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Questo gatto non è registrato negli archivi.</h2>
      <button onClick={() => navigate('/home')} className="bg-orange-500 text-white px-6 py-2 rounded-xl">Torna alla Home</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-20">

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-orange-500 mb-6 group transition-colors">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Torna indietro</span>
        </button>

        <article className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800">

          {/* Immagine con mapping 'displayImage' */}
          <div className="relative h-[500px] w-full">
            <img src={cat.displayImage} alt={cat.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
          </div>

          <div className="p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
              {cat.title}
            </h1>

            <div className="flex flex-wrap gap-6 mb-10 pb-10 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-full">
                <MapPin size={20} className="text-orange-500" />
                <span className="text-orange-700 dark:text-orange-300 font-semibold text-sm">
                  {cat.latitude.toFixed(4)}, {cat.longitude.toFixed(4)}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
                <Calendar size={20} className="text-blue-500" />
                <span className="text-blue-700 dark:text-blue-300 font-semibold text-sm">
                  {cat.date}
                </span>
              </div>
            </div>

            <section className="mb-12">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-widest text-sm opacity-50">Descrizione</h2>
              <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-slate-300 leading-relaxed text-lg">
                <ReactMarkdown>{cat.description}</ReactMarkdown>
              </div>
            </section>

            {/* Sezione Commenti */}
            <section className="mt-16 pt-10 border-t-2 border-dashed border-gray-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Commenti</h2>
                <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {comments.length}
                </div>
              </div>

              {/* Lista Commenti mappati */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <CommentItem key={comment.id} {...comment} />
                ))}
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
};

export default CatDetailPage;
