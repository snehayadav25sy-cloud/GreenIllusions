import React, { useState, useEffect } from 'react';
import { Activity, Clock, Wifi, WifiOff } from 'lucide-react';

const API_URL = "http://127.0.0.1:8000";

function timeAgo(isoString: string | null): string {
    if (!isoString) return 'Never';
    const diff = Math.floor((Date.now() - new Date(isoString + 'Z').getTime()) / 1000);
    if (diff < 10) return 'Just now';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
}

const Page_AgentActivity = () => {
    const [agents, setAgents] = useState<any[]>([]);
    const [connected, setConnected] = useState(true);
    const [tick, setTick] = useState(0); // forces re-render for timeAgo

    const fetchStatus = () => {
        fetch(`${API_URL}/agents/status`)
            .then(res => res.json())
            .then(data => {
                setAgents(Array.isArray(data) ? data : []);
                setConnected(true);
            })
            .catch(() => setConnected(false));
    };

    useEffect(() => {
        fetchStatus();
        const pollInterval = setInterval(fetchStatus, 5000);
        const tickInterval = setInterval(() => setTick(t => t + 1), 10000); // refresh timeAgo labels
        return () => {
            clearInterval(pollInterval);
            clearInterval(tickInterval);
        };
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Agent Activity</h2>
                    <p className="text-slate-400">Real-time status and execution logs of the multi-agent system.</p>
                </div>
                <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border ${connected ? 'text-green-400 border-green-500/20 bg-green-500/10' : 'text-red-400 border-red-500/20 bg-red-500/10'}`}>
                    {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
                    {connected ? 'Live — polling every 5s' : 'Backend offline'}
                </div>
            </div>

            {agents.length === 0 && !connected ? (
                <div className="p-16 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500">
                    <WifiOff size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="font-bold text-slate-400 mb-1">Cannot reach backend</p>
                    <p className="text-sm">Make sure the FastAPI server is running on port 8000.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(agents.length > 0 ? agents : [
                        { name: "Orchestrator Agent", role: "Workflow Manager", status: "Idle", lastRun: null },
                        { name: "Evidence Retrieval Agent", role: "RAG Pipeline", status: "Idle", lastRun: null },
                        { name: "Verification Agent", role: "Logic & Reasoning", status: "Idle", lastRun: null },
                        { name: "Compliance Agent", role: "Regulatory Check", status: "Idle", lastRun: null },
                        { name: "Audit Agent", role: "Logging & Tracing", status: "Idle", lastRun: null },
                    ]).map((agent, i) => (
                        <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-4 transition-all">
                            <div className="flex justify-between items-start">
                                <div className={`p-3 rounded-xl border transition-colors ${agent.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                                    <Activity size={24} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border flex items-center gap-1 ${agent.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                                    {agent.status === 'Active' && <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block"></span>}
                                    {agent.status}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">{agent.name}</h3>
                                <p className="text-sm text-slate-500">{agent.role}</p>
                            </div>
                            <div className="mt-auto pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-500">
                                <Clock size={12} />
                                Last run: <span className="text-slate-400 font-medium">{timeAgo(agent.lastRun)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Page_AgentActivity;
