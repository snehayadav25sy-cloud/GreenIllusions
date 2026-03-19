import React from 'react';
import { Server, Database, Cloud, ShieldCheck } from 'lucide-react';

const Page_Infrastructure = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Cloud Infrastructure</h2>
                <p className="text-slate-400">AWS & IBM Hybrid Cloud Configuration Status.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AWS Card */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl group hover:border-orange-500/50 transition-colors relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Cloud size={100} />
                    </div>
                    <div className="flex items-center gap-4 mb-6 relative">
                        <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400 border border-orange-500/20">
                            <Server size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">AWS Bedrock</h3>
                            <div className="text-xs text-orange-400 font-mono">us-east-1</div>
                        </div>
                    </div>
                    <div className="space-y-3 relative">
                        <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800">
                            <span className="text-sm text-slate-400">Knowledge Base</span>
                            <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded">Synced</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800">
                            <span className="text-sm text-slate-400">Model ID</span>
                            <span className="text-xs font-mono text-slate-500">anthropic.claude-3-sonnet-20240229-v1:0</span>
                        </div>
                    </div>
                </div>

                {/* IBM Card */}
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl group hover:border-blue-500/50 transition-colors relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Database size={100} />
                    </div>
                    <div className="flex items-center gap-4 mb-6 relative">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">IBM Watsonx</h3>
                            <div className="text-xs text-blue-400 font-mono">dal-10</div>
                        </div>
                    </div>
                    <div className="space-y-3 relative">
                        <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800">
                            <span className="text-sm text-slate-400">Governance</span>
                            <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded">Active</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800">
                            <span className="text-sm text-slate-400">Bias Detection</span>
                            <span className="text-xs font-mono text-slate-500">Enabled (Threshold: 0.8)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page_Infrastructure;
