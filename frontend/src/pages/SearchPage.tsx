import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon, MapPin, X, ArrowUpRight } from 'lucide-react';
import { getReports } from '@/services/api';
import type { Report } from '@/types/index';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

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
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <div className="relative group">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari laporan, kategori, atau lokasi..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full text-slate-400 transition-all"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
                
                <div className="flex flex-col space-y-3 mt-4">
                    <div className="flex justify-between items-center px-1">
                        <div className="flex items-center space-x-2">
                            <h3 className="font-black text-slate-900 text-sm">Filter Instansi</h3>
                            {!isLoading && filteredReports.length > 0 && (
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                                    {filteredReports.length} Hasil
                                </span>
                            )}
                        </div>
                        <select 
                            value={activeKota}
                            onChange={(e) => setActiveKota(e.target.value)}
                            className="bg-white border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-bold cursor-pointer hover:border-primary/50 transition-all shadow-sm"
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
                                    className={`flex items-center p-3 min-w-[220px] rounded-2xl border transition-all snap-start text-left ${
                                        isActive 
                                        ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20' 
                                        : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm'
                                    }`}
                                >
                                    {/* Logo Image */}
                                    <div className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white mr-3 flex-shrink-0 border ${
                                        isActive ? 'border-primary/30' : 'border-slate-100'
                                    }`}>
                                        <img src={instansi.image} alt={instansi.name} className="w-full h-full object-contain p-1" />
                                    </div>
                                    
                                    {/* Text Info */}
                                    <div className="flex flex-col min-w-0">
                                        <span className={`font-bold text-sm truncate ${isActive ? 'text-primary' : 'text-slate-800'}`}>{instansi.name}</span>
                                        <span className="text-[10px] text-slate-500 font-bold mt-0.5 uppercase tracking-wider">{count} Laporan</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Search Results */}
            <div className="space-y-4 pb-10">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                        <div className="w-10 h-10 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-sm text-slate-400 font-bold tracking-widest uppercase">Mencari Laporan...</p>
                    </div>
                ) : filteredReports.length > 0 ? (
                    filteredReports.map((report: Report) => (
                        <div 
                            key={report.id} 
                            onClick={() => {
                                setActiveReportId(report.id);
                                setIsCommentsOpen(true);
                            }}
                            className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:border-primary/20 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                        {report.user?.name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 leading-tight text-sm">{report.user?.name}</h3>
                                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                                            <span className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full border border-slate-100">{report.kategori}</span>
                                            <span>•</span>
                                            <span>{new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                    report.status === 'selesai' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    report.status === 'diproses' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                    'bg-slate-50 text-slate-500 border-slate-100'
                                }`}>
                                    {report.status}
                                </div>
                            </div>
                            
                            <h4 className="font-black text-lg text-slate-900 mb-2 group-hover:text-primary transition-colors">{report.judul}</h4>
                            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 font-medium">{report.deskripsi}</p>
                            
                            {report.media && report.media.length > 0 && (
                                <div className="mt-4 w-full h-48 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                    <img 
                                        src={
                                            report.media[0].url.startsWith('http') 
                                                ? report.media[0].url 
                                                : report.media[0].url.startsWith('/') 
                                                    ? report.media[0].url 
                                                    : `http://localhost:8000/storage/${report.media[0].url}`
                                        } 
                                        alt="Lampiran laporan" 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            )}

                            <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-50">
                                <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    <MapPin size={12} className="mr-1 text-slate-300" />
                                    <span className="truncate max-w-[180px]">{report.kelurahan}, {report.kota}</span>
                                </div>
                                <div className="flex items-center space-x-1 text-xs font-black text-primary">
                                    <span>Lihat Diskusi</span>
                                    <ArrowUpRight size={14} />
                                </div>
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
