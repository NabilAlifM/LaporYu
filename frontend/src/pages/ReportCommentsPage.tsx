import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import axios from '@/lib/axios';
import { getReports } from '@/services/api';
import { Send, X, MessageCircle, ArrowLeft } from 'lucide-react';
import type { Report } from '@/types/index';

export default function ReportCommentsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { openLoginPrompt } = useUIStore();
    const queryClient = useQueryClient();
    const [newComment, setNewComment] = useState('');

    const { data: response, isLoading } = useQuery({
        queryKey: ['reports'],
        queryFn: getReports,
        staleTime: 1000 * 60 * 5,
    });

    const reports = Array.isArray(response?.data) ? response.data : [];
    const report = reports.find((r: Report) => r.id === parseInt(id || '0'));

    const submitCommentMutation = useMutation({
        mutationFn: async (content: string) => {
            if (!report) return;
            const res = await axios.post(`/api/reports/${report.id}/comments`, { content });
            return res.data;
        },
        onSuccess: () => {
            setNewComment('');
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            openLoginPrompt();
            return;
        }
        if (!newComment.trim() || !report) return;
        submitCommentMutation.mutate(newComment);
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-lg rounded-2xl p-8 text-center">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium">Memuat diskusi...</p>
                </div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-lg rounded-2xl p-8 text-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Laporan tidak ditemukan</h3>
                    <button 
                        onClick={() => navigate('/')}
                        className="mt-4 px-6 py-2 bg-primary text-white rounded-full font-bold"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto pt-20 pb-20 sm:p-4">
            {/* Overlay click to go back */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => navigate('/')}></div>

            <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center space-x-3">
                        <button 
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h3 className="font-bold text-slate-900 leading-none">Diskusi Laporan</h3>
                            <p className="text-xs text-slate-500 mt-1 truncate max-w-[200px] sm:max-w-md">{report.judul}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Post Content Summary (Optional but good for context) */}
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                            {report.user?.name?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900">{report.user?.name}</p>
                            <p className="text-sm text-slate-600 line-clamp-2 mt-1">{report.deskripsi}</p>
                        </div>
                    </div>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar min-h-[300px]">
                    {(report.comments && report.comments.length > 0) ? (
                        report.comments.map((comment: any) => (
                            <div key={comment.id} className="flex space-x-3 group">
                                <div className="w-9 h-9 rounded-full bg-slate-100 flex-shrink-0 mt-0.5 flex items-center justify-center font-bold text-slate-400 text-xs border border-slate-200 uppercase">
                                    {comment.user?.name?.charAt(0) || '?'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className="text-xs font-bold text-slate-900">{comment.user?.name}</span>
                                        <span className="text-[10px] text-slate-400">Baru saja</span>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl rounded-tl-none px-4 py-2 border border-slate-100">
                                        <p className="text-sm text-slate-700 leading-relaxed">{comment.body}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageCircle size={32} className="text-slate-200" />
                            </div>
                            <h4 className="font-bold text-slate-900 mb-1">Belum ada diskusi</h4>
                            <p className="text-sm text-slate-500">Jadilah yang pertama untuk berdiskusi tentang laporan ini.</p>
                        </div>
                    )}
                </div>

                {/* Footer Input */}
                <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0">
                    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                        <div className="hidden sm:flex w-9 h-9 rounded-full bg-slate-100 items-center justify-center font-bold text-slate-400 text-xs border border-slate-200 uppercase">
                            {user?.name?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder={user ? "Tulis komentar..." : "Login untuk berdiskusi"}
                                disabled={submitCommentMutation.isPending || !user}
                                className="w-full bg-slate-50 border border-slate-200 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                            <button 
                                type="submit"
                                disabled={!newComment.trim() || submitCommentMutation.isPending || !user}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-primary/10 rounded-full disabled:opacity-30 transition-all"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
