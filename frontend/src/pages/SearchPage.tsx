import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon, MapPin, Filter } from 'lucide-react';
import { getReports } from '@/services/api';
import type { Report } from '@/types/index';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { Link } from 'react-router-dom';

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('Semua');
    const [activeKota, setActiveKota] = useState('Semua Kota');
    const { user } = useAuthStore();
    const { openLoginPrompt, setActiveReportId, setIsCommentsOpen } = useUIStore();

    const { data: response, isLoading } = useQuery({
        queryKey: ['reports'],
        queryFn: getReports
    });

    const reports = Array.isArray(response?.data) ? response.data : [];

    const realInstansis = [
        { name: 'Semua Instansi', short: 'ALL', category: 'Semua', image: '/Logo.png' },
        { name: 'Kementerian PUPR', short: 'PUPR', category: 'Infrastruktur & Fasilitas Umum', image: '/pupr.png' },
        { name: 'Kementerian Lingkungan Hidup', short: 'KLHK', category: 'Kebersihan & Lingkungan', image: '/hutan.png' },
        { name: 'Kepolisian Negara RI', short: 'POLRI', category: 'Keamanan & Ketertiban', image: '/polri.png' },
        { name: 'Kementerian Dalam Negeri', short: 'KDN', category: 'Layanan Publik & Administrasi', image: '/kementriannegri.jpg' },
        { name: 'Kementerian Kesehatan', short: 'Kemenkes', category: 'Kesehatan', image: '/kesehhatan.png' },
        { name: 'Kementerian Pendidikan', short: 'Kemendikbud', category: 'Pendidikan', image: '/Kemendikbud.jpg' },
        { name: 'Kementerian Sosial', short: 'Kemensos', category: 'Sosial & Kemasyarakatan', image: '/sosial.jpg' },
    ];

    const filteredReports = reports.filter((report: Report) => {
        const matchesQuery = report.judul.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             report.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             report.kategori.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesFilter = activeFilter === 'Semua' || report.kategori === activeFilter;
        const matchesKota = activeKota === 'Semua Kota' || report.kota === activeKota || report.kelurahan === activeKota;

        return matchesQuery && matchesFilter && matchesKota;
    });

    // Extract dynamic data from reports
    const uniqueKotas = ['Semua Kota', ...Array.from(new Set(reports.map((r: Report) => r.kota || r.kelurahan).filter(Boolean)))];
    
    // Count reports per category for the cards
    const reportCounts = reports.reduce((acc: any, report: Report) => {
        acc[report.kategori] = (acc[report.kategori] || 0) + 1;
        return acc;
    }, {});
    reportCounts['Semua'] = reports.length;

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in duration-300">
            {/* Search Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sticky top-16 z-20">
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari laporan, kategori, atau lokasi..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                </div>
                
                <div className="flex flex-col space-y-3 mt-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 text-sm">Filter Instansi</h3>
                        <select 
                            value={activeKota}
                            onChange={(e) => setActiveKota(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary appearance-none font-medium"
                        >
                            {uniqueKotas.map((kota: any) => (
                                <option key={kota} value={kota}>{kota}</option>
                            ))}
                        </select>
                    </div>

                    {/* Instansi Cards (Horizontal Scroll) */}
                    <div className="flex items-center space-x-3 overflow-x-auto pb-4 pt-1 no-scrollbar snap-x">
                        {realInstansis.map((instansi) => {
                            const isActive = activeFilter === instansi.category;
                            const count = reportCounts[instansi.category] || 0;
                            
                            return (
                                <button
                                    key={instansi.category}
                                    onClick={() => setActiveFilter(instansi.category)}
                                    className={`flex items-center p-3 min-w-[240px] rounded-2xl border transition-all snap-start text-left ${
                                        isActive 
                                        ? 'bg-white border-primary shadow-md shadow-primary/10 ring-1 ring-primary/50' 
                                        : 'bg-white border-slate-200 hover:border-primary/40 hover:shadow-sm'
                                    }`}
                                >
                                    {/* Logo Image */}
                                    <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white mr-3 flex-shrink-0 border ${
                                        isActive ? 'border-primary' : 'border-slate-100'
                                    }`}>
                                        <img src={instansi.image} alt={instansi.name} className="w-full h-full object-contain p-1" />
                                    </div>
                                    
                                    {/* Text Info */}
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-bold text-slate-800 text-sm truncate">{instansi.name}</span>
                                        <span className="text-xs text-slate-500 mt-0.5">{count} Laporan</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Search Results */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-sm text-slate-400 font-medium">Mencari...</p>
                    </div>
                ) : filteredReports.length > 0 ? (
                    filteredReports.map((report: Report) => (
                        <div key={report.id} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                        {report.user?.name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 leading-tight">{report.user?.name}</h3>
                                        <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{report.kategori}</span>
                                            <span>•</span>
                                            <span>{new Date(report.created_at).toLocaleDateString('id-ID')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <h4 className="font-bold text-lg text-slate-900 mb-2">{report.judul}</h4>
                            <p className="text-sm text-slate-700 leading-relaxed line-clamp-2">{report.deskripsi}</p>
                            
                            {report.media && report.media.length > 0 && (
                                <div className="mt-3 w-full h-40 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                                    <img 
                                        src={`http://localhost:8000/storage/${report.media[0].file_path}`} 
                                        alt="Lampiran laporan" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center text-xs text-slate-500 font-medium">
                                    <MapPin size={14} className="mr-1" />
                                    <span className="truncate max-w-[200px]">daerah {report.kelurahan} di {report.kota}</span>
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveReportId(report.id);
                                        setIsCommentsOpen(true);
                                    }}
                                    className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                                >
                                    Lihat Diskusi
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-slate-100">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <SearchIcon size={24} className="text-slate-300" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">Pencarian Tidak Ditemukan</h3>
                        <p className="text-sm text-slate-500">Coba gunakan kata kunci atau kategori lain.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
