import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { MapPin, UploadCloud, ChevronLeft, Loader2, Map as MapIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icon in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function LocationPicker({ position, setPosition, setLokasiManual }: { position: [number, number], setPosition: (pos: [number, number]) => void, setLokasiManual: (text: string) => void }) {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
            setLokasiManual(`${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export default function CreateReportPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuthStore();

    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [kategori, setKategori] = useState('Infrastruktur & Fasilitas Umum');
    const [lokasiManual, setLokasiManual] = useState('');
    const [showMap, setShowMap] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    
    // Default to Jakarta
    const [position, setPosition] = useState<[number, number]>([-6.2088, 106.8456]);

    const categories = [
        'Infrastruktur & Fasilitas Umum',
        'Kebersihan & Lingkungan',
        'Keamanan & Ketertiban',
        'Layanan Publik & Administrasi',
        'Kesehatan',
        'Pendidikan',
        'Sosial & Kemasyarakatan'
    ];

    const createMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const res = await axios.post('/api/reports', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data;
        },
        onSuccess: () => {
            alert('Laporan berhasil dikirim!');
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            navigate('/');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!judul || !deskripsi || !image) return;

        const formData = new FormData();
        formData.append('judul', judul);
        formData.append('deskripsi', deskripsi);
        formData.append('kategori', kategori);
        formData.append('media[]', image);
        
        // Simulating reverse geocoding or manual input mapping
        // In a real app, you'd use a geocoding API to convert lat/lng to kelurahan/kecamatan
        formData.append('kelurahan', lokasiManual || 'Area Terpilih');
        formData.append('kecamatan', 'Kecamatan');
        formData.append('kota', 'Kota');
        formData.append('provinsi', 'Provinsi');
        formData.append('latitude', position[0].toString());
        formData.append('longitude', position[1].toString());

        createMutation.mutate(formData);
    };

    return (
        <div className="w-full max-w-2xl mx-auto pb-20 animate-in fade-in duration-300">
            {/* Header */}
            <div className="bg-white p-4 flex items-center mb-6 border-b border-slate-100">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors mr-2"
                >
                    <ChevronLeft size={24} className="text-slate-700" />
                </button>
                <h1 className="text-xl font-bold text-slate-900">Buat Laporan Baru</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 px-4 sm:px-0">
                {/* Judul & Kategori */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Judul Laporan</label>
                        <input 
                            type="text" 
                            value={judul}
                            onChange={(e) => setJudul(e.target.value)}
                            placeholder="Contoh: Jalan berlubang di depan pasar"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Kategori</label>
                        <select 
                            value={kategori}
                            onChange={(e) => setKategori(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Deskripsi */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Deskripsi Detail</label>
                    <textarea 
                        value={deskripsi}
                        onChange={(e) => setDeskripsi(e.target.value)}
                        placeholder="Jelaskan kronologi atau kondisi secara lengkap..."
                        rows={5}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                        required
                    ></textarea>
                </div>

                {/* Lokasi */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-bold text-slate-700">Titik Lokasi</label>
                        <button 
                            type="button"
                            onClick={() => setShowMap(!showMap)}
                            className="text-xs font-bold text-primary flex items-center hover:bg-primary/10 px-3 py-1.5 rounded-full transition-colors"
                        >
                            <MapIcon size={14} className="mr-1" />
                            {showMap ? 'Sembunyikan Peta' : 'Pilih dari Peta'}
                        </button>
                    </div>

                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            value={lokasiManual}
                            onChange={(e) => setLokasiManual(e.target.value)}
                            placeholder="Tulis alamat manual (opsional jika sudah pin peta)"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        />
                    </div>

                    {showMap && (
                        <div className="h-64 w-full rounded-xl overflow-hidden border border-slate-200 mt-3 relative z-0">
                            <MapContainer center={position} zoom={13} scrollWheelZoom={true} className="h-full w-full">
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                />
                                <LocationPicker position={position} setPosition={setPosition} setLokasiManual={setLokasiManual} />
                            </MapContainer>
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-slate-700 shadow-sm z-[1000] pointer-events-none">
                                Klik peta untuk memindah pin
                            </div>
                        </div>
                    )}
                </div>

                {/* Lampiran */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
                    <label className="block text-sm font-bold text-slate-700 mb-3">Foto Bukti <span className="text-red-500">*wajib</span></label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                const file = e.target.files[0];
                                setImage(file);
                                const reader = new FileReader();
                                reader.onload = (e) => setImagePreview(e.target?.result as string);
                                reader.readAsDataURL(file);
                            }
                        }}
                    />
                    {imagePreview ? (
                        <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-white text-slate-900 font-bold px-4 py-2 rounded-full shadow-sm hover:scale-105 transition-transform"
                                >
                                    Ganti Foto
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <UploadCloud size={24} className="text-primary" />
                            </div>
                            <p className="text-sm font-bold text-slate-700">Ketuk untuk unggah foto</p>
                            <p className="text-xs text-slate-400 mt-1">Maksimal 5MB (JPG, PNG)</p>
                        </div>
                    )}
                </div>

                {/* Submit */}
                <button 
                    type="submit"
                    disabled={createMutation.isPending || !judul || !deskripsi || !image}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center"
                >
                    {createMutation.isPending ? (
                        <>
                            <Loader2 className="animate-spin mr-2" size={20} />
                            Mengirim...
                        </>
                    ) : 'Kirim Laporan'}
                </button>
            </form>
        </div>
    );
}
