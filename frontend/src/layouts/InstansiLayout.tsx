import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LogOut, Home, FileText, Settings, BarChart2 } from 'lucide-react';

export default function InstansiLayout() {
    const { user, isInitialized, logout } = useAuthStore();

    if (!isInitialized) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'instansi') {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-primary">Dasbor Instansi</h1>
                </div>
                
                <nav className="flex-1 px-4 space-y-2">
                    <Link to="/instansi/dashboard" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium">
                        <Home size={20} />
                        <span>Beranda</span>
                    </Link>
                    <Link to="/instansi/reports" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                        <FileText size={20} />
                        <span>Laporan Masuk</span>
                    </Link>
                    <Link to="/instansi/statistics" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                        <BarChart2 size={20} />
                        <span>Statistik</span>
                    </Link>
                    <Link to="/instansi/settings" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                        <Settings size={20} />
                        <span>Pengaturan</span>
                    </Link>
                </nav>
                
                <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold mr-3">
                            {user.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate capitalize">Instansi</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => logout()}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                        <LogOut size={16} />
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}
