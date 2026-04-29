import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function AuthLayout() {
    const { user, isInitialized } = useAuthStore();

    if (!isInitialized) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="flex min-h-screen bg-slate-50 items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8 flex flex-col items-center">
                    <img src="/Logo.png" alt="LaporYu Logo" className="h-16 w-auto mb-2" />
                    <p className="text-muted-foreground">Platform Pelaporan Masyarakat</p>
                </div>
                <Outlet />
            </div>
        </div>
    );
}
