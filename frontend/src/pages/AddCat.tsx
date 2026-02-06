import React, { useState, useRef, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Camera, Bold, Italic, Link as LinkIcon, Maximize2, Check, ArrowLeft, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import axios from "../api/axios.ts";
import { useNavigate } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import { AuthContext } from "../context/AuthProvider";
import 'leaflet/dist/leaflet.css';

const CatSchema = Yup.object().shape({
  title: Yup.string().min(3, 'Title is too short').required('Title is required'),
  description: Yup.string().min(10, 'Add more details!').required('Description is required'),
  latitude: Yup.number().required('Mark the location on the map'),
  longitude: Yup.number().required(),
  image: Yup.mixed().required('A photo is required!')
});

const AddCat = () => {
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [realUserPos, setRealUserPos] = useState<[number, number]>([41.8902, 12.4922]);
  const [shouldMapRecenter, setShouldMapRecenter] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
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
    validateOnBlur: true,
    validateOnChange: false,
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
      } catch (error: any) {
        console.error("Submission error:", error);
        alert("Server Error: Check your backend connection");
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

  const insertMarkdown = (syntax: string) => {
    const textarea = document.getElementById('description') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formik.values.description;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const selectedText = text.substring(start, end) || "text";

    let newText = text;
    if (syntax === 'bold') newText = `${before}**${selectedText}**${after}`;
    if (syntax === 'italic') newText = `${before}_${selectedText}_${after}`;
    if (syntax === 'link') {
      let url = prompt("Enter URL:", "https://");
      if (url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }
        newText = `${before}[${selectedText}](${url})${after}`;
      }
    }

    formik.setFieldValue('description', newText);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-900 pb-20 py-10 transition-colors duration-300 font-sans">
      <div className="max-w-3xl mx-auto px-4 pt-8 text-left">

        <header className="mb-10 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-stone-100 dark:border-slate-700 hover:scale-105 transition-transform"
          >
            <ArrowLeft size={20} className="text-stone-600 dark:text-stone-300" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-stone-800 dark:text-white uppercase italic tracking-tighter">New Report</h1>
            <p className="text-stone-500 dark:text-slate-400 text-sm font-medium uppercase tracking-widest text-[10px]">Mark a new street cat</p>
          </div>
        </header>

        <form onSubmit={formik.handleSubmit} className="space-y-6">

          {/* PHOTO SECTION */}
          <section className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-xl border border-stone-100 dark:border-slate-700">
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
            {formik.touched.image && formik.errors.image && (
              <p className="text-red-500 text-[10px] font-bold mt-2 flex items-center gap-1 uppercase italic"><AlertCircle size={12} /> {formik.errors.image}</p>
            )}
          </section>

          <section className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-xl border border-stone-100 dark:border-slate-700 space-y-6">
            <div>
              <label className="block text-[10px] font-black text-stone-400 dark:text-slate-500 mb-2 uppercase tracking-[0.2em]">Title / Nickname</label>
              <input
                name="title"
                type="text"
                className={`w-full px-6 py-4 rounded-2xl bg-stone-50 dark:bg-slate-900 border-none outline-none text-stone-800 dark:text-white font-bold placeholder:text-stone-300 dark:placeholder:text-slate-600 transition-all ${formik.touched.title && formik.errors.title ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-amber-500'}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                placeholder="Ex: The harbor ginger cat"
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-red-500 text-[10px] font-bold mt-2 flex items-center gap-1 uppercase italic"><AlertCircle size={12} /> {formik.errors.title}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] font-black text-stone-400 dark:text-slate-500 uppercase tracking-[0.2em]">Sighting Location</label>
                <button type="button" onClick={() => setIsMapExpanded(true)} className="text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase flex items-center gap-1.5 hover:opacity-70">
                  <Maximize2 size={14} /> Full Screen
                </button>
              </div>

              <div className={`transition-all duration-500 ease-in-out ${isMapExpanded ? 'fixed inset-0 z-[1000] bg-white dark:bg-slate-900' : 'relative h-72 rounded-[1.8rem] overflow-hidden border border-stone-100 dark:border-slate-700 shadow-inner'}`}>
                {isMapExpanded && (
                  <div className="absolute top-8 left-0 right-0 z-[1001] px-4 flex justify-between items-center max-w-2xl mx-auto">
                    <button type="button" onClick={() => setIsMapExpanded(false)} className="bg-stone-900/90 dark:bg-slate-800/90 backdrop-blur-xl text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-2xl">
                      <ArrowLeft size={18} /> Close
                    </button>
                    <div onClick={() => setIsMapExpanded(false)} className="cursor-pointer bg-amber-500 text-stone-900 px-6 py-3 rounded-2xl font-black uppercase text-xs shadow-2xl flex items-center gap-2">
                      <Check size={18} strokeWidth={3} /> Confirm
                    </div>
                  </div>
                )}
                <MapComponent
                  key={isMapExpanded ? 'expanded' : 'mini'}
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
          </section>

          {/* DESCRIPTION SECTION */}
          <section className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-xl border border-stone-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <label className="text-[10px] font-black text-stone-400 dark:text-slate-500 uppercase tracking-[0.2em]">Description</label>
              <div className="flex bg-stone-100 dark:bg-slate-900 p-1 rounded-xl">
                <button type="button" onClick={() => setPreviewMode('edit')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${previewMode === 'edit' ? 'bg-white dark:bg-slate-800 shadow-sm text-amber-600' : 'text-stone-400'}`}>Edit</button>
                <button type="button" onClick={() => setPreviewMode('preview')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${previewMode === 'preview' ? 'bg-white dark:bg-slate-800 shadow-sm text-amber-600' : 'text-stone-400'}`}>Preview</button>
              </div>
            </div>

            {previewMode === 'edit' ? (
              <div className="space-y-4">
                <div className="flex gap-2 border-b border-stone-50 dark:border-slate-700 pb-2">
                  <button type="button" onClick={() => insertMarkdown('bold')} className="p-2 text-stone-600 dark:text-slate-400 hover:bg-stone-50 dark:hover:bg-slate-700 rounded-lg"><Bold size={18} /></button>
                  <button type="button" onClick={() => insertMarkdown('italic')} className="p-2 text-stone-600 dark:text-slate-400 hover:bg-stone-50 dark:hover:bg-slate-700 rounded-lg"><Italic size={18} /></button>
                  <button type="button" onClick={() => insertMarkdown('link')} className="p-2 text-stone-600 dark:text-slate-400 hover:bg-stone-50 dark:hover:bg-slate-700 rounded-lg"><LinkIcon size={18} /></button>
                </div>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full py-2 outline-none resize-none text-stone-700 dark:text-slate-200 bg-transparent font-medium"
                  placeholder="Tell us more about the encounter..."
                />
              </div>
            ) : (
              <div className="prose prose-stone dark:prose-invert max-w-none min-h-[150px] text-stone-600 dark:text-slate-400">
                {formik.values.description ? (
                  <ReactMarkdown
                    components={{
                      em: ({ ...props }) => <i className="italic font-serif" {...props} />,
                      strong: ({ ...props }) => <b className="font-black text-black dark:text-white" {...props} />,
                      a: ({ href, ...props }) => {
                        // Se il link non ha il protocollo, lo forziamo per evitare redirect a localhost
                        const safeHref = (href?.startsWith('http://') || href?.startsWith('https://'))
                          ? href
                          : `https://${href}`;
                        return (
                          <a
                            {...props}
                            href={safeHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-500 underline font-bold hover:text-amber-600 transition-colors"
                          />
                        );
                      }
                    }}
                  >
                    {formik.values.description}
                  </ReactMarkdown>
                ) : (
                  <span className="italic opacity-50 text-xs">Nothing to preview yet...</span>
                )}
              </div>
            )}
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-[10px] font-bold mt-2 flex items-center gap-1 uppercase italic"><AlertCircle size={12} /> {formik.errors.description}</p>
            )}
          </section>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-900 font-black py-6 rounded-[2rem] shadow-2xl transition-all active:scale-[0.98] uppercase tracking-[0.3em] text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? 'Sending...' : 'Publish Sighting'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCat;
