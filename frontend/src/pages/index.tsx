import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import axios from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Heart, MessageCircle, Send, MapPin, Image as ImageIcon, IdCard, Eye, EyeOff, ArrowBigUp, ArrowBigDown, MoreHorizontal, Share2, ArrowLeft } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReports } from '@/services/api';
import type { Report } from '@/types/index';

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
            const res = await axios.post('/api/login', { email, password });
            localStorage.setItem('token', res.data.token);
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
            <div className="flex items-center mb-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="mr-2 p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
                    type="button"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-semibold">Masuk ke Akun</h2>
            </div>

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
    const [nik, setNik] = useState('');
    const [fotoKtp, setFotoKtp] = useState<File | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
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
            const res = await axios.post('/api/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
                role: 'user', // Default  user/warga
                nik
            });
            localStorage.setItem('token', res.data.token);
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
            <div className="flex items-center mb-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="mr-2 p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
                    type="button"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-semibold">Daftar Akun Baru</h2>
            </div>

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
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Konfirmasi Password</label>
                    <div className="relative">
                        <input
                            type={showPasswordConfirmation ? 'text' : 'password'}
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                            {showPasswordConfirmation ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">NIK (Nomor Induk Kependudukan)</label>
                    <input
                        type="text"
                        value={nik}
                        onChange={(e) => setNik(e.target.value)}
                        required
                        maxLength={16}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="16 Digit NIK"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Foto KTP</label>
                    <label
                        htmlFor="foto-ktp-input"
                        className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors group"
                    >
                        {fotoKtp ? (
                            <div className="text-center p-4">
                                <ImageIcon className="mx-auto h-12 w-12 text-primary mb-2" />
                                <p className="text-sm font-medium text-slate-700 truncate max-w-[250px]">{fotoKtp.name}</p>
                                <p className="text-xs text-slate-400 mt-1">Klik untuk mengganti foto</p>
                            </div>
                        ) : (
                            <div className="text-center p-4">
                                <IdCard className="mx-auto h-16 w-16 text-slate-400 group-hover:text-primary transition-colors mb-3" strokeWidth={1.25} />
                                <p className="text-sm font-semibold text-slate-700">Unggah Foto KTP</p>
                                <p className="text-xs text-slate-400 mt-1">Ambil foto KTP Anda dengan jelas</p>
                            </div>
                        )}
                        <input
                            id="foto-ktp-input"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFotoKtp(e.target.files ? e.target.files[0] : null)}
                            required
                            className="hidden"
                        />
                    </label>
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
    const { openLoginPrompt, setActiveReportId, setIsCommentsOpen } = useUIStore();
    const navigate = useNavigate();

    const { data: response, isLoading, isError, error } = useQuery({
        queryKey: ['reports'],
        queryFn: getReports
    });
    
    const queryClient = useQueryClient();

    const reports = Array.isArray(response?.data) ? response.data : [];

    const upvoteMutation = useMutation({
        mutationFn: async (reportId: number) => {
            const res = await axios.post(`/api/reports/${reportId}/upvote`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        }
    });

    const downvoteMutation = useMutation({
        mutationFn: async (reportId: number) => {
            const res = await axios.post(`/api/reports/${reportId}/downvote`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        }
    });
    
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        // Setup intersection observer
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    const id = entry.target.getAttribute('data-report-id');
                    if (id) {
                        setActiveReportId(parseInt(id));
                    }
                }
            });
        }, {
            threshold: 0.51, // Trigger when >50% of the element is visible
            rootMargin: "-10% 0px -10% 0px"
        });

        const timer = setTimeout(() => {
            const articles = document.querySelectorAll('article[data-report-id]');
            articles.forEach(article => observerRef.current?.observe(article));
        }, 100);

        return () => {
            clearTimeout(timer);
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [reports, setActiveReportId]);

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

    if (reports.length === 0) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12 bg-white rounded-2xl border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Belum ada laporan</h3>
                <p className="text-slate-500">Jadilah yang pertama untuk membuat laporan!</p>
            </div>
        );
    }

    const getInstansiLogo = (kategori: string) => {
        switch (kategori) {
            case 'Infrastruktur & Fasilitas Umum': return '/pupr.png';
            case 'Kebersihan & Lingkungan': return '/hutan.png';
            case 'Keamanan & Ketertiban': return '/polri.png';
            case 'Layanan Publik & Administrasi': return '/kementriannegri.jpg';
            case 'Kesehatan': return '/kesehhatan.png';
            case 'Pendidikan': return '/Kemendikbud.jpg';
            case 'Sosial & Kemasyarakatan': return '/sosial.jpg';
            default: return '/Logo.png';
        }
    };

    const getPemkotLogo = (kota: string) => {
        const logos: Record<string, string> = {
            'Jakarta': '/jakarta.jpg',
            'Bandung': '/bandung.png',
            'Tangerang Selatan': '/tangsel.png',
            'Tangsel': '/tangsel.png',
        };
        return logos[kota] || '/Logo.png';
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {reports.map((report) => (
                <article key={report.id} data-report-id={report.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
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
                                src={report.media[0].url.startsWith('http') ? report.media[0].url : `http://localhost:8000/storage/${report.media[0].url}`}
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
                            <div className="bg-primary/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center space-x-2 shadow-lg max-w-full">
                                <div className="w-5 h-5 bg-white rounded-full p-0.5 overflow-hidden flex-shrink-0">
                                    <img src={getPemkotLogo(report.kota || '')} alt="Pemkot Logo" className="w-full h-full object-contain" />
                                </div>
                                <span className="text-[10px] font-bold truncate pr-1">
                                    daerah {report.kelurahan} di {report.kota}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Card Actions & Content */}
                    <div className="p-4">
                        <div className="flex items-center justify-between mt-4 border-t border-slate-100 pt-3 mb-3">
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                {/* Upvote/Downvote Pill (Quora Style) */}
                                <div className="flex items-center bg-slate-100 hover:bg-slate-200/80 rounded-full transition-colors overflow-hidden border border-slate-200/50">
                                    <button 
                                        onClick={() => {
                                            if (!user) openLoginPrompt();
                                            else upvoteMutation.mutate(report.id);
                                        }}
                                        disabled={upvoteMutation.isPending}
                                        className={`flex items-center space-x-1.5 px-3 py-1.5 transition-colors border-r border-slate-200 ${
                                            report.is_upvoted ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700 hover:text-blue-600'
                                        }`}
                                    >
                                        <ArrowBigUp size={16} className={`${report.is_upvoted ? 'fill-blue-600' : 'fill-blue-600/10'}`} strokeWidth={2.5} />
                                        <span className="text-[11px] sm:text-xs font-bold">
                                            Upvote <span className="mx-0.5 font-normal text-slate-400">·</span> {report.upvotes_count || 0}
                                        </span>
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if (!user) openLoginPrompt();
                                            else downvoteMutation.mutate(report.id);
                                        }}
                                        disabled={downvoteMutation.isPending}
                                        className={`px-2 py-1.5 transition-colors flex items-center justify-center ${
                                            report.is_downvoted ? 'text-red-600 bg-red-50' : 'text-slate-500 hover:text-red-500 hover:bg-red-50'
                                        }`}
                                    >
                                        <ArrowBigDown size={16} className={`${report.is_downvoted ? 'fill-red-600' : ''}`} />
                                    </button>
                                </div>

                                {/* Comment Button */}
                                <button 
                                    onClick={() => {
                                        if (!user) openLoginPrompt();
                                        else {
                                            setActiveReportId(report.id);
                                            setIsCommentsOpen(true);
                                        }
                                    }}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-800 transition-colors"
                                >
                                    <MessageCircle size={18} />
                                    <span className="text-xs sm:text-sm font-medium text-slate-700">{report.comments?.length || 0}</span>
                                </button>

                                {/* Share Button */}
                                <button 
                                    onClick={!user ? openLoginPrompt : undefined}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-800 transition-colors"
                                >
                                    <Share2 size={18} />
                                </button>
                            </div>

                            {/* Category Badge & More Options */}
                            <div className="flex items-center space-x-2">
                                <div className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-1 rounded-full text-xs font-bold truncate max-w-[150px] hidden sm:flex items-center space-x-1.5">
                                    <div className="w-4 h-4 bg-white rounded-full overflow-hidden flex-shrink-0 border border-slate-200 p-[1px]">
                                        <img src={getInstansiLogo(report.kategori)} alt="Instansi" className="w-full h-full object-contain" />
                                    </div>
                                    <span className="truncate">{report.kategori}</span>
                                </div>
                                <button 
                                    onClick={!user ? openLoginPrompt : undefined}
                                    className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                                >
                                    <MoreHorizontal size={20} />
                                </button>
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
