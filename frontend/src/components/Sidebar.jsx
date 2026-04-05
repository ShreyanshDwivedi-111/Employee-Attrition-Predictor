import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    BarChart2,
    Info,
    UserSearch,
    History,
    Target,
    LogOut,
    ChevronRight,
    Sparkles
} from 'lucide-react';

const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Data Insights', path: '/insights', icon: BarChart2 },
        { name: 'Model Information', path: '/model-info', icon: Info },
        { name: 'Predict Attrition', path: '/predict', icon: UserSearch },
        { name: 'Prediction History', path: '/history', icon: History },
        { name: 'Model Performance', path: '/performance', icon: Target },
    ];

    return (
        <>
            {/* Mobile backdrop */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-[272px] flex flex-col
                            bg-gradient-to-b from-sidebar-from to-sidebar-to
                            transform transition-transform duration-300 ease-in-out
                            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                            md:relative md:translate-x-0`}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 h-[72px] shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/25">
                        <Sparkles size={18} className="text-white" />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-white tracking-tight">AttritionIQ</span>
                        <p className="text-[10px] text-slate-400 font-medium -mt-0.5 tracking-wide uppercase">Workforce Analytics</p>
                    </div>
                </div>

                {/* Divider */}
                <div className="mx-5 h-px bg-white/[0.06]" />

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-4 py-5">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.name}>
                                    <NavLink
                                        to={item.path}
                                        end={item.path === '/'}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-white/[0.1] text-white shadow-sm'
                                                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <Icon size={18} className={isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'} />
                                                <span className="flex-1">{item.name}</span>
                                                {isActive && <ChevronRight size={14} className="text-slate-500" />}
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="mx-5 h-px bg-white/[0.06]" />
                <div className="p-4 space-y-3">
                    {/* User info */}
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 text-xs font-bold uppercase">
                            {user?.username?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.username || 'User'}</p>
                            <p className="text-[11px] text-slate-500 truncate">{user?.email || ''}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium
                                   text-slate-500 hover:bg-white/[0.05] hover:text-red-400 transition-all duration-200"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
