import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, UserMinus, UserCheck, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const CHART_COLORS = {
    blue: '#2563eb',
    blueLight: '#93c5fd',
    emerald: '#059669',
    emeraldLight: '#a7f3d0',
    rose: '#e11d48',
    roseLight: '#fecdd3',
    slate: '#64748b',
};

const Dashboard = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const { token } = useAuth();
    const [stats, setStats] = useState({
        total: 1470,
        stayed: 1233,
        left: 237,
        rate: 16.1,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/stats`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.totalEmployeesEvaluated > 0) {
                    setStats({
                        total: res.data.totalEmployeesEvaluated,
                        stayed: res.data.employeesStayed,
                        left: res.data.employeesLeft,
                        rate: res.data.attritionRate,
                    });
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, [token]);

    const pieData = [
        { name: 'Stayed', value: stats.stayed },
        { name: 'Attrited', value: stats.left },
    ];
    const PIE_COLORS = [CHART_COLORS.emerald, CHART_COLORS.rose];

    const deptData = [
        { name: 'R&D', Attrition: 133, Total: 961 },
        { name: 'Sales', Attrition: 92, Total: 446 },
        { name: 'HR', Attrition: 12, Total: 63 },
    ];

    const statCards = [
        {
            title: 'Total Evaluated',
            value: stats.total.toLocaleString(),
            icon: Users,
            accent: 'bg-brand-50 text-brand-600',
            trend: null,
        },
        {
            title: 'Employees Retained',
            value: stats.stayed.toLocaleString(),
            icon: UserCheck,
            accent: 'bg-emerald-50 text-emerald-600',
            trend: { up: true, label: 'Positive' },
        },
        {
            title: 'Employees Left',
            value: stats.left.toLocaleString(),
            icon: UserMinus,
            accent: 'bg-red-50 text-red-500',
            trend: { up: false, label: 'At risk' },
        },
        {
            title: 'Attrition Rate',
            value: `${stats.rate}%`,
            icon: TrendingUp,
            accent: 'bg-amber-50 text-amber-600',
            trend: null,
        },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 px-4 py-3 text-sm">
                <p className="font-semibold text-slate-800 mb-1">{label || payload[0]?.name}</p>
                {payload.map((p, i) => (
                    <p key={i} className="text-slate-600">
                        <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: p.color || p.fill }} />
                        {p.name}: <span className="font-semibold text-slate-800">{p.value.toLocaleString()}</span>
                    </p>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
                {statCards.map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.title} className="card p-6 animate-fade-in">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-2.5 rounded-xl ${s.accent}`}>
                                    <Icon size={20} />
                                </div>
                                {s.trend && (
                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                                        s.trend.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                                    }`}>
                                        {s.trend.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                        {s.trend.label}
                                    </span>
                                )}
                            </div>
                            <p className="text-3xl font-bold text-slate-900 animate-count-up">{s.value}</p>
                            <p className="text-sm text-slate-500 mt-1 font-medium">{s.title}</p>
                        </div>
                    );
                })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card-static p-6 h-[400px] flex flex-col">
                    <h3 className="text-base font-semibold text-slate-800 mb-1">Attrition Distribution</h3>
                    <p className="text-xs text-slate-400 mb-4">Proportion of employees retained vs. attrited</p>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={75}
                                    outerRadius={115}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(value) => <span className="text-sm text-slate-600 ml-1">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card-static p-6 h-[400px] flex flex-col">
                    <h3 className="text-base font-semibold text-slate-800 mb-1">Attrition by Department</h3>
                    <p className="text-xs text-slate-400 mb-4">Historical department-level breakdown</p>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deptData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                                <Bar dataKey="Attrition" fill={CHART_COLORS.rose} radius={[6, 6, 0, 0]} barSize={44} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
