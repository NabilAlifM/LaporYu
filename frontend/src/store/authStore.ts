import { create } from 'zustand';
import axios from '@/lib/axios';

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'instansi';
    kode_wilayah?: string;
    avatar?: string;
    instansi?: {
        id: number;
        nama_instansi: string;
        kategori_tanggung_jawab: string;
        kode_wilayah: string;
    };
}

interface AuthState {
    user: User | null;
    isInitialized: boolean;
    login: (user: User) => void;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isInitialized: false,
    
    login: (user) => set({ user }),
    
    logout: async () => {
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            localStorage.removeItem('token');
            set({ user: null });
        }
    },
    
    fetchUser: async () => {
        try {
            const response = await axios.get('/api/user');
            set({ user: response.data, isInitialized: true });
        } catch (error) {
            set({ user: null, isInitialized: true });
        }
    }
}));
