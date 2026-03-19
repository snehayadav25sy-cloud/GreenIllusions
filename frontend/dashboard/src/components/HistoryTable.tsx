import React, { useState, useEffect } from 'react';
import { History, Database } from 'lucide-react';

const API_URL = "http://127.0.0.1:8000";

const HistoryTable = () => {
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        fetch(`${API_URL}/history`)
            .then(res => res.json())
            .then(data => setHistory(data))
            .catch(err => console.error(err));
    }, []);

    if (history.length === 0) return (
        <div className="p-20 text-center text-slate-600 border border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
            <Database size={64} className="mx-auto mb-6 opacity-30" />
            <h4 className="text-xl font-bold text-slate-300 mb-2">Audit Log Empty</h4>
            <p className="text-base text-slate-500">Run your first verification to generate a secure blockchain-ready audit trail.</p>
        </div>
    );

    return (
        <div className="mt-12">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <History size={24} className="text-slate-400" /> Recent Analysis History
                </h3>
                <button className="text-sm text-green-500 font-medium hover:text-green-400 transition-colors">Export CSV</button>
            </div>

            <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-sm">
                <table className="w-full text-sm text-left text-slate-400">
                    <thead className="bg-slate-950 text-slate-300 uppercase text-[10px] font-bold tracking-wider">
                        <tr>
                            <th className="px-8 py-5">Timestamp</th>
                            <th className="px-8 py-5">Claim Analyzed</th>
                            <th className="px-8 py-5">Verdict</th>
                            <th className="px-8 py-5">Trust Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {history.map((item, i) => (
                            <tr key={i} className="hover:bg-green-900/5 transition-colors group">
                                <td className="px-8 py-5 whitespace-nowrap font-mono text-xs text-slate-500 group-hover:text-slate-300">{new Date(item.Timestamp).toLocaleString()}</td>
                                <td className="px-8 py-5 max-w-md truncate text-slate-300 font-medium" title={item.Claim}>{item.Claim}</td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${(item.Verdict || '').includes('Verified') ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            (item.Verdict || '').includes('Misleading') ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                        }`}>
                                        {item.Verdict}
                                    </span>
                                </td>
                                <td className="px-8 py-5 font-mono font-bold text-white">{(parseFloat(item.Confidence) * 100).toFixed(0)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryTable;
