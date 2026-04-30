import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getReports } from '@/services/api';
import type { Report } from '@/types/index';
import { Search, MapPin, Navigation, Info, ChevronRight, X, Clock } from 'lucide-react';

// Custom Marker styling (using divIcon for a modern look instead of default pin)
const createCustomIcon = (isActive: boolean) => L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
        <div style="
            width: ${isActive ? '36px' : '28px'};
            height: ${isActive ? '36px' : '28px'};
            background-color: ${isActive ? '#2563eb' : '#ffffff'};
            border: 3px solid ${isActive ? '#ffffff' : '#2563eb'};
            border-radius: 50%;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            transition: all 0.2s ease-in-out;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <svg width="${isActive ? '18' : '14'}" height="${isActive ? '18' : '14'}" viewBox="0 0 24 24" fill="none" stroke="${isActive ? '#ffffff' : '#2563eb'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
            </svg>
        </div>
    `,
    iconSize: [isActive ? 36 : 28, isActive ? 36 : 28],
    iconAnchor: [isActive ? 18 : 14, isActive ? 36 : 28],
});

// Component to handle map centering when a report is selected
function MapController({ center }: { center: [number, number] | null }) {
    const map = useMap();
    React.useEffect(() => {
        if (center) {
            map.flyTo(center, 15, { duration: 1.5 });
        }
    }, [center, map]);
    return null;
}

export default function ExplorePage() {
    const navigate = useNavigate();
    const [activeReportId, setActiveReportId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: response, isLoading } = useQuery({
        queryKey: ['reports'],
        queryFn: getReports
    });

    const reports = Array.isArray(response?.data) ? response.data : [];

    const filteredReports = reports.filter((report: Report) => 
        report.judul.toLowerCase().includes(searchQuery.toLowerCase()) || 
        report.kategori.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeReport = reports.find((r: Report) => r.id === activeReportId);
    
    // Default center (Jakarta)
    const mapCenter: [number, number] = activeReport 
        ? [(activeReport.latitude ?? -6.2088), (activeReport.longitude ?? 106.8456)]
        : [-6.2088, 106.8456];

    return (
        <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-100 overflow-hidden rounded-xl md:rounded-none animate-in fade-in duration-300">
            {/* Map Container */}
            <div className="absolute inset-0 z-0">
                <MapContainer center={mapCenter} zoom={13} zoomControl={false} className="w-full h-full">
                    {/* Light/White theme: CartoDB Positron */}
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    
                    {filteredReports.map((report: Report) => {
                        const lat = report.latitude ?? 0;
                        const lng = report.longitude ?? 0;
                        
                        if (lat === 0 && lng === 0) return null;

                        return (
                            <Marker 
                                key={report.id} 
                                position={[lat, lng]}
                                icon={createCustomIcon(activeReportId === report.id)}
                                eventHandlers={{
                                    click: () => setActiveReportId(report.id)
                                }}
                            />
                        );
                    })}
                    <MapController center={activeReportId ? mapCenter : null} />
                </MapContainer>
            </div>

            {/* Floating Left Sidebar (Apple Find My style) */}
            <div className="absolute top-4 left-4 bottom-4 w-80 flex flex-col z-10 pointer-events-none hidden md:flex">
                
                {/* Search / List Panel */}
                <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl flex flex-col h-full pointer-events-auto border border-white/50 overflow-hidden">
                    
                    <div className="p-4 border-b border-slate-100/50 bg-white/50">
                        <h2 className="text-xl font-bold text-slate-900 mb-3">Jelajahi</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari lokasi atau laporan..."
                                className="w-full bg-slate-100/80 border-none rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
                        {isLoading ? (
                            <div className="p-4 text-center text-slate-500 text-sm">Memuat lokasi...</div>
                        ) : filteredReports.length > 0 ? (
                            filteredReports.map((report: Report) => (
                                <button
                                    key={report.id}
                                    onClick={() => setActiveReportId(report.id)}
                                    className={`w-full text-left p-3 rounded-xl flex items-center space-x-3 transition-all ${
                                        activeReportId === report.id 
                                        ? 'bg-primary/10 border border-primary/20 shadow-sm' 
                                        : 'hover:bg-slate-100/80 border border-transparent'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        activeReportId === report.id ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'
                                    }`}>
                                        <MapPin size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900 text-sm truncate">{report.judul}</h4>
                                        <p className="text-xs text-slate-500 truncate mt-0.5">daerah {report.kelurahan} di {report.kota}</p>
                                    </div>
                                    <ChevronRight size={16} className={activeReportId === report.id ? 'text-primary' : 'text-slate-300'} />
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-center text-slate-500 text-sm">Tidak ada laporan ditemukan di area ini.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Detail Panel (Appears when a marker is clicked) */}
            {activeReport && (
                <div className="absolute top-4 right-4 w-80 md:w-96 z-20 pointer-events-auto animate-in slide-in-from-right-8 fade-in duration-300">
                    <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/50 overflow-hidden">
                        
                        {/* Header Image (Optional) */}
                        {activeReport.media && activeReport.media.length > 0 ? (
                            <div className="h-40 w-full bg-slate-200 relative">
                                <img 
                                    src={
                                        activeReport.media[0].url.startsWith('http') 
                                            ? activeReport.media[0].url 
                                            : activeReport.media[0].url.startsWith('/') 
                                                ? activeReport.media[0].url 
                                                : `http://localhost:8000/storage/${activeReport.media[0].url}`
                                    }
                                    alt="Lokasi"
                                    className="w-full h-full object-cover"
                                />
                                <button 
                                    onClick={() => setActiveReportId(null)}
                                    className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="h-20 w-full bg-gradient-to-br from-slate-800 to-slate-900 relative">
                                <button 
                                    onClick={() => setActiveReportId(null)}
                                    className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <div className="p-5">
                            <div className="flex items-start justify-between mb-2">
                                <h2 className="text-xl font-bold text-slate-900 leading-tight pr-4">{activeReport.judul}</h2>
                            </div>
                            
                            <p className="text-sm text-slate-500 flex items-center mb-4">
                                <MapPin size={14} className="mr-1 flex-shrink-0" />
                                <span className="truncate">daerah {activeReport.kelurahan} di {activeReport.kota}</span>
                            </p>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <button className="bg-primary/10 hover:bg-primary/20 text-primary font-bold py-2.5 rounded-xl flex flex-col items-center justify-center transition-colors">
                                    <Navigation size={20} className="mb-1" />
                                    <span className="text-xs">Rute</span>
                                </button>
                                <button 
                                    onClick={() => navigate('/')}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl flex flex-col items-center justify-center transition-colors"
                                >
                                    <Info size={20} className="mb-1" />
                                    <span className="text-xs">Detail Laporan</span>
                                </button>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <h4 className="font-bold text-sm text-slate-900 mb-1">Informasi</h4>
                                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
                                    {activeReport.deskripsi}
                                </p>
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400">
                                    <span className="flex items-center"><Clock size={12} className="mr-1" /> {new Date(activeReport.created_at).toLocaleDateString('id-ID')}</span>
                                    <span>Pelapor: {activeReport.user?.name || 'Anonim'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Mobile View Toggle List (Optional bottom sheet trigger could go here) */}
        </div>
    );
}
