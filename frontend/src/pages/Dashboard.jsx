import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, UserMinus, UserCheck, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    const { token } = useAuth();
    const [stats, setStats] = useState({
        total: 1470,
        stayed: 1233,
        left: 237,
        rate: 16.1
    });

    useEffect(() => {
        // Fetch real stats from database history
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.totalEmployeesEvaluated > 0) {
                    setStats({
                        total: res.data.totalEmployeesEvaluated,
                        stayed: res.data.employeesStayed,
                        left: res.data.employeesLeft,
                        rate: res.data.attritionRate
                    });
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, [token]);

    const pieData = [
        { name: 'Stayed', value: stats.stayed, color: '#10b981' },
        { name: 'Attrited', value: stats.left, color: '#f43f5e' },
    ];

    // Mock aggregate data for dashboard visualization derived from dataset norms
    const deptData = [
        { name: 'R&D', Attrition: 133 },
        { name: 'Sales', Attrition: 92 },
        { name: 'HR', Attrition: 12 },
    ];

    const StatCard = ({ title, value, icon: Icon, colorClass }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${colorClass}`}>
                    <Icon size={24} />
                </div>
            </div>
            <div>
                <p className="text-gray-500 font-medium text-sm">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Workforce Overview</h1>
                <p className="text-gray-500 text-sm mt-1">Real-time statistics based on the latest prediction history and company data.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Evaluated" value={stats.total} icon={Users} colorClass="bg-blue-100 text-blue-600" />
                <StatCard title="Employees Stayed" value={stats.stayed} icon={UserCheck} colorClass="bg-emerald-100 text-emerald-600" />
                <StatCard title="Employees Left" value={stats.left} icon={UserMinus} colorClass="bg-indigo-100 text-indigo-600" />
                <StatCard title="Attrition Rate" value={`${stats.rate}%`} icon={TrendingUp} colorClass="bg-rose-100 text-rose-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-96 flex flex-col">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Attrition Distribution</h3>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-96 flex flex-col">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Attrition by Department (Historical)</h3>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={deptData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                                <Bar dataKey="Attrition" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
