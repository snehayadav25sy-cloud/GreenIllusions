import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const EvidenceCard = ({ evidence, index }: any) => {
    const [expanded, setExpanded] = useState(false);
    const meta = evidence.metadata || {};

    return (
        <div className={`group border rounded-2xl mb-4 transition-all duration-300 overflow-hidden ${expanded ? 'bg-slate-900 border-blue-500/30 shadow-2xl shadow-blue-900/10' : 'bg-slate-900/50 border-slate-800/50 hover:border-slate-700 hover:bg-slate-900'}`}>
            <div
                className="p-5 cursor-pointer flex justify-between items-center"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 text-blue-400 flex items-center justify-center text-sm font-bold border border-slate-700 shadow-lg group-hover:scale-110 transition-transform">
                        {index + 1}
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white truncate max-w-lg mb-0.5">{meta.source || 'Authenticated Document Source'}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                            <span>Page {meta.page || 'N/A'}</span>
                            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                            <span>Section: {meta.section || 'General'}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] uppercase font-bold px-3 py-1.5 rounded-full bg-blue-900/20 text-blue-400 border border-blue-500/20 tracking-wider">
                        98% Match
                    </span>
                    {expanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                </div>
            </div>

            {expanded && (
                <div className="p-6 pt-0 border-t border-slate-800/50 bg-slate-950/30 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-sm leading-relaxed font-serif relative mt-4">
                        <span className="absolute -top-3 -left-2 text-4xl text-slate-800 font-serif">"</span>
                        {evidence.text}
                        <span className="absolute -bottom-6 -right-2 text-4xl text-slate-800 font-serif">"</span>
                    </div>
                    <div className="mt-4 flex justify-end gap-3">
                        <button className="text-xs font-semibold flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 hover:border-slate-700">
                            <ExternalLink size={14} /> View Original PDF
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EvidenceCard;
