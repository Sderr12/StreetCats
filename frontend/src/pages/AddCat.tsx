import React, { useState, useRef, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Camera, Maximize2, ArrowLeft, AlertCircle, Eye, Edit3, Bold, Italic,
  Link as LinkIcon, List, ListOrdered, Code, Heading1, Heading2,
  Heading3, Quote, Check
} from 'lucide-react';
import axios from "../api/axios.ts";
import { useNavigate } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import { AuthContext } from "../context/AuthProvider";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import "leaflet/dist/leaflet.css";

const CatSchema = Yup.object().shape({
  title: Yup.string().min(3, 'Title is too short').required('Title is required'),
  description: Yup.string().min(10, 'Add more details!').required('Description is required'),
  latitude: Yup.number().required('Mark the location on the map'),
  longitude: Yup.number().required(),
  image: Yup.mixed().required('A photo is required!')
});

const AddCat = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [realUserPos, setRealUserPos] = useState<[number, number]>([41.8902, 12.4922]);
  const [shouldMapRecenter, setShouldMapRecenter] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      latitude: 41.8902,
      longitude: 12.4922,
      image: null as File | null
    },
    validationSchema: CatSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const data = new FormData();
        data.append('title', values.title);
        data.append('description', values.description);
        data.append('latitude', values.latitude.toString());
        data.append('longitude', values.longitude.toString());
        if (values.image) data.append('photo', values.image);

        const response = await axios.post('/cats', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('streetcats_token')}`
          }
        });
        if (response.status === 201) navigate(`/catdetails/${response.data.id}`);
      } catch (error) {
        console.error("Submission error:", error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setRealUserPos(coords);
        formik.setFieldValue('latitude', coords[0]);
        formik.setFieldValue('longitude', coords[1]);
      });
    }
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    setShouldMapRecenter(false);
    formik.setFieldValue('latitude', lat);
    formik.setFieldValue('longitude', lng);
  };

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formik.values.description;
    const selectedText = text.substring(start, end) || 'text';
    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    formik.setFieldValue('description', newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 10);
  };

  const insertAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const text = formik.values.description;
    const newText = text.substring(0, start) + textToInsert + text.substring(start);
    formik.setFieldValue('description', newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 10);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-900 pb-10 lg:pb-20 lg:py-10 font-sans text-left transition-colors duration-300">

      <style>{`
        .markdown-preview h1 { font-size: 1.8rem; font-weight: 800; margin-bottom: 1rem; color: inherit; border-bottom: 2px solid #f59e0b; padding-bottom: 0.3rem; }
        .markdown-preview h2 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.8rem; color: inherit; }
        .markdown-preview h3 { font-size: 1.2rem; font-weight: 700; margin-top: 1.2rem; margin-bottom: 0.5rem; color: inherit; }
        .markdown-preview p { margin-bottom: 1rem; line-height: 1.6; color: inherit; }
        .markdown-preview ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
        .markdown-preview ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
        .markdown-preview blockquote { border-left: 4px solid #f59e0b; padding-left: 1rem; font-style: italic; opacity: 0.8; margin: 1rem 0; }
        .markdown-preview code { background: rgba(0,0,0,0.05); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
        .dark .markdown-preview code { background: rgba(255,255,255,0.1); color: #fbbf24; }
        .markdown-preview a { color: #f59e0b; text-decoration: underline; }
        .markdown-preview hr { border: 0; border-top: 1px solid #e5e7eb; margin: 1.5rem 0; }
      `}</style>

      <div className="max-w-3xl mx-auto px-4 pt-8">

        <header className="lg:mb-5 mb-1 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-orange-500 mb-6 transition-colors group pt-10 md:pt-4">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-black uppercase text-xs tracking-widest">Go back</span>
          </button>
        </header>

        <form onSubmit={formik.handleSubmit} className="space-y-6">

          {/* PHOTO SECTION */}
          <section className="bg-white dark:bg-slate-800 p-6 rounded-t-md shadow-xl border border-stone-100 dark:border-slate-700">
            <label className="block text-[10px] font-black text-stone-400 dark:text-slate-500 mb-4 uppercase tracking-[0.2em]">Cat Photo</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all bg-stone-50 dark:bg-slate-900 ${formik.touched.image && formik.errors.image ? 'border-red-500 bg-red-50/30' : 'border-stone-200 dark:border-slate-700 hover:border-amber-400'}`}
            >
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center">
                  <Camera className="text-amber-500 mb-2" size={32} />
                  <span className="text-xs text-stone-400 dark:text-slate-500 font-bold uppercase tracking-wider">Upload Image</span>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  formik.setFieldValue('image', file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }} />
            </div>
          </section>

          {/* LOCATION SECTION */}
          <section className="bg-white dark:bg-slate-800 p-6 shadow-xl border border-stone-100 dark:border-slate-700 space-y-6">
            <div>
              <label className="block text-[10px] font-black text-stone-400 dark:text-slate-500 mb-2 uppercase tracking-[0.2em]">Title / Nickname</label>
              <input
                name="title"
                type="text"
                className="w-full px-6 py-4 rounded-2xl bg-stone-50 dark:bg-slate-900 border-none outline-none text-stone-800 dark:text-white font-bold focus:ring-2 focus:ring-amber-500 transition-all placeholder:text-stone-400 dark:placeholder:text-slate-600"
                onChange={formik.handleChange}
                value={formik.values.title}
                placeholder="Ex: The harbor ginger cat"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] font-black text-stone-400 dark:text-slate-500 uppercase tracking-[0.2em]">Sighting Location</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsMapExpanded(true);
                    document.body.style.overflow = 'hidden';
                  }}
                  className="text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase flex items-center gap-1.5 hover:opacity-80"
                >
                  <Maximize2 size={14} /> Expand Map
                </button>
              </div>

              <div className="relative h-72 w-full rounded-3xl overflow-hidden border border-stone-100 dark:border-slate-700 shadow-inner">
                <MapComponent
                  cats={[]}
                  userPosition={realUserPos}
                  selectedCatPos={[formik.values.latitude, formik.values.longitude]}
                  programmaticCenter={[formik.values.latitude, formik.values.longitude]}
                  shouldRecenter={shouldMapRecenter}
                  user={user}
                  onMapClick={handleMapClick}
                />
              </div>

              {isMapExpanded && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-stone-900/80 backdrop-blur-md p-0 md:p-10 animate-in fade-in duration-200">
                  <div className="relative w-full h-full md:max-w-5xl md:h-[85vh] bg-white dark:bg-slate-900 md:rounded-md shadow-2xl overflow-hidden flex flex-col border border-white/20">

                    <div className="absolute top-0 left-0 right-0 z-[1001] p-4 md:p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMapExpanded(false);
                          document.body.style.overflow = 'auto';
                        }}
                        className="pointer-events-auto bg-white/90 dark:bg-slate-800/90 p-3 md:px-5 md:py-2.5 rounded-2xl shadow-xl flex items-center gap-2 hover:bg-orange-500 hover:text-white transition-all group"
                      >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden md:block font-black uppercase text-[10px] tracking-widest">Back</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsMapExpanded(false);
                          document.body.style.overflow = 'auto';
                        }}
                        className="pointer-events-auto bg-orange-500 text-white px-6 py-3 md:px-8 md:py-3 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                      >
                        <Check size={18} /> Confirm Location
                      </button>
                    </div>

                    <div className="flex-1 w-full h-full">
                      <MapComponent
                        cats={[]}
                        userPosition={realUserPos}
                        selectedCatPos={[formik.values.latitude, formik.values.longitude]}
                        programmaticCenter={[formik.values.latitude, formik.values.longitude]}
                        shouldRecenter={shouldMapRecenter}
                        user={user}
                        onMapClick={handleMapClick}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white dark:bg-slate-800 p-6 rounded-b-md shadow-xl border border-stone-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <label className="text-[10px] font-black text-stone-400 dark:text-slate-500 uppercase tracking-[0.2em]">Description</label>
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-50 dark:bg-slate-900 border border-stone-100 dark:border-slate-700 transition-all hover:scale-105"
              >
                {previewMode ? <><Edit3 size={14} /> Edit</> : <><Eye size={14} /> Preview</>}
              </button>
            </div>

            <div className="rounded-2xl border border-stone-100 dark:border-slate-700 overflow-hidden bg-stone-50 dark:bg-slate-900">
              {!previewMode && (
                <div className="p-2 border-b border-stone-100 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50">
                  <div className="flex flex-wrap items-center gap-1 mb-2">
                    <button type="button" onClick={() => insertMarkdown('**', '**')} className="p-2 hover:bg-amber-100 dark:hover:bg-slate-700 rounded text-stone-600 dark:text-slate-300" title="Bold"><Bold size={16} /></button>
                    <button type="button" onClick={() => insertMarkdown('_', '_')} className="p-2 hover:bg-amber-100 dark:hover:bg-slate-700 rounded text-stone-600 dark:text-slate-300" title="Italic"><Italic size={16} /></button>
                    <button type="button" onClick={() => insertMarkdown('`', '`')} className="p-2 hover:bg-amber-100 dark:hover:bg-slate-700 rounded text-stone-600 dark:text-slate-300" title="Inline Code"><Code size={16} /></button>
                    <div className="w-px h-4 bg-stone-200 dark:bg-slate-700 mx-1" />
                    <button type="button" onClick={() => insertAtCursor('# ')} className="p-2 hover:bg-amber-100 dark:hover:bg-slate-700 rounded text-stone-600 dark:text-slate-300" title="H1"><Heading1 size={16} /></button>
                    <button type="button" onClick={() => insertAtCursor('## ')} className="p-2 hover:bg-amber-100 dark:hover:bg-slate-700 rounded text-stone-600 dark:text-slate-300" title="H2"><Heading2 size={16} /></button>
                    <button type="button" onClick={() => insertAtCursor('### ')} className="p-2 hover:bg-amber-100 dark:hover:bg-slate-700 rounded text-stone-600 dark:text-slate-300" title="H3"><Heading3 size={16} /></button>
                    <div className="w-px h-4 bg-stone-200 dark:bg-slate-700 mx-1" />
                    <button type="button" onClick={() => insertMarkdown('[', '](url)')} className="p-2 hover:bg-amber-100 dark:hover:bg-slate-700 rounded text-stone-600 dark:text-slate-300" title="Link"><LinkIcon size={16} /></button>
                    <button type="button" onClick={() => insertAtCursor('- ')} className="p-2 hover:bg-amber-100 dark:hover:bg-slate-700 rounded text-stone-600 dark:text-slate-300" title="Bullet List"><List size={16} /></button>
                    <button type="button" onClick={() => insertAtCursor('1. ')} className="p-2 hover:bg-amber-100 dark:hover:bg-slate-700 rounded text-stone-600 dark:text-slate-300" title="Numbered List"><ListOrdered size={16} /></button>
                    <button type="button" onClick={() => insertAtCursor('> ')} className="p-2 hover:bg-amber-100 dark:hover:bg-slate-700 rounded text-stone-600 dark:text-slate-300" title="Quote"><Quote size={16} /></button>
                  </div>
                </div>
              )}

              <div className="relative min-h-[250px]">
                {previewMode ? (
                  <div className="p-6 markdown-preview text-stone-800 dark:text-slate-200">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {formik.values.description || "*No description yet...*"}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <textarea
                    ref={textareaRef}
                    name="description"
                    className="w-full min-h-[250px] p-6 bg-transparent border-none outline-none text-stone-800 dark:text-white font-medium placeholder:text-stone-300 dark:placeholder:text-slate-600 resize-y"
                    placeholder="Tell us about the cat... Use markdown for formatting!"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                )}
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 font-black py-6 rounded-md shadow-2xl transition-all active:scale-[0.98] uppercase tracking-[0.3em] text-xs disabled:opacity-50"
          >
            {formik.isSubmitting ? 'Sending...' : 'Publish Sighting'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCat;
