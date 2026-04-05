import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    AlertCircle, CheckCircle2, Loader2, Gauge, Target,
    User, Briefcase, GraduationCap, DollarSign, Clock, HeartHandshake,
    ChevronDown, ChevronUp, Lightbulb
} from 'lucide-react';

// ── Section collapse helper ──────────────────────────────────────
const FormSection = ({ icon: Icon, title, children, defaultOpen = true }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="card-static overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
                        <Icon size={16} />
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{title}</span>
                </div>
                {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </button>
            {open && (
                <div className="px-6 pb-6 pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4 animate-fade-in">
                    {children}
                </div>
            )}
        </div>
    );
};

const Field = ({ label, children }) => (
    <div>
        <label className="label">{label}</label>
        {children}
    </div>
);

// ── Main Component ───────────────────────────────────────────────
const Predict = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // All 25 fields matching ML service EmployeeData schema exactly
    const [formData, setFormData] = useState({
        Age: 35,
        BusinessTravel: 'Travel_Rarely',
        Department: 'Research & Development',
        DistanceFromHome: 10,
        Education: 3,
        EducationField: 'Science',
        EnvironmentSatisfaction: 3,
        Gender: 'Male',
        JobInvolvement: 3,
        JobRole: 'Research Scientist',
        JobSatisfaction: 3,
        MaritalStatus: 'Married',
        MonthlyIncome: 50000,
        NumCompaniesWorked: 2,
        OverTime: 'No',
        PercentSalaryHike: 13,
        RelationshipSatisfaction: 3,
        StockOptionLevel: 1,
        TotalWorkingYears: 10,
        TrainingTimesLastYear: 3,
        WorkLifeBalance: 3,
        YearsAtCompany: 5,
        YearsInCurrentRole: 3,
        YearsSinceLastPromotion: 1,
        YearsWithCurrManager: 3,
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await axios.post(`${apiUrl}/api/predict`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || err.response?.data?.error || 'Failed to predict attrition.');
        } finally {
            setLoading(false);
        }
    };

    const riskPercent = result ? (result.probability * 100).toFixed(1) : 0;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* ── Form ────────────────────────────────────────── */}
                <div className="xl:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Personal & Demographics */}
                        <FormSection icon={User} title="Personal & Demographics">
                            <Field label="Age">
                                <input type="number" name="Age" value={formData.Age} onChange={handleChange} className="input" required min="18" max="70" />
                            </Field>
                            <Field label="Gender">
                                <select name="Gender" value={formData.Gender} onChange={handleChange} className="input-select">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </Field>
                            <Field label="Marital Status">
                                <select name="MaritalStatus" value={formData.MaritalStatus} onChange={handleChange} className="input-select">
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                </select>
                            </Field>
                            <Field label="Distance From Home (km)">
                                <input type="number" name="DistanceFromHome" value={formData.DistanceFromHome} onChange={handleChange} className="input" required min="1" max="30" />
                            </Field>
                        </FormSection>

                        {/* Education */}
                        <FormSection icon={GraduationCap} title="Education">
                            <Field label="Education Level (1–5)">
                                <select name="Education" value={formData.Education} onChange={handleChange} className="input-select">
                                    <option value={1}>1 — Below College</option>
                                    <option value={2}>2 — College</option>
                                    <option value={3}>3 — Bachelor</option>
                                    <option value={4}>4 — Master</option>
                                    <option value={5}>5 — Doctor</option>
                                </select>
                            </Field>
                            <Field label="Education Field">
                                <select name="EducationField" value={formData.EducationField} onChange={handleChange} className="input-select">
                                    <option value="Science">Science</option>
                                    <option value="Medical">Medical</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Technical Degree">Technical Degree</option>
                                    <option value="Human Resources">Human Resources</option>
                                    <option value="Other">Other</option>
                                </select>
                            </Field>
                        </FormSection>

                        {/* Job Details */}
                        <FormSection icon={Briefcase} title="Job Details">
                            <Field label="Department">
                                <select name="Department" value={formData.Department} onChange={handleChange} className="input-select">
                                    <option value="Research & Development">Research & Development</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Human Resources">Human Resources</option>
                                </select>
                            </Field>
                            <Field label="Job Role">
                                <select name="JobRole" value={formData.JobRole} onChange={handleChange} className="input-select">
                                    <option value="Sales Executive">Sales Executive</option>
                                    <option value="Research Scientist">Research Scientist</option>
                                    <option value="Laboratory Technician">Laboratory Technician</option>
                                    <option value="Manufacturing Director">Manufacturing Director</option>
                                    <option value="Healthcare Representative">Healthcare Representative</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Sales Representative">Sales Representative</option>
                                    <option value="Research Director">Research Director</option>
                                    <option value="Human Resources">Human Resources</option>
                                </select>
                            </Field>
                            <Field label="Business Travel">
                                <select name="BusinessTravel" value={formData.BusinessTravel} onChange={handleChange} className="input-select">
                                    <option value="Non-Travel">Non-Travel</option>
                                    <option value="Travel_Rarely">Travel Rarely</option>
                                    <option value="Travel_Frequently">Travel Frequently</option>
                                </select>
                            </Field>
                            <Field label="Overtime">
                                <select name="OverTime" value={formData.OverTime} onChange={handleChange} className="input-select">
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </Field>
                            <Field label="Job Involvement (1–4)">
                                <select name="JobInvolvement" value={formData.JobInvolvement} onChange={handleChange} className="input-select">
                                    <option value={1}>1 — Low</option>
                                    <option value={2}>2 — Medium</option>
                                    <option value={3}>3 — High</option>
                                    <option value={4}>4 — Very High</option>
                                </select>
                            </Field>
                        </FormSection>

                        {/* Compensation */}
                        <FormSection icon={DollarSign} title="Compensation">
                            <Field label="Monthly Income (₹)">
                                <input type="number" name="MonthlyIncome" value={formData.MonthlyIncome} onChange={handleChange} className="input" required min="1000" />
                            </Field>
                            <Field label="Percent Salary Hike (%)">
                                <input type="number" name="PercentSalaryHike" value={formData.PercentSalaryHike} onChange={handleChange} className="input" required min="0" max="50" />
                            </Field>
                            <Field label="Stock Option Level (0–3)">
                                <select name="StockOptionLevel" value={formData.StockOptionLevel} onChange={handleChange} className="input-select">
                                    <option value={0}>0 — None</option>
                                    <option value={1}>1 — Low</option>
                                    <option value={2}>2 — Medium</option>
                                    <option value={3}>3 — High</option>
                                </select>
                            </Field>
                        </FormSection>

                        {/* Experience & Tenure */}
                        <FormSection icon={Clock} title="Experience & Tenure">
                            <Field label="Total Working Years">
                                <input type="number" name="TotalWorkingYears" value={formData.TotalWorkingYears} onChange={handleChange} className="input" required min="0" max="50" />
                            </Field>
                            <Field label="Num Companies Worked">
                                <input type="number" name="NumCompaniesWorked" value={formData.NumCompaniesWorked} onChange={handleChange} className="input" required min="0" max="20" />
                            </Field>
                            <Field label="Years At Company">
                                <input type="number" name="YearsAtCompany" value={formData.YearsAtCompany} onChange={handleChange} className="input" required min="0" max="50" />
                            </Field>
                            <Field label="Years In Current Role">
                                <input type="number" name="YearsInCurrentRole" value={formData.YearsInCurrentRole} onChange={handleChange} className="input" required min="0" max="20" />
                            </Field>
                            <Field label="Years Since Last Promotion">
                                <input type="number" name="YearsSinceLastPromotion" value={formData.YearsSinceLastPromotion} onChange={handleChange} className="input" required min="0" max="20" />
                            </Field>
                            <Field label="Years With Current Manager">
                                <input type="number" name="YearsWithCurrManager" value={formData.YearsWithCurrManager} onChange={handleChange} className="input" required min="0" max="20" />
                            </Field>
                            <Field label="Training Times Last Year">
                                <input type="number" name="TrainingTimesLastYear" value={formData.TrainingTimesLastYear} onChange={handleChange} className="input" required min="0" max="6" />
                            </Field>
                        </FormSection>

                        {/* Satisfaction Ratings */}
                        <FormSection icon={HeartHandshake} title="Satisfaction Ratings">
                            <Field label="Job Satisfaction (1–4)">
                                <select name="JobSatisfaction" value={formData.JobSatisfaction} onChange={handleChange} className="input-select">
                                    <option value={1}>1 — Low</option>
                                    <option value={2}>2 — Medium</option>
                                    <option value={3}>3 — High</option>
                                    <option value={4}>4 — Very High</option>
                                </select>
                            </Field>
                            <Field label="Environment Satisfaction (1–4)">
                                <select name="EnvironmentSatisfaction" value={formData.EnvironmentSatisfaction} onChange={handleChange} className="input-select">
                                    <option value={1}>1 — Low</option>
                                    <option value={2}>2 — Medium</option>
                                    <option value={3}>3 — High</option>
                                    <option value={4}>4 — Very High</option>
                                </select>
                            </Field>
                            <Field label="Relationship Satisfaction (1–4)">
                                <select name="RelationshipSatisfaction" value={formData.RelationshipSatisfaction} onChange={handleChange} className="input-select">
                                    <option value={1}>1 — Low</option>
                                    <option value={2}>2 — Medium</option>
                                    <option value={3}>3 — High</option>
                                    <option value={4}>4 — Very High</option>
                                </select>
                            </Field>
                            <Field label="Work-Life Balance (1–4)">
                                <select name="WorkLifeBalance" value={formData.WorkLifeBalance} onChange={handleChange} className="input-select">
                                    <option value={1}>1 — Bad</option>
                                    <option value={2}>2 — Good</option>
                                    <option value={3}>3 — Better</option>
                                    <option value={4}>4 — Best</option>
                                </select>
                            </Field>
                        </FormSection>

                        {/* Submit */}
                        <div className="flex items-center justify-between pt-2">
                            <p className="text-xs text-slate-400">All 25 employee attributes will be analyzed.</p>
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading && <Loader2 size={16} className="animate-spin" />}
                                {loading ? 'Analyzing…' : 'Run Prediction'}
                            </button>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-600">{typeof error === 'string' ? error : JSON.stringify(error)}</p>
                            </div>
                        )}
                    </form>
                </div>

                {/* ── Result Panel ─────────────────────────────────── */}
                <div className="xl:col-span-1">
                    {result ? (
                        <div className="card-static overflow-hidden sticky top-6 animate-fade-in">
                            {/* Header */}
                            <div className={`p-8 text-center text-white ${result.prediction === 'Leave'
                                ? 'bg-gradient-to-br from-red-500 to-rose-600'
                                : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                            }`}>
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                                    {result.prediction === 'Leave'
                                        ? <AlertCircle size={32} />
                                        : <CheckCircle2 size={32} />
                                    }
                                </div>
                                <h2 className="text-xl font-bold mb-1">
                                    {result.prediction === 'Leave' ? 'High Attrition Risk' : 'Likely to Stay'}
                                </h2>
                                <p className="text-white/80 text-sm">
                                    Risk Probability: <span className="font-bold text-white">{riskPercent}%</span>
                                </p>

                                {/* Mini gauge bar */}
                                <div className="mt-5 mx-auto w-full max-w-[200px]">
                                    <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-white transition-all duration-1000 ease-out"
                                            style={{ width: `${riskPercent}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-white/50 mt-1">
                                        <span>0%</span>
                                        <span>Threshold: {(result.threshold * 100).toFixed(1)}%</span>
                                        <span>100%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-6">
                                {/* Reasons */}
                                <div>
                                    <h3 className="section-title">
                                        <AlertCircle size={14} />
                                        Risk Factors
                                    </h3>
                                    {result.reasons?.length > 0 ? (
                                        <ul className="space-y-2.5">
                                            {result.reasons.map((reason, i) => (
                                                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                                    {reason}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">No specific risk factors identified.</p>
                                    )}
                                </div>

                                {/* Solutions */}
                                {result.solutions?.length > 0 && (
                                    <div className="bg-brand-50 rounded-xl p-4 border border-brand-100">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-700 mb-3 flex items-center gap-2">
                                            <Lightbulb size={14} />
                                            Recommended Actions
                                        </h3>
                                        <ul className="space-y-2">
                                            {result.solutions.map((solution, i) => (
                                                <li key={i} className="flex items-start gap-2.5 text-sm text-brand-800">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                                                    {solution}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="card-static border-dashed p-10 text-center flex flex-col items-center justify-center min-h-[300px] sticky top-6">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                                <Target size={28} className="text-slate-300" />
                            </div>
                            <p className="text-sm text-slate-400 max-w-[220px] leading-relaxed">
                                Fill out the employee details and run the prediction to see AI-powered attrition analysis.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Predict;
