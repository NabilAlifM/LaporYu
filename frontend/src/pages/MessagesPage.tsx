import React, { useState, useRef, useEffect } from 'react';
import { Search, MoreVertical, Send, Image as ImageIcon, Smile, Phone, Video, Info, CheckCheck, MapPin, Bell, Mic, FileText, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Contact {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: number;
    online: boolean;
    type: 'warga' | 'instansi';
}

const contacts: Contact[] = [
    {
        id: 1,
        name: 'Budi Santoso',
        avatar: 'https://i.pravatar.cc/150?u=budi',
        lastMessage: 'Bagaimana perkembangan laporan jalan berlubang di Ciputat?',
        time: '10:30',
        unread: 2,
        online: true,
        type: 'warga'
    },
    {
        id: 4,
        name: 'Dinas PUPR',
        avatar: '/pupr.png',
        lastMessage: 'Laporan Anda sedang diproses oleh tim teknis kami.',
        time: 'Senin',
        unread: 1,
        online: true,
        type: 'instansi'
    },
    {
        id: 2,
        name: 'Siti Aminah',
        avatar: 'https://i.pravatar.cc/150?u=siti',
        lastMessage: 'Terima kasih atas bantuannya kemarin.',
        time: 'Kemarin',
        unread: 0,
        online: false,
        type: 'warga'
    },
    {
        id: 3,
        name: 'Adam Mahardika',
        avatar: 'https://i.pravatar.cc/150?u=adam',
        lastMessage: 'Ok, saya tunggu infonya.',
        time: 'Kemarin',
        unread: 0,
        online: true,
        type: 'warga'
    },
    {
        id: 5,
        name: 'Dinas Kebersihan',
        avatar: '/hutan.png',
        lastMessage: 'Besok kita cek bareng ya lokasinya.',
        time: '24 Apr',
        unread: 0,
        online: false,
        type: 'instansi'
    }
];

export default function MessagesPage() {
    const [selectedContact, setSelectedContact] = useState<Contact | null>(contacts[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [showInfo, setShowInfo] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'warga' | 'instansi'>('all');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<Record<number, any[]>>({
        1: [
            { id: 1, text: 'Halo! Apa ada yang bisa saya bantu terkait laporan jalan berlubang Anda?', sender: 'them', time: '09:45', type: 'text' },
            { id: 2, text: 'Iya pak, di daerah Ciputat jalannya sangat parah. Kira-kira kapan ya diperbaiki?', sender: 'me', time: '10:02', type: 'text' },
            { id: 3, text: 'Bagaimana perkembangan laporan jalan berlubang di Ciputat?', sender: 'them', time: '10:30', type: 'text' },
        ],
        4: [
            { id: 1, text: 'Selamat siang. Kami telah menerima laporan Anda mengenai kerusakan jembatan.', sender: 'them', time: '09:00', type: 'text' },
            { id: 2, text: 'Ini adalah foto lokasi terbarunya.', sender: 'me', time: '09:05', type: 'text' },
            { id: 3, image: '/fasilitas rusak.jpeg', sender: 'me', time: '09:05', type: 'image' },
            { id: 4, text: 'Laporan Anda sedang diproses oleh tim teknis kami.', sender: 'them', time: 'Senin', type: 'text' },
        ]
    });

    const filteredContacts = contacts.filter(c => {
        const matchesQuery = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'all' || c.type === activeTab;
        return matchesQuery && matchesTab;
    });

    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!messageInput.trim() || !selectedContact) return;

        const newMessage = {
            id: Date.now(),
            text: messageInput,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text'
        };

        setMessages(prev => ({
            ...prev,
            [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage]
        }));
        setMessageInput('');
        
        // Mock typing effect
        setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 3000);
        }, 1000);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, selectedContact, isTyping]);

    return (
        <div className="w-full max-w-7xl mx-auto h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex animate-in fade-in zoom-in duration-500">
            {/* Sidebar: Chat List */}
            <div className="w-full sm:w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
                <div className="p-5 border-b border-slate-100 bg-white">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-black text-slate-900">Pesan</h1>
                        <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
                            <Paperclip size={18} />
                        </button>
                    </div>
                    
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Cari percakapan..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-100 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    <div className="flex space-x-1 p-1 bg-slate-100 rounded-xl">
                        {(['all', 'warga', 'instansi'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                                    activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                {tab === 'all' ? 'Semua' : tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar">
                    <AnimatePresence mode="popLayout">
                        {filteredContacts.map((contact) => (
                            <motion.button
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={contact.id}
                                onClick={() => setSelectedContact(contact)}
                                className={`w-full p-4 flex items-center space-x-3 transition-all relative group ${
                                    selectedContact?.id === contact.id ? 'bg-white shadow-md z-10' : 'hover:bg-white/50'
                                }`}
                            >
                                {selectedContact?.id === contact.id && (
                                    <motion.div layoutId="active-pill" className="absolute left-0 top-4 bottom-4 w-1.5 bg-primary rounded-r-full" />
                                )}
                                
                                <div className="relative flex-shrink-0">
                                    <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm group-hover:scale-105 transition-transform" />
                                    {contact.online && (
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className={`text-sm truncate ${contact.unread > 0 ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>
                                            {contact.name}
                                        </h3>
                                        <span className="text-[10px] text-slate-400 font-bold">{contact.time}</span>
                                    </div>
                                    <p className={`text-xs truncate mt-0.5 ${contact.unread > 0 ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                                        {contact.lastMessage}
                                    </p>
                                </div>
                                {contact.unread > 0 && (
                                    <div className="bg-primary text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                                        {contact.unread}
                                    </div>
                                )}
                            </motion.button>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Main: Chat View */}
            {selectedContact ? (
                <>
                    <div className="flex-1 flex flex-col bg-white">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <img src={selectedContact.avatar} alt={selectedContact.name} className="w-10 h-10 rounded-xl object-cover border border-slate-100" />
                                    {selectedContact.online && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                                </div>
                                <div>
                                    <h2 className="font-black text-slate-900 text-sm leading-none">{selectedContact.name}</h2>
                                    <div className="flex items-center space-x-1 mt-1">
                                        <div className={`w-1.5 h-1.5 rounded-full ${selectedContact.online ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                        <span className="text-[10px] text-slate-500 font-bold">{selectedContact.online ? 'Online Sekarang' : 'Offline'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1">
                                <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"><Phone size={18} /></button>
                                <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"><Video size={18} /></button>
                                <button 
                                    onClick={() => setShowInfo(!showInfo)}
                                    className={`p-2.5 rounded-xl transition-all ${showInfo ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-50'}`}
                                >
                                    <Info size={18} />
                                </button>
                                <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"><MoreVertical size={18} /></button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-slate-50/20 no-scrollbar scroll-smooth"
                        >
                            {messages[selectedContact.id]?.map((msg) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    key={msg.id} 
                                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[75%] group relative ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                                        <div className={`p-3.5 rounded-3xl shadow-sm ${
                                            msg.sender === 'me' 
                                                ? 'bg-primary text-white rounded-tr-none shadow-xl shadow-primary/10' 
                                                : 'bg-white border border-slate-100 rounded-tl-none text-slate-800'
                                        }`}>
                                            {msg.type === 'text' && <p className="text-sm leading-relaxed">{msg.text}</p>}
                                            {msg.type === 'image' && (
                                                <div className="rounded-2xl overflow-hidden border border-white/20 shadow-inner">
                                                    <img src={msg.image} alt="attachment" className="w-full max-h-64 object-cover" />
                                                </div>
                                            )}
                                            {msg.type === 'audio' && (
                                                <div className="flex items-center space-x-3 min-w-[200px]">
                                                    <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                                        <Send size={14} className="ml-0.5" />
                                                    </button>
                                                    <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                                                        <div className="w-1/3 h-full bg-white"></div>
                                                    </div>
                                                    <span className="text-[10px] font-bold">0:12</span>
                                                </div>
                                            )}
                                            
                                            <div className={`flex items-center space-x-1 mt-1.5 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                                <span className={`text-[9px] font-bold uppercase tracking-tight ${msg.sender === 'me' ? 'text-blue-100' : 'text-slate-400'}`}>
                                                    {msg.time}
                                                </span>
                                                {msg.sender === 'me' && <CheckCheck size={12} className="text-blue-100" />}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="bg-white border border-slate-100 rounded-3xl rounded-tl-none px-4 py-3 shadow-sm flex items-center space-x-1">
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Chat Input */}
                        <div className="p-5 border-t border-slate-100 bg-white">
                            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                                <div className="flex items-center space-x-1">
                                    <button type="button" className="p-2.5 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"><Smile size={20} /></button>
                                    <button type="button" className="p-2.5 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"><Paperclip size={20} /></button>
                                </div>
                                <div className="flex-1 relative flex items-center">
                                    <input 
                                        type="text" 
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Tulis pesan Anda di sini..."
                                        className="w-full bg-slate-100/80 border-none rounded-2xl px-5 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                    <button type="button" className="absolute right-3 text-slate-400 hover:text-primary"><Mic size={18} /></button>
                                </div>
                                <button 
                                    type="submit"
                                    className={`p-3.5 rounded-2xl transition-all shadow-lg ${
                                        messageInput.trim() 
                                            ? 'bg-primary text-white scale-105 shadow-primary/20 hover:shadow-primary/40' 
                                            : 'bg-slate-100 text-slate-300 shadow-none'
                                    }`}
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Info Panel */}
                    <motion.div 
                        initial={false}
                        animate={{ width: showInfo ? 320 : 0, opacity: showInfo ? 1 : 0 }}
                        className="border-l border-slate-100 bg-white overflow-hidden flex flex-col shrink-0"
                    >
                        <div className="p-8 flex flex-col items-center text-center border-b border-slate-50">
                            <img src={selectedContact.avatar} alt={selectedContact.name} className="w-28 h-28 rounded-[2rem] object-cover border-4 border-white shadow-2xl mb-6" />
                            <h3 className="font-black text-slate-900 text-xl mb-1">{selectedContact.name}</h3>
                            <div className="flex items-center space-x-1.5 mb-6">
                                <div className={`w-2 h-2 rounded-full ${selectedContact.online ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                    {selectedContact.online ? 'Aktif' : 'Tidak Aktif'}
                                </span>
                            </div>
                            
                            <div className="flex space-x-3 w-full">
                                <button className="flex-1 flex flex-col items-center py-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors group">
                                    <Phone size={18} className="text-slate-400 group-hover:text-primary mb-1" />
                                    <span className="text-[9px] font-black text-slate-500">TELP</span>
                                </button>
                                <button className="flex-1 flex flex-col items-center py-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors group">
                                    <Video size={18} className="text-slate-400 group-hover:text-primary mb-1" />
                                    <span className="text-[9px] font-black text-slate-500">VIDEO</span>
                                </button>
                                <button className="flex-1 flex flex-col items-center py-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors group">
                                    <Bell size={18} className="text-slate-400 group-hover:text-primary mb-1" />
                                    <span className="text-[9px] font-black text-slate-500">MUTE</span>
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Detail Kontak</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                            <MapPin size={18} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Lokasi</p>
                                            <p className="text-xs font-bold text-slate-700">Tangerang Selatan, Banten</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                            <FileText size={18} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Bio</p>
                                            <p className="text-xs font-bold text-slate-700">
                                                {selectedContact.type === 'instansi' ? 'Akun resmi pemerintah daerah.' : 'Warga terverifikasi LaporYu.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Media</h4>
                                    <button className="text-[10px] font-black text-primary hover:underline">LIHAT SEMUA</button>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden hover:opacity-80 transition-opacity cursor-pointer">
                                        <img src="/fasilitas rusak.jpeg" alt="media" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center text-slate-200 border-2 border-dashed border-slate-100">
                                        <ImageIcon size={20} />
                                    </div>
                                    <div className="aspect-square bg-slate-50 rounded-xl flex items-center justify-center text-slate-200 border-2 border-dashed border-slate-100">
                                        <ImageIcon size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 text-center p-10">
                    <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center mb-8 relative">
                        <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] animate-ping duration-[3000ms]"></div>
                        <Send size={48} className="text-primary rotate-12 relative z-10" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-3">Pilih Percakapan</h2>
                    <p className="text-slate-500 max-w-xs font-medium leading-relaxed">
                        Pilih salah satu teman atau instansi dari daftar di samping untuk mulai berdiskusi secara langsung.
                    </p>
                </div>
            )}
        </div>
    );
}
