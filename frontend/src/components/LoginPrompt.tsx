import { useUIStore } from '@/store/uiStore';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPrompt() {
    const { isLoginPromptOpen, closeLoginPrompt } = useUIStore();
    const navigate = useNavigate();

    if (!isLoginPromptOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={closeLoginPrompt}
            />

            {/* Modal Pop-up */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900 mx-auto">Masuk untuk Melanjutkan</h2>
                    <button 
                        onClick={closeLoginPrompt}
                        className="absolute right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-primary">LY</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Selamat Datang di LaporYu</h3>
                    <p className="text-slate-500 mt-2 text-sm px-4">
                        Silakan masuk untuk berinteraksi dengan laporan, memberi dukungan, atau membuat laporan baru.
                    </p>

                    <div className="mt-8 space-y-3">
                        <button 
                            onClick={() => {
                                closeLoginPrompt();
                                navigate('/login');
                            }}
                            className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-xl hover:bg-primary/90 transition-colors font-medium"
                        >
                            Masuk
                        </button>
                        
                        <button 
                            onClick={() => {
                                closeLoginPrompt();
                                navigate('/register');
                            }}
                            className="w-full bg-white text-primary border-2 border-primary py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                        >
                            Buat Akun Baru
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
