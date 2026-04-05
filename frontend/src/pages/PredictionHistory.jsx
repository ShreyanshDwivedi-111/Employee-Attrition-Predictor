import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Clock, Calendar, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const PredictionHistory = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const { token } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const perPage = 10;

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/history`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setHistory(res.data);
            } catch (error) {
                console.error('Error fetching history:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [token]);

    const filtered = history.filter((r) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            r.employee_data?.Department?.toLowerCase().includes(q) ||
            r.employee_data?.JobRole?.toLowerCase().includes(q) ||
            r.prediction_result?.toLowerCase().includes(q)
        );
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-sm text-slate-500 mt-1">Review past employee attrition evaluations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by role, dept…"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="input pl-9 w-56"
                        />
                    </div>
                    <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center text-xs font-semibold text-slate-600 shrink-0">
                        <Clock size={14} className="mr-2 text-slate-400" />
                        {filtered.length} Records
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card-static overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Job Role</th>
                                <th className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Income</th>
                                <th className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Prediction</th>
                                <th className="px-6 py-3.5 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">Risk %</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center text-sm text-slate-400">
                                        <span className="inline-block w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mr-2 align-middle" />
                                        Loading history…
                                    </td>
                                </tr>
                            ) : paginated.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center text-sm text-slate-400">
                                        {search ? 'No results match your search.' : 'No prediction history yet. Run your first prediction to get started.'}
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((record) => (
                                    <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-400" />
                                            {new Date(record.created_at).toLocaleDateString('en-IN', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {record.employee_data?.Department || '—'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {record.employee_data?.JobRole || '—'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                                            ₹{(record.employee_data?.MonthlyIncome || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                record.prediction_result === 'Stay'
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : 'bg-red-50 text-red-600 border border-red-200'
                                            }`}>
                                                {record.prediction_result}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800 text-right">
                                            {(record.probability * 100).toFixed(1)}%
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                        <p className="text-xs text-slate-500">
                            Page {page} of {totalPages} · Showing {paginated.length} of {filtered.length}
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="btn-secondary !px-2.5 !py-1.5 disabled:opacity-40"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="btn-secondary !px-2.5 !py-1.5 disabled:opacity-40"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PredictionHistory;
