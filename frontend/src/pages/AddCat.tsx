import React, { useState, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MapPin, Camera, Bold, Italic, Link as LinkIcon, Eye, PenLine } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from "../api/axios.ts"
import { useNavigate } from "react-router-dom"

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const CatSchema = Yup.object().shape({
  title: Yup.string().min(3, 'Title is too short').required('Title is required'),
  description: Yup.string().min(10, 'Add more details!').required('Description is required'),
  latitude: Yup.number().required('Mark where the cat is'),
  longitude: Yup.number().required(),
  image: Yup.mixed().required('A photo is required!')
});

const AddCat = () => {
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        formik.setFieldValue('latitude', e.latlng.lat);
        formik.setFieldValue('longitude', e.latlng.lng);
      },
    });
    return null;
  };

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

        if (values.image) {
          data.append('photo', values.image);
        }

        const response = await axios.post('/cats', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('streetcats_token')}`
          }
        });

        if (response.status === 201) {
          navigate(`/catdetails/${response.data.id}`);
        }
      } catch (error: any) {
        console.error("Error", error);
        alert(error.response?.data?.message || "An error has occurred");
      } finally {
        setSubmitting(false);
      }
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      formik.setFieldValue('image', file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const insertMarkdown = (syntax: string) => {
    const textarea = document.getElementById('description') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formik.values.description;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const selectedText = text.substring(start, end) || "text";

    let newText = "";
    if (syntax === 'bold') newText = `${before}**${selectedText}**${after}`;
    if (syntax === 'italic') newText = `${before}_${selectedText}_${after}`;
    if (syntax === 'link') newText = `${before}[${selectedText}](https://example.com)${after}`;

    formik.setFieldValue('description', newText);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 py-10 dark:bg-slate-800">
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <form onSubmit={formik.handleSubmit} className="space-y-6">

          {/* PHOTO UPLOAD */}
          <div className="dark:bg-slate-600 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-4 text-left dark:text-white">Cat Photo</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden dark:bg-slate-600 ${formik.errors.image ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-orange-400'}`}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Camera className="text-gray-400 mb-2" size={32} />
                  <span className="text-sm text-gray-500">Click to upload a photo</span>
                </>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            </div>
            {formik.errors.image && <p className="text-red-500 text-xs mt-2 text-left">{formik.errors.image as string}</p>}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 dark:bg-slate-600">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-left dark:text-white">Title</label>
              <input
                name="title"
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                onChange={formik.handleChange}
                value={formik.values.title}
                placeholder="Give this kitty a title"
              />
              {formik.touched.title && formik.errors.title && <p className="text-red-500 text-xs mt-1 text-left">{formik.errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-left dark:text-white">Location (Click on the map)</label>
              <div className="rounded-xl h-64 overflow-hidden border border-gray-200 z-0 relative">
                <MapContainer center={[formik.values.latitude, formik.values.longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <MapEvents />
                  <Marker position={[formik.values.latitude, formik.values.longitude]} />
                </MapContainer>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 dark:bg-slate-600">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-gray-700 dark:text-white">Describe your encounter</label>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button type="button" onClick={() => setPreviewMode('edit')} className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${previewMode === 'edit' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}>
                  <PenLine size={14} /> Write
                </button>
                <button type="button" onClick={() => setPreviewMode('preview')} className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1 ${previewMode === 'preview' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}>
                  <Eye size={14} /> Preview
                </button>
              </div>
            </div>

            {previewMode === 'edit' ? (
              <div className="space-y-2">
                <div className="flex gap-2 border-b border-gray-100 pb-2">
                  <button type="button" onClick={() => insertMarkdown('bold')} className="p-2 hover:bg-gray-100 rounded text-gray-600 dark:text-white"><Bold size={18} /></button>
                  <button type="button" onClick={() => insertMarkdown('italic')} className="p-2 hover:bg-gray-100 rounded text-gray-600 dark:text-white"><Italic size={18} /></button>
                  <button type="button" onClick={() => insertMarkdown('link')} className="p-2 hover:bg-gray-100 rounded text-gray-600 dark:text-white"><LinkIcon size={18} /></button>
                </div>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  className="w-full py-2 outline-none resize-none text-gray-700 dark:text-white bg-transparent"
                  placeholder="Describe how the cat was..."
                />
              </div>
            ) : (
              <div className="prose prose-orange min-h-[160px] text-gray-700 text-left dark:text-white">
                {formik.values.description ? <ReactMarkdown>{formik.values.description}</ReactMarkdown> : <span className="text-gray-400 italic text-sm">No description provided.</span>}
              </div>
            )}
            {formik.touched.description && formik.errors.description && <p className="text-red-500 text-xs mt-1 text-left">{formik.errors.description}</p>}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-amber-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform hover:-translate-y-1"
          >
            {formik.isSubmitting ? 'Publishing...' : 'Publish Sighting'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCat;
