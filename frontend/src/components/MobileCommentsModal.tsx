import React, { useState } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { Send, X } from 'lucide-react';
import { getReports } from '@/services/api';
import type { Report, Comment } from '@/types/index';

export default function MobileCommentsModal() {
    const { activeReportId, openLoginPrompt, isCommentsOpen, setIsCommentsOpen } = useUIStore();
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [newComment, setNewComment] = useState('');

    const { data: response, isLoading } = useQuery({
        queryKey: ['reports'],
        queryFn: getReports,
        staleTime: 1000 * 60 * 5,
        enabled: isCommentsOpen
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

    if (!isCommentsOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCommentsOpen(false)}></div>
            
            <div className="relative w-full max-h-[85vh] bg-white rounded-t-2xl flex flex-col animate-slide-up pb-safe">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900">Diskusi</h3>
                        <p className="text-xs text-slate-500 truncate">{activeReport?.judul || 'Memuat...'}</p>
                    </div>
                    <button 
                        onClick={() => setIsCommentsOpen(false)}
                        className="ml-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar min-h-[50vh]">
                    {isLoading ? (
                        <div className="text-center py-20 text-slate-400 text-sm">Memuat...</div>
                    ) : (activeReport?.comments && activeReport.comments.length > 0) ? (
                        activeReport.comments.map((comment: any) => (
                            <div key={comment.id} className="flex space-x-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 mt-0.5 flex items-center justify-center font-bold text-slate-400 text-[10px] border border-slate-200">
                                    {comment.user?.name?.charAt(0) || '?'}
                                </div>
                                <div className="flex-1">
                                    <div className="bg-slate-50 rounded-2xl px-3 py-2 border border-slate-100">
                                        <p className="text-xs font-bold text-slate-900 mb-0.5">{comment.user?.name}</p>
                                        <p className="text-sm text-slate-700 leading-snug">{comment.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send size={24} className="text-slate-200" />
                            </div>
                            <p className="text-sm text-slate-400 font-medium">Belum ada diskusi di sini.</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={user ? "Tulis komentar..." : "Login untuk berdiskusi"}
                            disabled={submitCommentMutation.isPending || !user}
                            className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                        />
                        <button 
                            type="submit"
                            disabled={!newComment.trim() || submitCommentMutation.isPending || !user}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-full disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
