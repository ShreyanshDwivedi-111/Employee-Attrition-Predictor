import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post(`${apiUrl}/auth/login`, { email, password });
            login(res.data.user, res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Left panel — branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 relative overflow-hidden flex-col justify-between p-12 text-white">
                {/* Decorative shapes */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-white/[0.03] rounded-3xl rotate-12" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <Sparkles size={20} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">AttritionIQ</span>
                    </div>
                </div>

                <div className="relative z-10 space-y-6">
                    <h1 className="text-4xl font-bold leading-tight">
                        Predict. Prevent.<br />
                        <span className="text-blue-200">Retain Talent.</span>
                    </h1>
                    <p className="text-blue-100/80 text-lg max-w-md leading-relaxed">
                        AI-powered workforce analytics that help HR teams identify attrition risks before they become resignations.
                    </p>
                    <div className="flex items-center gap-6 pt-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold">25+</p>
                            <p className="text-xs text-blue-200/60 uppercase tracking-wider">Risk Factors</p>
                        </div>
                        <div className="w-px h-10 bg-white/20" />
                        <div className="text-center">
                            <p className="text-2xl font-bold">91%</p>
                            <p className="text-xs text-blue-200/60 uppercase tracking-wider">Accuracy</p>
                        </div>
                        <div className="w-px h-10 bg-white/20" />
                        <div className="text-center">
                            <p className="text-2xl font-bold">Real-time</p>
                            <p className="text-xs text-blue-200/60 uppercase tracking-wider">Predictions</p>
                        </div>
                    </div>
                </div>

                <p className="relative z-10 text-xs text-blue-200/40">© 2026 AttritionIQ. All rights reserved.</p>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md space-y-8 animate-fade-in">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 justify-center mb-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">AttritionIQ</span>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
                        <p className="text-sm text-slate-500 mt-1">Sign in to your account to continue.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="label" htmlFor="login-email">Email Address</label>
                            <input
                                id="login-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                                placeholder="you@company.com"
                            />
                        </div>
                        <div>
                            <label className="label" htmlFor="login-password">Password</label>
                            <div className="relative">
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full">
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>

                        <p className="text-center text-sm text-slate-500">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">Create one</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
