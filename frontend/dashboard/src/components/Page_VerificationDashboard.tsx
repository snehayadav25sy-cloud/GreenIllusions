import React from 'react';
import { BarChart3, TrendingUp, Users, FileCheck } from 'lucide-react';
import HistoryTable from './HistoryTable';

const Page_VerificationDashboard = () => {
    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Verification Overview</h2>
                <p className="text-slate-400">System-wide insights and recent activity.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Claims Verified', value: '1,248', icon: <FileCheck className="text-blue-500" />, change: '+12%' },
                    { label: 'Avg. Confidence Score', value: '87%', icon: <TrendingUp className="text-green-500" />, change: '+5%' },
                    { label: 'Active Users', value: '3,402', icon: <Users className="text-purple-500" />, change: '+8%' },
                    { label: 'Trust Index', value: '94.2', icon: <BarChart3 className="text-orange-500" />, change: '+2%' },
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 group-hover:border-slate-700 transition-colors">
                                {stat.icon}
                            </div>
                            <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">{stat.change}</span>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Table using reused component */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h3 className="text-lg font-bold text-white">Recent Verifications</h3>
                </div>
                <div className="p-2">
                    <HistoryTable />
                </div>
            </div>
        </div>
    );
};

export default Page_VerificationDashboard;
