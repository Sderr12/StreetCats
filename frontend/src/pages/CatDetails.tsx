import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, MessageCircle, ArrowLeft, Loader2, Send } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from "../context/AuthProvider";
import CommentItem from "../components/CommentItem.tsx";
import ReactMarkdown from 'react-markdown';

const CatDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [cat, setCat] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCatData = async () => {
      try {
        const [catRes, commentsRes] = await Promise.all([
          axios.get(`http://localhost:3000/cats/${id}`),
          axios.get(`http://localhost:3000/cats/${id}/comments`)
        ]);

        setCat({
          ...catRes.data,
          displayImage: catRes.data.photo.startsWith('http')
            ? catRes.data.photo
            : `http://localhost:3000/${catRes.data.photo}`,
          date: new Date(catRes.data.createdAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
        });

        setComments(commentsRes.data);
      } catch (err) {
        console.error("Errore, Supremo Leader:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatData();
  }, [id]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `http://localhost:3000/cats/${id}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      // Aggiunge il commento in cima alla lista
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (err) {
      alert("Errore nell'invio del commento.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center dark:bg-slate-950"><Loader2 className="animate-spin text-orange-500" size={48} /></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-orange-500 mb-6 group transition-colors">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Torna indietro</span>
        </button>

        <article className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800">
          <div className="relative h-[500px] w-full">
            <img src={cat.displayImage} alt={cat.title} className="w-full h-full object-cover" />
          </div>

          <div className="p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">{cat.title}</h1>

            <div className="flex flex-wrap gap-6 mb-10 pb-10 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-full">
                <MapPin size={20} className="text-orange-500" />
                <span className="text-orange-700 dark:text-orange-300 font-semibold text-sm">{cat.latitude.toFixed(4)}, {cat.longitude.toFixed(4)}</span>
              </div>
              <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full">
                <Calendar size={20} className="text-blue-500" />
                <span className="text-blue-700 dark:text-blue-300 font-semibold text-sm">{cat.date}</span>
              </div>
            </div>

            <section className="mb-12">
              <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-slate-300 leading-relaxed text-lg">
                <ReactMarkdown>{cat.description}</ReactMarkdown>
              </div>
            </section>

            {/* SEZIONE COMMENTI */}
            <section className="mt-16 pt-10 border-t-2 border-dashed border-gray-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Commenti</h2>
                <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">{comments.length}</div>
              </div>

              {/* FORM INVIO */}
              {auth.token ? (
                <form onSubmit={handlePostComment} className="mb-10 space-y-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Lascia un commento..."
                    className="w-full bg-gray-50 dark:bg-slate-800 rounded-2xl p-4 border-none focus:ring-2 focus:ring-orange-500 dark:text-white outline-none"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <button disabled={isSubmitting} className="bg-orange-500 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-orange-600 transition-colors">
                      {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                      Invia
                    </button>
                  </div>
                </form>
              ) : (
                <p className="mb-10 text-gray-500 italic">Accedi per commentare.</p>
              )}

              <div className="space-y-6">
                {comments.map((c) => (
                  <CommentItem key={c.id} text={c.content} date={new Date(c.createdAt).toLocaleDateString()} author={c.user} />
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
