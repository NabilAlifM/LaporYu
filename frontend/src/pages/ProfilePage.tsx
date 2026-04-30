import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { MapPin, LogOut, FileText, ArrowLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Report } from '@/types/index';

export function ProfilePage() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const { data: response, isLoading } = useQuery({
        queryKey: ['my-reports'],
        queryFn: async () => {
            // Because we don't have a dedicated /api/my-reports endpoint yet,
            // we will fetch all and filter for now (or backend could handle this).
            // For a production app, we should add `GET /api/user/reports`.
            const res = await axios.get('/api/reports');
            return res.data;
        },
        enabled: !!user
    });

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <h2 className="text-2xl font-bold mb-4">Anda belum login</h2>
                <button onClick={() => navigate('/login')} className="bg-primary text-white px-6 py-2 rounded-full">
                    Login Sekarang
                </button>
            </div>
        );
    }

    // Filter reports for the logged in user
    // Note: in a real app, this should be done on the backend to avoid fetching ALL reports
    const myReports: Report[] = (response?.data || []).filter((r: Report) => r.user_id === user.id);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header Profil */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="h-32 bg-gradient-to-r from-primary to-secondary/80 relative">
                    <button 
                        onClick={() => navigate(-1)}
                        className="absolute top-4 left-4 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-sm transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                </div>
                
                <div className="px-6 pb-6 relative">
                    <div className="flex justify-between items-end -mt-12 mb-4">
                        <div className="w-24 h-24 rounded-full bg-white p-1 border-4 border-white shadow-md">
                            <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center text-4xl font-bold text-slate-400">
                                {user.name.charAt(0)}
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button className="p-2 border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors">
                                <Settings size={20} />
                            </button>
                            <button onClick={handleLogout} className="p-2 border border-red-200 text-red-500 rounded-full hover:bg-red-50 transition-colors">
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                        <p className="text-slate-500">{user.email}</p>
                        
                        <div className="flex items-center space-x-4 mt-4">
                            <div className="flex items-center text-sm text-slate-600">
                                <MapPin size={16} className="mr-1" />
                                {user.kode_wilayah || 'Indonesia'}
                            </div>
                            <div className="flex items-center text-sm text-slate-600">
                                <FileText size={16} className="mr-1" />
                                {myReports.length} Laporan
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigasi */}
            <div className="bg-white border-b border-slate-200 sticky top-16 z-20">
                <div className="flex overflow-x-auto no-scrollbar">
                    <button className="px-6 py-4 text-sm font-bold text-primary border-b-2 border-primary whitespace-nowrap">
                        Laporan Saya
                    </button>
                    <button className="px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-700 whitespace-nowrap">
                        Tersimpan
                    </button>
                    <button className="px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-700 whitespace-nowrap">
                        Riwayat Komentar
                    </button>
                </div>
            </div>

            {/* List Laporan */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-8 text-slate-500">Memuat laporan...</div>
                ) : myReports.length > 0 ? (
                    myReports.map((report) => (
                        <div key={report.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex space-x-4 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => navigate(`/`)}>
                            {report.media && report.media.length > 0 ? (
                                <img 
                                    src={
                                        report.media[0].url.startsWith('http') 
                                            ? report.media[0].url 
                                            : report.media[0].url.startsWith('/') 
                                                ? report.media[0].url 
                                                : `http://localhost:8000/storage/${report.media[0].url}`
                                    }
                                    className="w-24 h-24 object-cover rounded-xl"
                                    alt="Laporan"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center">
                                    <FileText className="text-slate-400" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-slate-900 truncate">{report.judul}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2 mt-1">{report.deskripsi}</p>
                                <div className="flex items-center space-x-3 mt-2 text-xs text-slate-500">
                                    <span className="bg-secondary/20 text-secondary-foreground px-2 py-0.5 rounded font-medium">
                                        {report.kategori}
                                    </span>
                                    <span>•</span>
                                    <span className={`font-medium ${
                                        report.status === 'baru' ? 'text-blue-500' :
                                        report.status === 'diproses' ? 'text-yellow-500' :
                                        report.status === 'selesai' ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                        {report.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="text-slate-300" size={32} />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">Belum Ada Laporan</h3>
                        <p className="text-slate-500">Anda belum pernah membuat laporan apapun.</p>
                        <button onClick={() => navigate('/create')} className="mt-4 text-primary font-bold hover:underline">
                            Buat Laporan Sekarang
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
