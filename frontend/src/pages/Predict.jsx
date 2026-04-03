import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle2, Loader2, Gauge, Target } from 'lucide-react';

const Predict = () => {
    // Backend setup
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        Age: 35,
        Department: 'Research & Development',
        JobLevel: 2,
        MonthlyIncome: 5000,
        DistanceFromHome: 10,
        YearsAtCompany: 5,
        YearsInCurrentRole: 3,
        YearsWithCurrManager: 3,
        JobSatisfaction: 3,
        WorkLifeBalance: 3,
        EnvironmentSatisfaction: 3,
        RelationshipSatisfaction: 3,
        TrainingTimesLastYear: 2,
        OverTime: 'No'
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await axios.post(`${apiUrl}/api/predict`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to predict attrition.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Predict Employee Attrition</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Personal INFO */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Personal & Demographics</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Age</label>
                                    <input type="number" name="Age" value={formData.Age} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border" required min="18" max="70" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Distance From Home (km)</label>
                                    <input type="number" name="DistanceFromHome" value={formData.DistanceFromHome} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border" required min="1" max="100" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Department</label>
                                    <select name="Department" value={formData.Department} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border">
                                        <option value="Research & Development">Research & Development</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Human Resources">Human Resources</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Monthly Income ($)</label>
                                    <input type="number" name="MonthlyIncome" value={formData.MonthlyIncome} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border" required min="1000" />
                                </div>
                            </div>

                            {/* Job History INFO */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Job & History</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Job Level (1-5)</label>
                                        <input type="number" name="JobLevel" value={formData.JobLevel} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border" required min="1" max="5" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Overtime</label>
                                        <select name="OverTime" value={formData.OverTime} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border">
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Years At Company</label>
                                    <input type="number" name="YearsAtCompany" value={formData.YearsAtCompany} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border" required min="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Years In Current Role</label>
                                    <input type="number" name="YearsInCurrentRole" value={formData.YearsInCurrentRole} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border" required min="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Years With Current Manager</label>
                                    <input type="number" name="YearsWithCurrManager" value={formData.YearsWithCurrManager} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border" required min="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Training Times Last Year</label>
                                    <input type="number" name="TrainingTimesLastYear" value={formData.TrainingTimesLastYear} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border" required min="0" max="6" />
                                </div>
                            </div>

                            {/* Satisfaction INFO */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Satisfaction Ratings (1-4)</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Job Satisfaction</label>
                                        <input type="number" name="JobSatisfaction" value={formData.JobSatisfaction} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border" required min="1" max="4" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Environment</label>
                                        <input type="number" name="EnvironmentSatisfaction" value={formData.EnvironmentSatisfaction} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border" required min="1" max="4" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Relationship</label>
                                        <input type="number" name="RelationshipSatisfaction" value={formData.RelationshipSatisfaction} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border" required min="1" max="4" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Work Life Balance</label>
                                        <input type="number" name="WorkLifeBalance" value={formData.WorkLifeBalance} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border" required min="1" max="4" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-300 transition-colors"
                            >
                                {loading && <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />}
                                Predict Attrition
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}
                </div>

                {/* Result Section */}
                <div className="lg:col-span-1">
                    {result ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
                            <div className={`p-6 text-white text-center ${result.prediction === 'Leave' ? 'bg-red-500' : 'bg-emerald-500'}`}>
                                <div className="flex justify-center mb-4">
                                    {result.prediction === 'Leave' ? <AlertCircle size={48} /> : <CheckCircle2 size={48} />}
                                </div>
                                <h2 className="text-2xl font-bold mb-1">
                                    {result.prediction === 'Leave' ? 'High Risk of Attrition' : 'Likely to Stay'}
                                </h2>
                                <p className="text-white/80">
                                    Probability: {(result.probability * 100).toFixed(1)}%
                                </p>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Key Influencing Factors</h3>
                                    <ul className="space-y-2">
                                        {result.reasons && result.reasons.length > 0 ? (
                                            result.reasons.map((reason, i) => (
                                                <li key={i} className="flex items-start">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 mr-2 shrink-0"></span>
                                                    <span className="text-gray-700">{reason}</span>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="text-gray-500 italic">No specific negative factors identified.</li>
                                        )}
                                    </ul>
                                </div>

                                {result.prediction === 'Leave' && (
                                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                                        <h3 className="text-sm font-medium text-amber-800 uppercase tracking-wider mb-3 flex items-center">
                                            <Gauge className="mr-2 h-4 w-4" /> Recommended Actions
                                        </h3>
                                        <ul className="space-y-2">
                                            {result.solutions && result.solutions.map((solution, i) => (
                                                <li key={i} className="flex items-start text-sm text-amber-900">
                                                    <span className="font-bold mr-2">•</span>
                                                    <span>{solution}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl border border-gray-200 border-dashed p-8 text-center h-full flex flex-col justify-center items-center text-gray-500 sticky top-6">
                            <Target size={48} className="text-gray-300 mb-4" />
                            <p>Fill out the form and submit to see the attrition prediction and AI-generated retention solutions.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Predict;
