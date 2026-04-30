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

            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all p-6 text-center z-10">
                <button 
                    onClick={closeLoginPrompt}
                    className="absolute right-4 top-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
                
                <img src="/Logo.png" alt="LaporYu Logo" className="h-16 mx-auto mb-2 mt-4" />
                
                <p className="text-slate-600 font-medium text-sm mt-4 px-2">
                    Masuk atau buat akun untuk mulai berinteraksi dan mengawal aspirasi warga!
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
    );
}
