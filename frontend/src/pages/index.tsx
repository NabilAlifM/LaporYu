import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Heart, MessageCircle, Send, MapPin, Image as ImageIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getReports } from '@/services/api';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { fetchUser } = useAuthStore();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.get('/sanctum/csrf-cookie');
            await axios.post('/api/login', { email, password });
            await fetchUser();
            // AuthStore will be updated, App.tsx will handle the redirect based on role
            navigate('/'); 
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal login. Periksa kembali email dan password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold mb-6">Masuk ke Akun</h2>
            
            {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4 border border-destructive/20">
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="nama@email.com"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="••••••••"
                    />
                </div>
                
                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors font-medium mt-6 disabled:opacity-50"
                >
                    {loading ? 'Memproses...' : 'Masuk'}
                </button>
            </form>
            
            <p className="mt-6 text-center text-sm text-slate-600">
                Belum punya akun? <Link to="/register" className="text-primary hover:underline font-medium">Daftar sekarang</Link>
            </p>
        </div>
    );
}

export function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { fetchUser } = useAuthStore();
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (password !== passwordConfirmation) {
            setError('Konfirmasi password tidak cocok');
            return;
        }

        setLoading(true);

        try {
            await axios.get('/sanctum/csrf-cookie');
            await axios.post('/api/register', { 
                name, 
                email, 
                password,
                password_confirmation: passwordConfirmation,
                role: 'user' // Default register is for user/warga
            });
            await fetchUser();
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal mendaftar. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold mb-6">Daftar Akun Baru</h2>
            
            {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4 border border-destructive/20">
                    {error}
                </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="nama@email.com"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="••••••••"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Konfirmasi Password</label>
                    <input 
                        type="password" 
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="••••••••"
                    />
                </div>
                
                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors font-medium mt-6 disabled:opacity-50"
                >
                    {loading ? 'Memproses...' : 'Daftar'}
                </button>
            </form>
            
            <p className="mt-6 text-center text-sm text-slate-600">
                Sudah punya akun? <Link to="/login" className="text-primary hover:underline font-medium">Masuk di sini</Link>
            </p>
        </div>
    );
}

export function DashboardPage() {
    const { user } = useAuthStore();
    const { openLoginPrompt } = useUIStore();

    const { data: response, isLoading, isError, error } = useQuery({
        queryKey: ['reports'],
        queryFn: getReports
    });

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                                <div className="h-4 bg-slate-200 rounded w-32"></div>
                            </div>
                            <div className="h-8 bg-slate-200 rounded-lg w-20"></div>
                        </div>
                        <div className="w-full aspect-[4/5] bg-slate-200"></div>
                        <div className="p-4 space-y-3">
                            <div className="flex items-center space-x-4">
                                <div className="h-6 w-12 bg-slate-200 rounded"></div>
                                <div className="h-6 w-12 bg-slate-200 rounded"></div>
                                <div className="h-6 w-12 bg-slate-200 rounded"></div>
                            </div>
                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
                    <span className="text-2xl font-bold">!</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Gagal memuat laporan</h3>
                <p className="text-slate-500 mb-6">{(error as any)?.message || 'Terjadi kesalahan pada sistem.'}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                    Coba Lagi
                </button>
            </div>
        );
    }

    const reports = response?.data || [];

    if (reports.length === 0) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12 bg-white rounded-2xl border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Belum ada laporan</h3>
                <p className="text-slate-500">Jadilah yang pertama untuk membuat laporan!</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {reports.map((report) => (
                <article key={report.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    {/* Card Header */}
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-secondary to-primary p-[2px]">
                                <div className="w-full h-full bg-white rounded-full border-2 border-white flex items-center justify-center font-bold text-primary text-xs">
                                    {report.is_anonymous ? 'A' : report.user?.name?.charAt(0) || '?'}
                                </div>
                            </div>
                            <span className="font-bold text-slate-900 text-sm">
                                {report.is_anonymous ? 'Warga Anonim' : report.user?.name}
                            </span>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
                            Follow
                        </button>
                    </div>

                    {/* Card Media (Image) */}
                    <div className="relative w-full aspect-[4/5] bg-slate-100 flex items-center justify-center overflow-hidden">
                        {report.media && report.media.length > 0 ? (
                            <img 
                                src={`http://localhost:8000/storage/${report.media[0].file_path}`} 
                                alt="Foto Laporan" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                }}
                            />
                        ) : null}
                        
                        {/* Fallback/Placeholder if no image or image fails to load */}
                        <div className={`absolute inset-0 bg-slate-200 flex flex-col items-center justify-center text-slate-400 ${report.media && report.media.length > 0 ? 'hidden' : ''}`}>
                            <ImageIcon size={48} className="mb-2 opacity-50" />
                            <span className="text-sm font-medium">Gambar Tidak Tersedia</span>
                        </div>
                        
                        {/* Location Overlay Badge */}
                        <div className="absolute bottom-4 left-4 right-4 flex">
                            <div className="bg-primary/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-lg max-w-full">
                                <MapPin size={14} className="flex-shrink-0" />
                                <span className="text-xs font-medium truncate">{report.lokasi || 'Lokasi tidak diketahui'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Card Actions & Content */}
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4">
                                <button onClick={!user ? openLoginPrompt : undefined} className="flex items-center space-x-1.5 text-slate-700 hover:text-red-500 transition-colors">
                                    <Heart size={24} />
                                    <span className="text-sm font-bold">{report.upvotes_count || 0}</span>
                                </button>
                                <button onClick={!user ? openLoginPrompt : undefined} className="flex items-center space-x-1.5 text-slate-700 hover:text-blue-500 transition-colors">
                                    <MessageCircle size={24} />
                                    <span className="text-sm font-bold">{report.comments?.length || 0}</span>
                                </button>
                                <button onClick={!user ? openLoginPrompt : undefined} className="flex items-center space-x-1.5 text-slate-700 hover:text-slate-500 transition-colors">
                                    <Send size={24} />
                                </button>
                            </div>
                            <div className="bg-secondary/20 text-secondary-foreground px-3 py-1 rounded-full text-xs font-bold truncate max-w-[150px]">
                                {report.kategori}
                            </div>
                        </div>

                        <div className="text-sm text-slate-900 mt-2 leading-relaxed">
                            <span className="font-bold mr-2">{report.is_anonymous ? 'Warga Anonim' : report.user?.name}</span>
                            {report.deskripsi}
                        </div>
                        
                        <div className="text-xs text-slate-500 mt-2 uppercase font-medium">
                            {new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
