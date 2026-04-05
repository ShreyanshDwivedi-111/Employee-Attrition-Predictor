import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Server, LayoutGrid, Activity, Box, Database } from 'lucide-react';

const ModelInfo = () => {
    const featureImportance = [
        { name: 'OverTime',       importance: 0.85 },
        { name: 'MonthlyIncome',  importance: 0.72 },
        { name: 'Age',            importance: 0.65 },
        { name: 'YearsAtCompany', importance: 0.58 },
        { name: 'TotalWorkingYrs',importance: 0.55 },
        { name: 'JobSatisfaction',importance: 0.45 },
        { name: 'DistanceFromHome',importance: 0.42 },
        { name: 'NumCompanies',   importance: 0.38 },
    ];

    const infoCards = [
        {
            icon: Server,
            iconColor: 'text-brand-500',
            iconBg: 'bg-brand-50',
            label: 'Architecture',
            value: 'XGBoost Classifier',
            sub: 'Gradient Boosted Decision Trees',
        },
        {
            icon: LayoutGrid,
            iconColor: 'text-indigo-500',
            iconBg: 'bg-indigo-50',
            label: 'Input Features',
            value: '25 Attributes',
            sub: 'Numeric, Categorical & Ordinal',
        },
        {
            icon: Database,
            iconColor: 'text-violet-500',
            iconBg: 'bg-violet-50',
            label: 'Training Dataset',
            value: '1,470 Records',
            sub: 'Attrition Dataset',
        },
        {
            icon: Activity,
            iconColor: 'text-emerald-500',
            iconBg: 'bg-emerald-50',
            label: 'Target Variable',
            value: 'Attrition (Binary)',
            sub: 'Leave (1) or Stay (0)',
        },
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 px-4 py-3 text-sm">
                <p className="font-semibold text-slate-800">{payload[0]?.payload?.name}</p>
                <p className="text-slate-600">Importance: <span className="font-semibold">{payload[0]?.value}</span></p>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <p className="text-sm text-slate-500">Technical details about the machine learning pipeline used for predictions.</p>

            {/* Info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
                {infoCards.map((c) => {
                    const Icon = c.icon;
                    return (
                        <div key={c.label} className="card p-6 animate-fade-in">
                            <div className={`p-2.5 rounded-xl ${c.iconBg} ${c.iconColor} w-fit mb-4`}>
                                <Icon size={20} />
                            </div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{c.label}</p>
                            <p className="text-lg font-bold text-slate-900 mt-1">{c.value}</p>
                            <p className="text-xs text-slate-400 mt-1">{c.sub}</p>
                        </div>
                    );
                })}
            </div>

            {/* Feature Importance Chart */}
            <div className="card-static p-6">
                <h3 className="text-base font-semibold text-slate-800 mb-1">Feature Importance</h3>
                <p className="text-xs text-slate-400 mb-6">Relative influence of each feature on the model's attrition prediction</p>
                <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={featureImportance} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                            <XAxis type="number" domain={[0, 1]} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 13 }} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                            <Bar dataKey="importance" fill="#2563eb" radius={[0, 6, 6, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-6 bg-brand-50 rounded-xl p-4 border border-brand-100 text-sm text-brand-800">
                    <strong>Interpretation:</strong> The chart displays relative influence of each factor on attrition prediction.{' '}
                    <strong>OverTime</strong> and <strong>MonthlyIncome</strong> are the strongest predictors — employees working overtime with lower pay are at highest risk.
                </div>
            </div>
        </div>
    );
};

export default ModelInfo;
