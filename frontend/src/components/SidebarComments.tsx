import React, { useState } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { Send, MessageCircle, X } from 'lucide-react';
import { getReports } from '@/services/api';
import type { Report, Comment } from '@/types/index';

export default function SidebarComments() {
    const { activeReportId, openLoginPrompt, setIsCommentsOpen } = useUIStore();
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [newComment, setNewComment] = useState('');

    const { data: response, isLoading } = useQuery({
        queryKey: ['reports'],
        queryFn: getReports,
        staleTime: 1000 * 60 * 5,
    });

    const reports = Array.isArray(response?.data) ? response.data : [];
    const activeReport = activeReportId ? reports.find((r: any) => r.id === activeReportId) : null;

    const submitCommentMutation = useMutation({
        mutationFn: async (content: string) => {
            if (!activeReport) return;
            const res = await axios.post(`/api/reports/${activeReport.id}/comments`, { content });
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
        if (!newComment.trim() || !activeReport) return;
        submitCommentMutation.mutate(newComment);
    };

    if (!activeReportId || !activeReport) {
        return (
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="text-slate-300" size={32} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Komentar</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed px-2">Geser feed laporan untuk melihat diskusi terkait.</p>
            </div>
        );
    }

    return (
        <div className="bg-white flex flex-col h-full">
            {/* YouTube Style Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-slate-900 text-lg">Komentar</h3>
                        <span className="text-slate-500 text-sm font-medium">{activeReport.comments?.length || 0}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5 max-w-[240px] uppercase tracking-wider font-bold">Laporan: {activeReport.judul}</p>
                </div>
                <button 
                    onClick={() => setIsCommentsOpen(false)}
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all"
                >
                    <X size={22} strokeWidth={2.5} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-24">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-3">
                        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-xs text-slate-400 font-medium">Memuat diskusi...</p>
                    </div>
                ) : (activeReport.comments && activeReport.comments.length > 0) ? (
                    activeReport.comments.map((comment: any) => (
                        <div key={comment.id} className="flex space-x-3 group">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex-shrink-0 mt-0.5 flex items-center justify-center font-bold text-slate-500 text-xs border border-slate-200">
                                {comment.user?.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-xs font-bold text-slate-900">@{comment.user?.name?.toLowerCase().replace(/\s+/g, '_')}</span>
                                    <span className="text-[10px] text-slate-400 font-medium">Baru saja</span>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed break-words">{comment.content}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                    <button className="flex items-center space-x-1 text-slate-400 hover:text-primary transition-colors">
                                        <MessageCircle size={14} />
                                        <span className="text-[10px] font-bold">Balas</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                            <MessageCircle size={32} className="text-slate-200" />
                        </div>
                        <p className="text-sm text-slate-400 font-semibold">Belum ada diskusi.</p>
                        <p className="text-xs text-slate-300 mt-1">Jadilah yang pertama berkomentar!</p>
                    </div>
                )}
            </div>

            {/* Sticky Bottom Input Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-white/95 backdrop-blur-md">
                <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center font-bold text-primary text-[10px]">
                        {user?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={user ? "Tambahkan komentar..." : "Login untuk berdiskusi"}
                            disabled={submitCommentMutation.isPending || !user}
                            className="w-full bg-slate-50 border-b-2 border-transparent focus:border-primary px-0 py-2 text-sm focus:outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={!newComment.trim() || submitCommentMutation.isPending || !user}
                        className="p-2 text-primary hover:bg-primary/10 rounded-full disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}
