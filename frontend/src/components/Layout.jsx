import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Menu, Bell } from 'lucide-react';

const pageTitles = {
    '/': 'Dashboard',
    '/insights': 'Data Insights',
    '/model-info': 'Model Information',
    '/predict': 'Predict Attrition',
    '/history': 'Prediction History',
    '/performance': 'Model Performance',
};

const Layout = () => {
    const { isAuthenticated, user } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const currentTitle = pageTitles[location.pathname] || 'Dashboard';

    return (
        <div className="flex h-screen bg-surface overflow-hidden">
            <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            <div className="flex flex-col flex-1 w-0 overflow-hidden">
                {/* Top bar */}
                <header className="h-[72px] shrink-0 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 md:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                        <div>
                            <h1 className="text-lg font-semibold text-slate-900">{currentTitle}</h1>
                            <p className="text-xs text-slate-400 hidden sm:block">
                                Welcome back, {user?.username || 'User'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors relative">
                            <Bell size={18} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand-500" />
                        </button>
                        <div className="hidden sm:flex w-9 h-9 rounded-full bg-brand-600 items-center justify-center text-white text-sm font-bold uppercase">
                            {user?.username?.charAt(0) || 'U'}
                        </div>
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
