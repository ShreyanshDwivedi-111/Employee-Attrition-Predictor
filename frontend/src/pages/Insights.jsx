import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';

const CHART_BLUE   = '#2563eb';
const CHART_ROSE   = '#e11d48';
const CHART_EMERALD = '#059669';

const Insights = () => {
    const distanceData = [
        { distance: '1–5 km',   AttritionRate: 12 },
        { distance: '6–10 km',  AttritionRate: 15 },
        { distance: '11–15 km', AttritionRate: 20 },
        { distance: '16–20 km', AttritionRate: 25 },
        { distance: '21–30 km', AttritionRate: 35 },
    ];

    const incomeRoleData = [
        { role: 'Sales Exec',    income: 6500,  attrition: 18 },
        { role: 'Research Sci',  income: 5500,  attrition: 16 },
        { role: 'Lab Tech',      income: 3200,  attrition: 22 },
        { role: 'Manager',       income: 16000, attrition: 5 },
        { role: 'Sales Rep',     income: 2800,  attrition: 40 },
    ];

    const workLifeData = [
        { rating: '1 — Bad',    Left: 32,  Stayed: 60 },
        { rating: '2 — Good',   Left: 45,  Stayed: 220 },
        { rating: '3 — Better', Left: 110, Stayed: 600 },
        { rating: '4 — Best',   Left: 40,  Stayed: 250 },
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 px-4 py-3 text-sm">
                <p className="font-semibold text-slate-800 mb-1">{label || payload[0]?.name}</p>
                {payload.map((p, i) => (
                    <p key={i} className="text-slate-600">
                        <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: p.color || p.fill }} />
                        {p.name}: <span className="font-semibold">{typeof p.value === 'number' && p.unit ? `${p.value}${p.unit}` : p.value}</span>
                    </p>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <p className="text-sm text-slate-500">Visual exploration of factors correlated with employee attrition.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Distance */}
                <div className="card-static p-6 flex flex-col">
                    <h3 className="text-base font-semibold text-slate-800 mb-1">Attrition vs Distance From Home</h3>
                    <p className="text-xs text-slate-400 mb-4">Rate increases significantly beyond 15 km</p>
                    <div className="w-full h-72 flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={distanceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="distance" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                                <Bar dataKey="AttritionRate" name="Attrition Rate" fill={CHART_BLUE} radius={[6,6,0,0]} barSize={36} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Work-Life Balance */}
                <div className="card-static p-6 flex flex-col">
                    <h3 className="text-base font-semibold text-slate-800 mb-1">Work-Life Balance Impact</h3>
                    <p className="text-xs text-slate-400 mb-4">Rating 1 shows disproportionately high attrition</p>
                    <div className="w-full h-72 flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={workLifeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="rating" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                                <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-sm text-slate-600 ml-1">{v}</span>} />
                                <Bar dataKey="Left" stackId="a" fill={CHART_ROSE} />
                                <Bar dataKey="Stayed" stackId="a" fill={CHART_EMERALD} radius={[6,6,0,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Scatter */}
                <div className="card-static p-6 lg:col-span-2">
                    <h3 className="text-base font-semibold text-slate-800 mb-1">Job Role & Monthly Income Landscape</h3>
                    <p className="text-xs text-slate-400 mb-4">Lower income roles tend to have higher attrition rates</p>
                    <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis type="number" dataKey="income" name="Monthly Income" unit="₹" tickFormatter={(v) => `₹${v / 1000}k`} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <YAxis type="number" dataKey="attrition" name="Attrition Rate" unit="%" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <ZAxis type="category" dataKey="role" name="Role" />
                                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Roles" data={incomeRoleData} fill={CHART_BLUE} />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Insights;
