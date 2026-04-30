import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { 
    CheckCircle2, 
    Clock, 
    AlertCircle, 
    XCircle, 
    ChevronRight, 
    MoreHorizontal,
    Search,
    Filter,
    ArrowUpRight,
    MessageSquare,
    Eye
} from 'lucide-react';
import type { Report } from '@/types/index';
import { useAuthStore } from '@/store/authStore';

export default function InstansiDashboardPage() {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();

    const { data: response, isLoading } = useQuery({
        queryKey: ['instansi-reports'],
        queryFn: async () => {
            const res = await axios.get('/api/instansi/reports');
            return res.data;
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ reportId, status }: { reportId: number, status: string }) => {
            await axios.patch(`/api/reports/${reportId}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instansi-reports'] });
        }
    });

    const reports = response?.data || [];

    const stats = {
        total: reports.length,
        baru: reports.filter((r: Report) => r.status === 'baru').length,
        diproses: reports.filter((r: Report) => r.status === 'diproses').length,
        selesai: reports.filter((r: Report) => r.status === 'selesai').length,
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'baru': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'diproses': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'selesai': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'ditolak': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    if (isLoading) {
        return <div className="flex h-96 items-center justify-center">Loading reports...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Selamat Datang, {user?.name}</h1>
                    <p className="text-slate-500 font-medium">Kelola laporan warga di wilayah {user?.instansi?.nama_instansi || 'Anda'} secara real-time.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all flex items-center space-x-2">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                    <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center space-x-2">
                        <span>Unduh Laporan (CSV)</span>
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Laporan', value: stats.total, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Belum Ditinjau', value: stats.baru, icon: AlertCircle, color: 'text-slate-600', bg: 'bg-slate-100' },
                    { label: 'Sedang Diproses', value: stats.diproses, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Selesai', value: stats.selesai, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Table Section */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900">Laporan Masuk Terbaru</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Cari ID atau judul..." 
                            className="pl-10 pr-4 py-2 bg-slate-100/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pelapor</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Informasi Laporan</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {reports.map((report: Report) => (
                                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                                {report.user?.name?.charAt(0) || 'A'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">{report.user?.name || 'Anonim'}</p>
                                                <p className="text-xs text-slate-500">{new Date(report.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 max-w-md">
                                        <p className="font-bold text-slate-900 text-sm mb-1">{report.judul}</p>
                                        <p className="text-xs text-slate-500 line-clamp-1">{report.deskripsi}</p>
                                        <div className="flex items-center mt-2 space-x-2">
                                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase">{report.kategori}</span>
                                            <span className="text-[10px] text-slate-400 flex items-center">
                                                <MapPin size={10} className="mr-0.5" /> {report.kelurahan}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(report.status)}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <select 
                                                value={report.status}
                                                onChange={(e) => updateStatusMutation.mutate({ reportId: report.id, status: e.target.value })}
                                                className="bg-slate-100 border-none rounded-xl text-xs font-bold py-1.5 px-3 focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                            >
                                                <option value="baru">Set Baru</option>
                                                <option value="diproses">Proses</option>
                                                <option value="selesai">Selesai</option>
                                                <option value="ditolak">Tolak</option>
                                            </select>
                                            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {reports.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic font-medium">
                                        Belum ada laporan masuk di wilayah Anda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Re-importing Lucide icons that were missing
import { FileText, MapPin } from 'lucide-react';
