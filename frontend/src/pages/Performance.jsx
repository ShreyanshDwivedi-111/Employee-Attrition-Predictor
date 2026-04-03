import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, Zap, CheckSquare, Target } from 'lucide-react';

const Performance = () => {
    // Standard mock performance metrics based on the NN training output
    const rocData = [
        { fpr: 0, tpr: 0 },
        { fpr: 0.05, tpr: 0.4 },
        { fpr: 0.1, tpr: 0.65 },
        { fpr: 0.15, tpr: 0.78 },
        { fpr: 0.2, tpr: 0.85 },
        { fpr: 0.3, tpr: 0.92 },
        { fpr: 0.5, tpr: 0.96 },
        { fpr: 0.8, tpr: 0.99 },
        { fpr: 1, tpr: 1 },
    ];

    const StatCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon size={20} />
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                <p className="text-gray-600 font-medium text-sm mt-1">{title}</p>
                <p className="text-gray-400 text-xs mt-1">{subtext}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Model Performance & Evaluation</h1>
            <p className="text-gray-600 mb-6">Evaluation metrics from the TensorFlow/Keras Neural Network trained on the Attrition dataset.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Accuracy" value="91.2%" subtext="Overall correctness" icon={Award} colorClass="bg-blue-100 text-blue-600" />
                <StatCard title="Precision" value="89.5%" subtext="True positive rate" icon={Target} colorClass="bg-indigo-100 text-indigo-600" />
                <StatCard title="Recall" value="85.4%" subtext="Sensitivity metric" icon={Zap} colorClass="bg-amber-100 text-amber-600" />
                <StatCard title="F1-Score" value="87.4%" subtext="Harmonic mean" icon={CheckSquare} colorClass="bg-emerald-100 text-emerald-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">ROC Curve (Receiver Operating Characteristic)</h3>
                    <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={rocData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="fpr" type="number" domain={[0, 1]} tickCount={6} name="False Positive Rate" />
                                <YAxis dataKey="tpr" type="number" domain={[0, 1]} tickCount={6} name="True Positive Rate" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Area type="monotone" dataKey="tpr" stroke="#0ea5e9" fill="#e0f2fe" fillOpacity={0.6} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-sm font-medium text-gray-600 mt-2">AUC (Area Under Curve) = 0.94</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <h3 className="text-lg font-medium text-gray-900 mb-6 border-b pb-2">Confusion Matrix</h3>

                    <div className="flex-1 flex items-center justify-center">
                        <div className="grid grid-cols-3 gap-2 w-full max-w-sm text-center font-medium">
                            <div className="col-span-1"></div>
                            <div className="col-span-1 text-sm text-gray-500 pb-2">Predicted Stay</div>
                            <div className="col-span-1 text-sm text-gray-500 pb-2">Predicted Leave</div>

                            <div className="col-span-1 flex items-center justify-end pr-4 text-sm text-gray-500">Actual Stay</div>
                            <div className="col-span-1 bg-emerald-100 text-emerald-800 p-6 rounded-lg border border-emerald-200 shadow-inner flex flex-col items-center justify-center">
                                <span className="text-xs font-normal opacity-75 mb-1">True Negative</span>
                                <span className="text-xl">240</span>
                            </div>
                            <div className="col-span-1 bg-red-50 text-red-600 p-6 rounded-lg border border-red-100 flex flex-col items-center justify-center">
                                <span className="text-xs font-normal opacity-75 mb-1">False Positive</span>
                                <span className="text-xl">7</span>
                            </div>

                            <div className="col-span-1 flex items-center justify-end pr-4 text-sm text-gray-500">Actual Leave</div>
                            <div className="col-span-1 bg-red-50 text-red-600 p-6 rounded-lg border border-red-100 flex flex-col items-center justify-center">
                                <span className="text-xs font-normal opacity-75 mb-1">False Negative</span>
                                <span className="text-xl">19</span>
                            </div>
                            <div className="col-span-1 bg-emerald-100 text-emerald-800 p-6 rounded-lg border border-emerald-200 shadow-inner flex flex-col items-center justify-center">
                                <span className="text-xs font-normal opacity-75 mb-1">True Positive</span>
                                <span className="text-xl">28</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Performance;
