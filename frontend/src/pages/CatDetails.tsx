import { useState } from 'react';
import { MapPin, Calendar, MessageCircle, ArrowLeft } from 'lucide-react';

const CatDetailPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([
    { 
      user: "Maria Rossi", 
      avatar: "https://i.pravatar.cc/150?img=1", 
      text: "L'ho visto ieri vicino al mercato, sembra stare bene! 🧡", 
      date: "2 ore fa", 
      id: 1 
    },
    { 
      user: "Luca Bianchi", 
      avatar: "https://i.pravatar.cc/150?img=3", 
      text: "Bellissimo gatto! Molto socievole, si è avvicinato subito", 
      date: "1 giorno fa", 
      id: 2 
    },
    { 
      user: "Anna Verdi", 
      avatar: "https://i.pravatar.cc/150?img=5", 
      text: "Gli porto sempre del cibo quando passo di là ❤️", 
      date: "3 giorni fa", 
      id: 3 
    }
  ]);

  const handleAddComment = () => {
    if (newComment.trim() && isAuthenticated) {
      const comment = {
        user: "Tu",
        avatar: "https://i.pravatar.cc/150?img=8",
        text: newComment,
        date: "Adesso",
        id: Date.now()
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const cat = {
    title: "Gatto tigrato vicino al mercato",
    description: `Questo bellissimo gatto tigrato è stato avvistato più volte nei pressi del mercato di Monters. 

Ha un carattere molto socievole e ama avvicinarsi alle persone. Sembra in buone condizioni di salute e indossa un collare arancione.

Spesso lo si può trovare nei pressi della panetteria, dove riposa al sole durante le ore più calde della giornata.`,
    location: "Monters, Paris",
    insertDate: "26 Ottobre 2023",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop",
    lat: 48.8566,
    lng: 2.3522
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-scroll">

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Image */}
          <img 
            src={cat.image} 
            alt={cat.title} 
            className="w-full h-96 object-cover"
          />

          {/* Main content 2 */}
          <div className="p-6 sm:p-8">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{cat.title}</h1>

            {/* Metadati */}
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-orange-500" />
                <span>{cat.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-orange-500" />
                <span>Inserito il {cat.insertDate}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Descrizione</h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {cat.description}
              </div>
            </div>

            {/* Map */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Posizione</h2>
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl h-64 flex items-center justify-center relative overflow-hidden">
                <MapPin size={64} className="text-orange-500" />
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md">
                  <p className="text-sm font-semibold text-gray-800">{cat.location}</p>
                  <p className="text-xs text-gray-600">Lat: {cat.lat}, Lng: {cat.lng}</p>
                </div>
              </div>
            </div>

            {/* Comment section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Commenti ({comments.length})
                </h2>
                <MessageCircle size={24} className="text-orange-500" />
              </div>

              {/* Form per aggiungere commento */}
              {isAuthenticated ? (
                <div className="mb-6 bg-orange-50 rounded-xl p-4">
                  <div className="flex gap-3">
                    <img 
                      src="https://i.pravatar.cc/150?img=8" 
                      alt="You" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Scrivi un commento..."
                        rows={3}
                        className="w-full px-4 py-3 bg-white border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm resize-none"
                      />
                      <div className="flex justify-end mt-2">
                        <button 
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition text-sm"
                        >
                          Pubblica
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <p className="text-blue-800 text-sm mb-2">
                    Devi essere autenticato per lasciare un commento
                  </p>
                  <button 
                    onClick={() => setIsAuthenticated(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition text-sm"
                  >
                    Accedi per commentare
                  </button>
                </div>
              )}

              {/* Comment list */}
              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 border-b border-gray-100 pb-4 last:border-0">
                      <img 
                        src={comment.avatar} 
                        alt={comment.user} 
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <p className="font-semibold text-gray-800 text-sm mb-1">
                            {comment.user}
                          </p>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {comment.text}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 ml-4">{comment.date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8 text-sm">
                    Nessun commento ancora. Sii il primo a commentare!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CatDetailPage;
