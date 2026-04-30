import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import LoginPrompt from '@/components/LoginPrompt';
import SidebarComments from '@/components/SidebarComments';
import { Home, Compass, Search, PlusSquare, User as UserIcon, MessageCircle, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';

export default function PublicLayout() {
    const { user, isInitialized } = useAuthStore();
    const { openLoginPrompt, isCommentsOpen, setIsCommentsOpen } = useUIStore();
    const location = useLocation();
    const navigate = useNavigate();
    const followScrollRef = useRef<HTMLDivElement>(null);

    const { data: followings = [] } = useQuery<any[]>({
        queryKey: ['following'],
        queryFn: async () => {
            const res = await axios.get('/api/user/following');
            return res.data;
        },
        enabled: !!user,
    });

    const scrollFollow = (direction: 'left' | 'right') => {
        if (followScrollRef.current) {
            const scrollAmount = direction === 'left' ? -200 : 200;
            followScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!isInitialized) {
        return <div className="flex h-screen items-center justify-center bg-slate-50">Loading...</div>;
    }

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Jelajahi', path: '/explore', icon: Compass },
        { name: 'Cari', path: '/search', icon: Search },
        { name: 'Buat Laporan', path: '/create', icon: PlusSquare },
        { name: 'Pesan', path: '/messages', icon: MessageCircle },
        { name: 'Profile', path: user ? '/profile' : '#', icon: UserIcon, action: !user ? openLoginPrompt : undefined },
    ];

    const isFullWidthPage = location.pathname === '/explore' || location.pathname === '/messages';

    return (
        <div className="min-h-screen bg-slate-50 md:bg-white flex justify-center overflow-x-hidden">
            <motion.div
                animate={{ maxWidth: isFullWidthPage ? "100%" : "72rem" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full flex"
            >

                {/* LEFT SIDEBAR (Desktop) */}
                <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 h-screen sticky top-0 bg-white shrink-0 overflow-y-auto no-scrollbar">
                    <div className="p-6">
                        <Link to="/" className="flex items-center space-x-2">
                            <img src="/Logo.png" alt="LaporYu Logo" className="h-10 w-auto" />
                        </Link>
                    </div>

                    <nav className="flex-1 px-4 mt-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.action ? '#' : item.path}
                                onClick={item.action ? (e) => { e.preventDefault(); item.action!(); } : undefined}
                                className={`flex items-center space-x-4 px-4 py-3 rounded-full transition-all duration-200 ${isActive(item.path)
                                        ? 'bg-primary text-white font-bold'
                                        : 'text-slate-700 hover:bg-slate-100 font-medium'
                                    }`}
                            >
                                <item.icon size={isActive(item.path) ? 24 : 22} strokeWidth={isActive(item.path) ? 2.5 : 2} />
                                <span className="text-lg">{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Messages Floating Box Placeholder */}
                    <div className="p-4 mb-4">
                        <div
                            onClick={() => navigate('/messages')}
                            className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group"
                        >
                            <div>
                                <p className="font-black text-slate-900 group-hover:text-primary transition-colors">Messages</p>
                                <div className="flex -space-x-2 mt-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white overflow-hidden">
                                        <img src="https://i.pravatar.cc/150?u=1" alt="" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white overflow-hidden">
                                        <img src="https://i.pravatar.cc/150?u=2" alt="" />
                                    </div>
                                </div>
                            </div>
                            <MessageCircle className="text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                    </div>
                </aside>

                {/* MAIN CONTENT (Middle Column) */}
                <main className="flex-1 min-w-0 border-r border-slate-200 bg-slate-50 md:bg-white pb-20 md:pb-0 flex flex-col h-screen">
                    {/* Top Header Mobile & Desktop */}
                    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 px-4 flex items-center justify-between">
                        <div className="md:hidden flex items-center">
                            <img src="/Logo.png" alt="LaporYu Logo" className="h-8 w-auto" />
                        </div>
                        <h1 className="text-xl font-bold text-slate-900 hidden md:block">Home</h1>

                        <div className="flex items-center space-x-4">
                            <button className="text-slate-700 hover:text-primary transition-colors">
                                <Bell size={24} />
                            </button>
                            {user ? (
                                <Link to="/profile" className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                                    {/* Avatar placeholder */}
                                </Link>
                            ) : (
                                <button
                                    onClick={openLoginPrompt}
                                    className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm"
                                >
                                    ?
                                </button>
                            )}
                        </div>
                    </header>

                    <div className={`flex-1 overflow-y-auto ${isFullWidthPage ? 'p-0' : 'p-0 sm:p-4 md:p-6'} bg-slate-50 md:bg-white`}>
                        <Outlet />
                    </div>
                </main>

                {/* RIGHT SIDEBAR (Desktop) */}
                <aside className="hidden lg:block w-80 h-screen sticky top-0 bg-white p-6 overflow-y-auto no-scrollbar relative shrink-0 border-l border-slate-200">
                    {/* Orang Yang Kau Follow */}
                    <div className="mb-8 relative group">
                        <h3 className="font-bold text-slate-900 mb-4">Orang Yang Kau Follow</h3>

                        <div className="relative">
                            <div
                                ref={followScrollRef}
                                className="flex space-x-6 overflow-x-auto pb-2 no-scrollbar scroll-smooth snap-x"
                            >
                                {followings.length > 0 ? followings.map((person) => (
                                    <div 
                                        key={person.id} 
                                        onClick={() => navigate('/messages')}
                                        className="flex flex-col items-center flex-shrink-0 cursor-pointer snap-start w-[72px] group/item"
                                    >
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-secondary to-primary p-[2px] mb-2 group-hover/item:scale-110 transition-transform">
                                            <div className="w-full h-full bg-white rounded-full border-2 border-white overflow-hidden">
                                                <img src={person.avatar} className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-700 text-center truncate w-full group-hover/item:text-primary transition-colors">
                                            {person.name?.split(' ')[0] || 'User'}
                                        </span>
                                    </div>
                                )) : (
                                    <div 
                                        className="flex flex-col items-center flex-shrink-0 cursor-pointer snap-start w-[72px] group/item"
                                    >
                                        <div className="w-14 h-14 rounded-full bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center mb-2 group-hover/item:border-primary transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 group-hover/item:bg-primary/10 group-hover/item:text-primary transition-colors">
                                                <PlusSquare size={16} />
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-500 text-center w-full leading-tight">Cari teman</span>
                                    </div>
                                )}
                            </div>

                            {/* Scroll Buttons - Only visible on hover */}
                            <button
                                onClick={() => scrollFollow('left')}
                                className="absolute left-0 top-7 -translate-x-2 bg-white/90 shadow-md rounded-full p-1 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => scrollFollow('right')}
                                className="absolute right-0 top-7 translate-x-2 bg-white/90 shadow-md rounded-full p-1 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                        <h4 className="font-bold text-sm text-slate-800 mb-2">Statistik Hari Ini</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Laporan Baru</span>
                                <span className="font-bold text-primary">12</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Selesai</span>
                                <span className="font-bold text-green-600">8</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Sliding Comments Panel (Desktop) */}
                <div className={`fixed top-0 right-0 h-screen bg-white z-50 border-l border-slate-200 transition-all duration-300 transform hidden md:block ${isCommentsOpen ? 'translate-x-0 w-96 opacity-100 shadow-2xl' : 'translate-x-full w-0 opacity-0'
                    }`}>
                    {isCommentsOpen && <SidebarComments />}
                </div>

            </motion.div>

            {/* BOTTOM NAVIGATION (Mobile) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 z-40 pb-safe">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.action ? '#' : item.path}
                        onClick={item.action ? (e) => { e.preventDefault(); item.action!(); } : undefined}
                        className={`flex flex-col items-center justify-center w-full h-full ${isActive(item.path) ? 'text-primary' : 'text-slate-500'
                            }`}
                    >
                        <item.icon size={24} strokeWidth={isActive(item.path) ? 2.5 : 2} />
                    </Link>
                ))}
            </nav>

            {/* Global Modals */}
            <LoginPrompt />
        </div>
    );
}
