import React from 'react';
import HistoryTable from './HistoryTable';

const Page_AuditLogs = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Audit Logs</h2>
                <p className="text-slate-400">Immutable record of all system verifications and user actions.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6">
                <HistoryTable />
            </div>
        </div>
    );
};

export default Page_AuditLogs;
