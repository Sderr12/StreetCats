import React, { useState, useRef } from 'react';
import { MapPin, Camera, Bold, Italic, Link as LinkIcon, Eye, PenLine } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface CatForm {
  title: string;
  description: string;
  location: string;
  image: File | null;
}

const AddCat = () => {
  const [form, setForm] = useState<CatForm>({
    title: '',
    description: '',
    location: '',
    image: null
  });
  
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const insertMarkdown = (syntax: string) => {
    const textarea = document.getElementById('description') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = form.description;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const selectedText = text.substring(start, end) || "testo";

    let newText = "";
    if (syntax === 'bold') newText = `${before}**${selectedText}**${after}`;
    if (syntax === 'italic') newText = `${before}_${selectedText}_${after}`;
    if (syntax === 'link') newText = `${before}[${selectedText}](https://example.com)${after}`;

    setForm({ ...form, description: newText });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 py-10 overflow-y-scroll">
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2"></h1>

        <form className="space-y-6">
          {/* Uploading Photo */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-4">Fotografia del Gatto</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-video rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 transition-colors overflow-hidden"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera className="text-gray-400 mb-2" size={32} />
                  <span className="text-sm text-gray-500">Click to upload a photo</span>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*" 
              />
            </div>
          </div>

          {/* Titolo e Posizione */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Titolo</label>
              <input 
                type="text"
                placeholder="Es: Gatto rosso socievole vicino alla metro"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">Posizione (Mappa)</label>
              <div className="bg-orange-50 rounded-xl h-48 flex flex-col items-center justify-center border border-orange-100 relative overflow-hidden">
                <MapPin className="text-amber-500 mb-2" size={32} />
                <p className="text-sm text-amber-600 font-medium">Seleziona sulla mappa</p>
                <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-crosshair">
                   <span className="bg-white px-3 py-1 rounded-full text-xs font-bold">MAPPA INTERATTIVA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Descrizione con Markdown */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-gray-700">Descrizione dell'avvistamento</label>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  type="button"
                  onClick={() => setPreviewMode('edit')}
                  className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition ${previewMode === 'edit' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}
                >
                  <PenLine size={14} /> Scrivi
                </button>
                <button 
                  type="button"
                  onClick={() => setPreviewMode('preview')}
                  className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition ${previewMode === 'preview' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}
                >
                  <Eye size={14} /> Anteprima
                </button>
              </div>
            </div>

            {previewMode === 'edit' ? (
              <div className="space-y-2">
                <div className="flex gap-2 border-b border-gray-100 pb-2">
                  <button type="button" onClick={() => insertMarkdown('bold')} className="p-2 hover:bg-gray-100 rounded text-gray-600"><Bold size={18} /></button>
                  <button type="button" onClick={() => insertMarkdown('italic')} className="p-2 hover:bg-gray-100 rounded text-gray-600"><Italic size={18} /></button>
                  <button type="button" onClick={() => insertMarkdown('link')} className="p-2 hover:bg-gray-100 rounded text-gray-600"><LinkIcon size={18} /></button>
                </div>
                <textarea 
                  id="description"
                  rows={6}
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  placeholder="Descrivi il gatto, il suo comportamento o segnali particolari..."
                  className="w-full py-2 outline-none resize-none text-gray-700"
                />
              </div>
            ) : (
              <div className="prose prose-orange min-h-[160px] text-gray-700 text-left">
                {form.description ? (
                  <ReactMarkdown>{form.description}</ReactMarkdown>
                ) : (
                  <span className="text-gray-400 italic text-sm text-left">Nessuna descrizione inserita.</span>
                )}
              </div>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-amber-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 transition-all transform hover:-translate-y-1"
          >
            Pubblica Avvistamento
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddCat;
