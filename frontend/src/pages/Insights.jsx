import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';

const Insights = () => {
    // Mock visualization data based on standard HR dataset distributions
    const distanceData = [
        { distance: '1-5 km', AttritionRate: 12 },
        { distance: '6-10 km', AttritionRate: 15 },
        { distance: '11-15 km', AttritionRate: 20 },
        { distance: '16-20 km', AttritionRate: 25 },
        { distance: '21-30 km', AttritionRate: 35 },
    ];

    const incomeRoleData = [
        { role: 'Sales Exec', income: 6500, attrition: 18 },
        { role: 'Research Sci', income: 5500, attrition: 16 },
        { role: 'Lab Tech', income: 3200, attrition: 22 },
        { role: 'Manager', income: 16000, attrition: 5 },
        { role: 'Sales Rep', income: 2800, attrition: 40 },
    ];

    const workLifeData = [
        { rating: '1 - Bad', Left: 32, Stayed: 60 },
        { rating: '2 - Good', Left: 45, Stayed: 220 },
        { rating: '3 - Better', Left: 110, Stayed: 600 },
        { rating: '4 - Best', Left: 40, Stayed: 250 },
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Exploratory Data Insights</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 self-start border-b pb-2 w-full">Attrition vs Distance From Home</h3>
                    <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={distanceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="distance" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
                                <Tooltip cursor={{ fill: '#f3f4f6' }} formatter={(value) => [`${value}%`, 'Attrition Rate']} />
                                <Bar dataKey="AttritionRate" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-sm text-gray-500 mt-4 text-center">Employees living further than 15km have a significantly higher attrition rate.</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 self-start border-b pb-2 w-full">Work Life Balance Impact</h3>
                    <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={workLifeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="rating" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                                <Legend />
                                <Bar dataKey="Left" stackId="a" fill="#f43f5e" />
                                <Bar dataKey="Stayed" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-sm text-gray-500 mt-4 text-center">Poor work-life balance (Rating 1) shows a disproportionately high ratio of leavers.</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Job Role & Monthly Income Landscape</h3>
                    <div className="w-full h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" dataKey="income" name="Monthly Income" unit="$" tickFormatter={(v) => v / 1000 + 'k'} />
                                <YAxis type="number" dataKey="attrition" name="Attrition Rate" unit="%" />
                                <ZAxis type="category" dataKey="role" name="Role" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Roles" data={incomeRoleData} fill="#8b5cf6" shape="circle" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Insights;
