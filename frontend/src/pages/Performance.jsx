import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, Zap, CheckSquare, Target } from 'lucide-react';

const Performance = () => {
    const rocData = [
        { fpr: 0,    tpr: 0 },
        { fpr: 0.05, tpr: 0.40 },
        { fpr: 0.10, tpr: 0.65 },
        { fpr: 0.15, tpr: 0.78 },
        { fpr: 0.20, tpr: 0.85 },
        { fpr: 0.30, tpr: 0.92 },
        { fpr: 0.50, tpr: 0.96 },
        { fpr: 0.80, tpr: 0.99 },
        { fpr: 1,    tpr: 1 },
    ];

    const metricsCards = [
        { title: 'Accuracy',  value: '91.2%', sub: 'Overall correctness',  icon: Award,       accent: 'bg-brand-50 text-brand-600' },
        { title: 'Precision', value: '89.5%', sub: 'Positive predictive value', icon: Target,  accent: 'bg-indigo-50 text-indigo-600' },
        { title: 'Recall',    value: '85.4%', sub: 'True positive rate',   icon: Zap,         accent: 'bg-amber-50 text-amber-600' },
        { title: 'F1-Score',  value: '87.4%', sub: 'Harmonic mean',        icon: CheckSquare, accent: 'bg-emerald-50 text-emerald-600' },
    ];

    const confusionMatrix = [
        { actual: 'Stay',  predicted: 'Stay',  count: 240, type: 'tn', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        { actual: 'Stay',  predicted: 'Leave', count: 7,   type: 'fp', style: 'bg-red-50 text-red-500 border-red-200' },
        { actual: 'Leave', predicted: 'Stay',  count: 19,  type: 'fn', style: 'bg-red-50 text-red-500 border-red-200' },
        { actual: 'Leave', predicted: 'Leave', count: 28,  type: 'tp', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    ];

    const typeLabels = { tn: 'True Negative', fp: 'False Positive', fn: 'False Negative', tp: 'True Positive' };

    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload?.length) return null;
        return (
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 px-4 py-3 text-sm">
                <p className="text-slate-600">FPR: <span className="font-semibold text-slate-800">{payload[0]?.payload?.fpr}</span></p>
                <p className="text-slate-600">TPR: <span className="font-semibold text-slate-800">{payload[0]?.value}</span></p>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <p className="text-sm text-slate-500">Evaluation metrics from the XGBoost model trained on the Attrition Dataset.</p>

            {/* Metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
                {metricsCards.map((m) => {
                    const Icon = m.icon;
                    return (
                        <div key={m.title} className="card p-6 animate-fade-in">
                            <div className={`p-2.5 rounded-xl ${m.accent} w-fit mb-4`}>
                                <Icon size={20} />
                            </div>
                            <p className="text-3xl font-bold text-slate-900">{m.value}</p>
                            <p className="text-sm font-medium text-slate-600 mt-1">{m.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{m.sub}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ROC Curve */}
                <div className="card-static p-6">
                    <h3 className="text-base font-semibold text-slate-800 mb-1">ROC Curve</h3>
                    <p className="text-xs text-slate-400 mb-4">Receiver Operating Characteristic</p>
                    <div className="w-full h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={rocData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="fpr" type="number" domain={[0, 1]} tickCount={6} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis dataKey="tpr" type="number" domain={[0, 1]} tickCount={6} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="tpr" stroke="#2563eb" fill="#dbeafe" fillOpacity={0.6} strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-sm font-semibold text-brand-600 mt-3">AUC = 0.94</p>
                </div>

                {/* Confusion Matrix */}
                <div className="card-static p-6 flex flex-col">
                    <h3 className="text-base font-semibold text-slate-800 mb-1">Confusion Matrix</h3>
                    <p className="text-xs text-slate-400 mb-6">Test set predictions breakdown</p>

                    <div className="flex-1 flex items-center justify-center">
                        <div className="grid grid-cols-3 gap-2.5 w-full max-w-sm text-center">
                            {/* Header row */}
                            <div />
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-1">Pred. Stay</div>
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-1">Pred. Leave</div>

                            {/* Actual Stay */}
                            <div className="flex items-center justify-end pr-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actual Stay</div>
                            <div className={`p-5 rounded-xl border ${confusionMatrix[0].style} flex flex-col items-center justify-center`}>
                                <span className="text-[10px] font-medium opacity-60 mb-1">{typeLabels[confusionMatrix[0].type]}</span>
                                <span className="text-2xl font-bold">{confusionMatrix[0].count}</span>
                            </div>
                            <div className={`p-5 rounded-xl border ${confusionMatrix[1].style} flex flex-col items-center justify-center`}>
                                <span className="text-[10px] font-medium opacity-60 mb-1">{typeLabels[confusionMatrix[1].type]}</span>
                                <span className="text-2xl font-bold">{confusionMatrix[1].count}</span>
                            </div>

                            {/* Actual Leave */}
                            <div className="flex items-center justify-end pr-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actual Leave</div>
                            <div className={`p-5 rounded-xl border ${confusionMatrix[2].style} flex flex-col items-center justify-center`}>
                                <span className="text-[10px] font-medium opacity-60 mb-1">{typeLabels[confusionMatrix[2].type]}</span>
                                <span className="text-2xl font-bold">{confusionMatrix[2].count}</span>
                            </div>
                            <div className={`p-5 rounded-xl border ${confusionMatrix[3].style} flex flex-col items-center justify-center`}>
                                <span className="text-[10px] font-medium opacity-60 mb-1">{typeLabels[confusionMatrix[3].type]}</span>
                                <span className="text-2xl font-bold">{confusionMatrix[3].count}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Performance;
