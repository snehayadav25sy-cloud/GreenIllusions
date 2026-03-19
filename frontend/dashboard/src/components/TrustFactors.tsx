import React from 'react';
import { Database, ShieldCheck, Zap, Globe } from 'lucide-react';

const TrustFactors = () => {
    const factors = [
        {
            icon: <Database size={14} className="text-blue-400" />,
            label: "50M+ Data Points",
            sub: "Verified Sources"
        },
        {
            icon: <Zap size={14} className="text-yellow-400" />,
            label: "Multi-Agent Logic",
            sub: "Latency < 200ms"
        },
        {
            icon: <ShieldCheck size={14} className="text-green-400" />,
            label: "Blockchain Ready",
            sub: "Audit Trail"
        },
        {
            icon: <Globe size={14} className="text-purple-400" />,
            label: "Global Compliance",
            sub: "FTC & EU Green Deal"
        }
    ];

    return (
        <div className="flex flex-wrap justify-center gap-6 mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            {factors.map((factor, idx) => (
                <div
                    key={idx}
                    className="flex items-center gap-3 px-5 py-3 rounded-full bg-slate-900/40 border border-slate-800/50 backdrop-blur-sm hover:bg-slate-800/60 hover:border-slate-700 transition-all duration-300 group cursor-default"
                >
                    <div className="p-1.5 rounded-full bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform">
                        {factor.icon}
                    </div>
                    <div className="text-left">
                        <div className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{factor.label}</div>
                        <div className="text-[10px] text-slate-500 font-medium tracking-wide">{factor.sub}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TrustFactors;
