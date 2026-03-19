import React, { useState } from 'react';
import { Server, Database, Search, Leaf, Users, Scale, ChevronDown, ChevronUp, Sparkles, ArrowRight } from 'lucide-react';

interface ClaimInputProps {
    claim: string;
    setClaim: (value: string) => void;
    provider: string;
    setProvider: (value: string) => void;
    loading: boolean;
    handleSubmit: (e: any) => void;
}

const ClaimInput = ({ claim, setClaim, provider, setProvider, loading, handleSubmit }: ClaimInputProps) => {
    const [domain, setDomain] = useState('environmental');
    const [showPreview, setShowPreview] = useState(false);

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Redesigned Provider Selector: Glow-Tab Style */}
            <div className="flex justify-center gap-6 mb-8">
                <button
                    type="button"
                    onClick={() => setProvider('aws')}
                    className={`relative group px-8 py-3 rounded-2xl border transition-all duration-300 flex items-center gap-3 overflow-hidden
                        ${provider === 'aws'
                            ? 'bg-slate-900/80 border-orange-500/50 text-white shadow-[0_0_30px_rgba(249,115,22,0.2)]'
                            : 'bg-slate-950/30 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                        }`}
                >
                    <div className={`p-2 rounded-lg transition-colors ${provider === 'aws' ? 'bg-orange-500 text-white' : 'bg-slate-900 text-slate-600 group-hover:bg-slate-800'}`}>
                        <Server size={18} />
                    </div>
                    <div className="text-left">
                        <div className="text-[10px] uppercase font-bold tracking-wider opacity-50">Provider</div>
                        <div className="text-sm font-bold tracking-wide">AWS Bedrock</div>
                    </div>
                    {provider === 'aws' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-yellow-400 animate-in slide-in-from-left duration-500"></div>}
                </button>

                <button
                    type="button"
                    onClick={() => setProvider('ibm')}
                    className={`relative group px-8 py-3 rounded-2xl border transition-all duration-300 flex items-center gap-3 overflow-hidden
                        ${provider === 'ibm'
                            ? 'bg-slate-900/80 border-blue-500/50 text-white shadow-[0_0_30px_rgba(59,130,246,0.2)]'
                            : 'bg-slate-950/30 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                        }`}
                >
                    <div className={`p-2 rounded-lg transition-colors ${provider === 'ibm' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-600 group-hover:bg-slate-800'}`}>
                        <Database size={18} />
                    </div>
                    <div className="text-left">
                        <div className="text-[10px] uppercase font-bold tracking-wider opacity-50">Provider</div>
                        <div className="text-sm font-bold tracking-wide">IBM Watson</div>
                    </div>
                    {provider === 'ibm' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-cyan-400 animate-in slide-in-from-left duration-500"></div>}
                </button>

                <button
                    type="button"
                    onClick={() => setProvider('gemini')}
                    className={`relative group px-8 py-3 rounded-2xl border transition-all duration-300 flex items-center gap-3 overflow-hidden
                        ${provider === 'gemini'
                            ? 'bg-slate-900/80 border-purple-500/50 text-white shadow-[0_0_30px_rgba(168,85,247,0.2)]'
                            : 'bg-slate-950/30 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                        }`}
                >
                    <div className={`p-2 rounded-lg transition-colors ${provider === 'gemini' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-600 group-hover:bg-slate-800'}`}>
                        <Sparkles size={18} />
                    </div>
                    <div className="text-left">
                        <div className="text-[10px] uppercase font-bold tracking-wider opacity-50">Provider</div>
                        <div className="text-sm font-bold tracking-wide">Google Gemini</div>
                    </div>
                    {provider === 'gemini' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-400 animate-in slide-in-from-left duration-500"></div>}
                </button>
            </div>



            {/* SPLIT INPUT CARD */}
            <div className="relative group perspective-1000">
                {/* Animated Gradient Border */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 via-emerald-500 to-blue-500 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-1000 animate-border-scan"></div>

                <div className="relative flex flex-col bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-slate-800/50 shadow-2xl overflow-hidden animate-pulse-glow">

                    {/* TOP: Textarea & Submit */}
                    <div className="w-full p-2 flex flex-col relative min-h-[160px]">

                        {/* DOMAIN SELECTOR */}
                        <div className="flex justify-start gap-3 mb-4 px-2 pt-2">
                            {[
                                { id: 'environmental', label: 'Environmental', icon: <Leaf size={14} />, color: 'green' },
                                { id: 'social', label: 'Social', icon: <Users size={14} />, color: 'blue' },
                                { id: 'governance', label: 'Governance', icon: <Scale size={14} />, color: 'purple' }
                            ].map((d) => (
                                <button
                                    key={d.id}
                                    type="button"
                                    onClick={() => setDomain(d.id)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all duration-300
                                        ${domain === d.id
                                            ? `bg-${d.color}-500/10 border-${d.color}-500 text-${d.color}-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]`
                                            : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                                        }`}
                                >
                                    {d.icon} {d.label}
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={claim}
                            onChange={(e) => setClaim(e.target.value)}
                            placeholder="Paste a sustainability claim to audit (e.g., 'To achieve our net-zero goals, we are investing...')"
                            className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600 px-6 py-2 text-lg font-medium resize-none w-full mb-16"
                        />

                        <div className="absolute bottom-4 right-4 left-4 flex justify-between items-center">
                            <span className="text-[10px] font-mono text-slate-600 pl-2">
                                {claim.length > 0 ? `${claim.length} chars` : 'Ready for input'}
                            </span>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-gradient-to-br from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-green-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Analyzing...
                                    </>
                                ) : (
                                    <><Search size={16} /> Verify Claim</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* BOTTOM: Normalization Info (Horizontal Bar) */}
                    <div className="w-full border-t border-slate-800/50 bg-slate-900/30 p-4 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">

                        <div className="flex-1">
                            <h5 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1.5 flex items-center gap-1.5">
                                <Sparkles size={12} className="text-purple-400" /> AI Normalization
                            </h5>
                            <p className="text-[10px] text-slate-400 leading-relaxed opacity-80 max-w-sm">
                                Transforms vague marketing text into verifiable atomic assertions.
                            </p>
                        </div>

                        <div className="flex-1 bg-slate-900 rounded-lg p-2 px-3 border border-slate-800/50 flex items-center gap-4">
                            <div className="text-[9px] uppercase font-bold text-slate-600 whitespace-nowrap">Example</div>
                            <div className="flex items-center gap-2 font-mono text-[10px] overflow-hidden">
                                <span className="text-red-300/50 line-through decoration-red-500/30 shrink-0">"We love the planet!"</span>
                                <ArrowRight size={8} className="text-slate-600" />
                                <span className="text-green-400 truncate">"Emissions reduced by 10%"</span>
                            </div>
                        </div>

                        {/* Live Preview Toggle */}
                        <div className="w-full md:w-auto">
                            <button
                                type="button"
                                onClick={() => setShowPreview(!showPreview)}
                                className="flex items-center gap-2 text-[9px] uppercase font-bold tracking-widest text-slate-500 hover:text-green-400 transition-colors bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-800/50 hover:border-green-500/30"
                            >
                                <span>Live Preview</span>
                                {showPreview ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>
                        </div>

                    </div>

                    {/* Collapsible Preview Content (Full Width) */}
                    {showPreview && (
                        <div className="w-full border-t border-slate-800/50 bg-slate-950 p-4 animate-in slide-in-from-top-1 fade-in duration-200">
                            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/50 text-xs text-slate-400 font-mono leading-relaxed break-words">
                                {claim ? (
                                    <>
                                        <span className="text-green-500/50 mr-1">{'>'}</span>
                                        {claim}
                                        <span className="animate-pulse text-green-500 ml-1">_</span>
                                    </>
                                ) : (
                                    <span className="opacity-30">Waiting for input...</span>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </form>
    );
};

export default ClaimInput;
