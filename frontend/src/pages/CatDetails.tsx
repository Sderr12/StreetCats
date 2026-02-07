import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ArrowLeft, Loader2, Send } from 'lucide-react';
import api from "../api/axios.ts"
import { AuthContext } from "../context/AuthProvider";
import CommentItem from "../components/CommentItem.tsx";
import ReactMarkdown from 'react-markdown';
import axios from "axios";

const CatDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [cat, setCat] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [cityName, setCityName] = useState<string>("Loading position...");
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCatData = async () => {
      try {
        const [catRes, commentsRes] = await Promise.all([
          api.get(`/cats/${id}`),
          api.get(`/cats/${id}/comments`)
        ]);

        if (catRes.data) {
          const catData = catRes.data;

          try {
            const geoRes = await axios.get('https://nominatim.openstreetmap.org/reverse', {
              params: {
                format: 'jsonv2',
                lat: catData.latitude,
                lon: catData.longitude,
                'accept-language': 'it'
              }
            });
            const address = geoRes.data.address;
            const city = address.city || address.town || address.village || address.suburb || "Località ignota";
            setCityName(city);
          } catch (geoErr) {
            setCityName("Position not found");
          }

          const formattedCatDate = catData.createdAt
            ? new Date(catData.createdAt).toLocaleDateString('it-IT', {
              day: 'numeric', month: 'long', year: 'numeric'
            })
            : "Date not available";

          setCat({
            ...catData,
            displayImage: catData.photo.startsWith('http')
              ? catData.photo
              : `http://localhost:3000/${catData.photo}`,
            date: formattedCatDate
          });
        }
        setComments(commentsRes.data);
      } catch (err) {
        console.error("Error:", err);
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
      const res = await api.post(
        `cats/${id}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (err) {
      alert("Impossible to submit comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
      <Loader2 className="animate-spin text-orange-500" size={48} />
    </div>
  );

  if (!cat) return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl font-bold mb-4">Cat not found.</h2>
      <button onClick={() => navigate('/home')} className="bg-orange-500 text-white px-6 py-2 rounded-xl">Back Home</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-20 transition-colors duration-300">

      <style>{`
        .markdown-content h1 { font-size: 2.25rem; font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; color: inherit; border-bottom: 3px solid #f59e0b; padding-bottom: 0.5rem; }
        .markdown-content h2 { font-size: 1.85rem; font-weight: 700; margin-top: 1.8rem; margin-bottom: 0.8rem; color: inherit; }
        .markdown-content h3 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.6rem; color: inherit; }
        .markdown-content p { margin-bottom: 1.25rem; line-height: 1.8; color: inherit; }
        .markdown-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .markdown-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .markdown-content li { margin-bottom: 0.5rem; }
        .markdown-content blockquote { border-left: 5px solid #f59e0b; padding: 0.75rem 1.25rem; background: rgba(245, 158, 11, 0.05); font-style: italic; margin: 1.5rem 0; border-radius: 0 12px 12px 0; }
        .markdown-content code { background: rgba(0,0,0,0.08); padding: 0.2rem 0.4rem; border-radius: 6px; font-family: monospace; font-size: 0.85em; }
        .dark .markdown-content code { background: rgba(255,255,255,0.15); color: #fbbf24; }
        .markdown-content hr { border: 0; border-top: 2px solid #e5e7eb; margin: 2.5rem 0; opacity: 0.3; }
        .markdown-content a { color: #f59e0b; text-decoration: underline; font-weight: 700; }
      `}</style>

      <div className="max-w-4xl mx-auto px-4 py-10 md:py-20 text-left">

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-orange-500 mb-6 transition-colors group pt-10 md:pt-4">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-black uppercase text-xs tracking-widest">Go back</span>
        </button>

        <article className="bg-white dark:bg-slate-900 rounded-md shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800">
          <div className="relative h-[400px] md:h-[550px] w-full">
            <img src={cat.photo} alt={cat.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
          </div>

          <div className="p-8 md:p-14">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">
              {cat.title}
            </h1>

            <div className="flex flex-wrap gap-4 mb-12 pb-10 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3 bg-stone-100 dark:bg-slate-800 px-5 py-2.5 rounded-2xl">
                <MapPin size={18} className="text-orange-500" />
                <span className="text-stone-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider">{cityName}</span>
              </div>
              <div className="flex items-center gap-3 bg-stone-100 dark:bg-slate-800 px-5 py-2.5 rounded-2xl">
                <Calendar size={18} className="text-amber-500" />
                <span className="text-stone-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider">{cat.date}</span>
              </div>
            </div>

            <section className="mb-16">
              <span className='text-white bg-orange-500 rounded-full text-xs font-black px-5 py-2 uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20'>
                Description
              </span>

              <div className="markdown-content max-w-none text-gray-700 dark:text-slate-300 text-lg mt-10">
                <ReactMarkdown
                  components={{
                    em: ({ ...props }) => <i className="italic text-gray-800 dark:text-slate-100" {...props} />,
                    strong: ({ ...props }) => <b className="font-black text-black dark:text-white" {...props} />,
                    a: ({ href, ...props }) => {
                      const safeHref = (href?.startsWith('http://') || href?.startsWith('https://'))
                        ? href
                        : `https://${href}`;
                      return (
                        <a
                          {...props}
                          href={safeHref}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      );
                    }
                  }}
                >
                  {cat.description}
                </ReactMarkdown>
              </div>
            </section>

            {/* COMMENTS SECTION */}
            <section className="mt-20 pt-12 border-t border-stone-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Comments</h2>
                <div className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-black">{comments.length}</div>
              </div>

              {auth.token ? (
                <form onSubmit={handlePostComment} className="mb-12 space-y-4">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Leave a comment..."
                    className="w-full bg-stone-50 dark:bg-slate-800/50 rounded-3xl p-6 border-2 border-transparent focus:border-orange-500 dark:text-white outline-none transition-all resize-none font-medium"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <button
                      disabled={isSubmitting || !newComment.trim()}
                      className="bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 hover:scale-105 transition-transform disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                      Post Comment
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mb-12 p-8 bg-stone-50 dark:bg-slate-800/30 rounded-3xl text-center border-2 border-dashed border-stone-200 dark:border-slate-700">
                  <p className="text-stone-400 dark:text-slate-500 font-bold uppercase text-xs tracking-widest">Login to join the conversation!</p>
                </div>
              )}

              <div className="space-y-8">
                {comments.length > 0 ? (
                  comments.map((c) => {
                    const dateToParse = c.createdAt || new Date().toISOString();
                    const dateObj = new Date(dateToParse);
                    const displayDate = isNaN(dateObj.getTime())
                      ? "Date invalid"
                      : dateObj.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });

                    return (
                      <CommentItem
                        key={c.id}
                        id={c.id}
                        text={c.content}
                        createdAt={displayDate}
                        author={c.user || { username: "User" }}
                      />
                    );
                  })
                ) : (
                  <p className="text-center py-10 text-stone-300 dark:text-slate-600 italic font-medium">No comments yet. Be the first to say hi!</p>
                )}
              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
};

export default CatDetailPage;
