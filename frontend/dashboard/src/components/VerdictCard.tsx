import React from 'react';
import { Shield, CheckCircle, XCircle, AlertTriangle, Check } from 'lucide-react';

const VerdictCard = ({ result }: any) => {
    if (!result) return null;
    const analysis = result.analysis;
    const verdict = analysis.final_verdict;
    const confidence = analysis.confidence * 100;

    let color = "bg-slate-900 border-slate-800";
    let icon = <Shield className="w-12 h-12 text-slate-400" />;
    let gradient = "from-slate-800 to-slate-900";

    if (verdict === "Verified Claim") {
        color = "bg-green-950/20 border-green-500/30";
        icon = <CheckCircle className="w-20 h-20 text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.3)]" />;
        gradient = "from-green-900/20 to-slate-900/50";
    } else if (verdict === "Misleading Claim" || verdict === "Potential Greenwashing") {
        color = "bg-red-950/20 border-red-500/30";
        icon = <XCircle className="w-20 h-20 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]" />;
        gradient = "from-red-900/20 to-slate-900/50";
    } else {
        color = "bg-yellow-950/20 border-yellow-500/30";
        icon = <AlertTriangle className="w-20 h-20 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]" />;
        gradient = "from-yellow-900/20 to-slate-900/50";
    }

    return (
        <div className={`p-10 rounded-3xl border ${color} bg-gradient-to-br ${gradient} flex items-stretch justify-between shadow-2xl relative overflow-hidden group transition-all`}>

            <div className="flex items-center gap-8 relative z-10 flex-1">
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 shadow-inner">
                    {icon}
                </div>
                <div>
                    <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tight">{verdict}</h2>
                    <p className="text-slate-300 max-w-2xl text-lg leading-relaxed font-light">{analysis.explanation}</p>
                </div>
            </div>

            {/* Trust Score Gauge */}
            <div className="relative z-10 flex flex-col justify-center gap-6 min-w-[240px] border-l border-white/5 pl-8">
                <div className="text-center">
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 tracking-tighter mb-2">
                        {confidence.toFixed(0)}<span className="text-2xl text-slate-500">%</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Confidence Score</div>
                </div>

                <div className="space-y-2 bg-slate-950/30 p-4 rounded-xl border border-white/5 backdrop-blur-md">
                    <div className="flex justify-between text-xs items-center">
                        <span className="text-slate-400 font-medium">Evidence</span>
                        <span className="text-green-400 font-bold flex items-center gap-1"><Check size={10} /> Strong</span>
                    </div>
                    <div className="flex justify-between text-xs items-center">
                        <span className="text-slate-400 font-medium">Source</span>
                        <span className="text-blue-400 font-bold flex items-center gap-1"><Check size={10} /> Verified</span>
                    </div>
                    <div className="flex justify-between text-xs items-center">
                        <span className="text-slate-400 font-medium">Consistency</span>
                        <span className="text-white font-bold flex items-center gap-1"><Check size={10} /> High</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerdictCard;
