import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    BarChart2,
    Info,
    UserPlus,
    History,
    Target,
    LogOut,
    Menu
} from 'lucide-react';

const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Data Insights', path: '/insights', icon: <BarChart2 size={20} /> },
        { name: 'Model Information', path: '/model-info', icon: <Info size={20} /> },
        { name: 'Predict Attrition', path: '/predict', icon: <UserPlus size={20} /> },
        { name: 'Prediction History', path: '/history', icon: <History size={20} /> },
        { name: 'Model Performance', path: '/performance', icon: <Target size={20} /> },
    ];

    return (
        <>
            {/* Mobile backdrop */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
                <div className="flex h-16 shrink-0 items-center px-6 bg-slate-950">
                    <span className="text-xl font-bold tracking-wider text-teal-400">Attrition Predictor</span>
                </div>

                <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
                    <ul className="flex flex-1 flex-col gap-y-2">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <NavLink
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors duration-200 ${isActive
                                            ? 'bg-slate-800 text-white'
                                            : 'text-gray-400 hover:text-white hover:bg-slate-800'
                                        }`
                                    }
                                >
                                    <span className="shrink-0">{item.icon}</span>
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 bg-slate-950">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-400 hover:bg-slate-800 hover:text-white transition-colors duration-200"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
