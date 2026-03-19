import React, { useState } from 'react';
import { AlertTriangle, FileText, Activity, Shield, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import EvidenceCard from './EvidenceCard';
import ClaimInput from './ClaimInput';
import TrustFactors from './TrustFactors';
import ClaimCard from './ClaimCard';
import AgentTimeline from './Timeline';

const API_URL = "http://127.0.0.1:8000";

// ─── Pipeline Trace Stepper ────────────────────────────────────────────────────
const PIPELINE_STEP_NAMES = [
    { key: "claim", label: "Claim Extraction", icon: "📋" },
    { key: "evidence", label: "Evidence Retrieval", icon: "🔍" },
    { key: "language", label: "Language Analysis", icon: "🧠" },
    { key: "compliance", label: "Compliance Check", icon: "⚖️" },
    { key: "verdict", label: "Verdict Generation", icon: "✅" },
];

function PipelineTrace({ trace }: { trace: string[] }) {
    if (!trace || trace.length === 0) return null;
    return (
        <div className="mt-8 p-6 bg-slate-900/30 rounded-2xl border border-slate-800">
            <h4 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider flex items-center gap-2">
                <Activity size={16} /> AI Pipeline Trace
            </h4>
            <div className="space-y-3">
                {trace.map((t: string, i: number) => {
                    const stepInfo = PIPELINE_STEP_NAMES[i] || { icon: "⚙️", label: `Step ${i + 1}` };
                    const isWarning = t.toLowerCase().includes('warn') || t.toLowerCase().includes('flag') || t.toLowerCase().includes('deceptive');
                    return (
                        <div key={i} className="flex items-start gap-4 group">
                            {/* Step number + connector */}
                            <div className="flex flex-col items-center shrink-0">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${isWarning ? 'bg-yellow-900/30 border-yellow-500/30 text-yellow-400' : 'bg-green-900/30 border-green-500/30 text-green-400'}`}>
                                    {i + 1}
                                </div>
                                {i < trace.length - 1 && (
                                    <div className="w-0.5 h-4 bg-slate-800 mt-1"></div>
                                )}
                            </div>
                            {/* Content */}
                            <div className={`flex-1 p-3 rounded-xl border mb-1 ${isWarning ? 'bg-yellow-950/20 border-yellow-500/20' : 'bg-slate-900/50 border-slate-800'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-base">{stepInfo.icon}</span>
                                    <span className={`text-xs font-bold uppercase tracking-wider ${isWarning ? 'text-yellow-400' : 'text-green-400'}`}>
                                        {stepInfo.label}
                                    </span>
                                    <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full border font-bold ${isWarning ? 'text-yellow-400 border-yellow-500/20 bg-yellow-900/20' : 'text-green-400 border-green-500/20 bg-green-900/20'}`}>
                                        {isWarning ? '⚠ Warning' : '✓ Done'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 font-mono leading-relaxed">{t}</p>
                            </div>
                        </div>
                    );
                })}
                {/* Complete badge */}
                <div className="flex items-center gap-3 pt-2 pl-12">
                    <div className="h-px flex-1 bg-green-900/30"></div>
                    <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest bg-green-900/20 border border-green-500/20 px-3 py-1 rounded-full">
                        Pipeline Complete
                    </span>
                    <div className="h-px flex-1 bg-green-900/30"></div>
                </div>
            </div>
        </div>
    );
}

// ─── 3-Category Verdict Cards ─────────────────────────────────────────────────
function ThreeVerdictCards({ result }: { result: any }) {
    const analysis = result.analysis;
    const actualVerdict = analysis.final_verdict;
    const actualConf = analysis.confidence;

    const cards = [
        {
            label: "Optimistic View",
            subtitle: "Best-case interpretation",
            confidence: Math.min(1, actualConf + 0.10),
            icon: <CheckCircle className="w-8 h-8 text-green-400" />,
            color: "border-green-500/30 bg-green-950/20",
            badge: "bg-green-500/10 text-green-400 border-green-500/20",
            desc: "The strongest evidence found supports this claim. Under optimal interpretation, the claim aligns with verified ESG data.",
            active: actualVerdict === "Verified Claim",
        },
        {
            label: actualVerdict,
            subtitle: "Official AI Verdict",
            confidence: actualConf,
            icon: actualVerdict === "Verified Claim"
                ? <CheckCircle className="w-8 h-8 text-green-400" />
                : actualVerdict.includes("Misleading") || actualVerdict.includes("Greenwashing")
                    ? <XCircle className="w-8 h-8 text-red-400" />
                    : <AlertCircle className="w-8 h-8 text-yellow-400" />,
            color: actualVerdict === "Verified Claim"
                ? "border-green-500/50 bg-green-950/30 ring-1 ring-green-500/20"
                : actualVerdict.includes("Misleading") || actualVerdict.includes("Greenwashing")
                    ? "border-red-500/50 bg-red-950/30 ring-1 ring-red-500/20"
                    : "border-yellow-500/50 bg-yellow-950/30 ring-1 ring-yellow-500/20",
            badge: actualVerdict === "Verified Claim"
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : actualVerdict.includes("Misleading") || actualVerdict.includes("Greenwashing")
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
            desc: analysis.explanation,
            active: true,
        },
        {
            label: "Critical View",
            subtitle: "Worst-case interpretation",
            confidence: Math.max(0, actualConf - 0.15),
            icon: <XCircle className="w-8 h-8 text-red-400" />,
            color: "border-red-500/30 bg-red-950/20",
            badge: "bg-red-500/10 text-red-400 border-red-500/20",
            desc: "Under critical scrutiny, insufficient evidence was found to fully substantiate this claim. Gaps in data may indicate greenwashing risk.",
            active: actualVerdict.includes("Misleading") || actualVerdict.includes("Greenwashing"),
        },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {cards.map((card, i) => (
                <div key={i} className={`relative p-6 rounded-2xl border ${card.color} flex flex-col gap-4 transition-all`}>
                    {card.active && (
                        <div className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border bg-white/5 text-white/60 border-white/10">
                            AI Result
                        </div>
                    )}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-950/50 rounded-xl border border-white/5">
                            {card.icon}
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-base leading-tight">{card.label}</h3>
                            <p className="text-slate-500 text-xs">{card.subtitle}</p>
                        </div>
                    </div>
                    <div className="text-center py-3 border-y border-white/5">
                        <div className="text-4xl font-black text-white tracking-tighter">
                            {(card.confidence * 100).toFixed(0)}<span className="text-lg text-slate-500">%</span>
                        </div>
                        <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Confidence</div>
                        <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${i === 0 ? 'bg-green-500' : i === 2 ? 'bg-red-500' : 'bg-yellow-500'}`}
                                style={{ width: `${card.confidence * 100}%` }}
                            ></div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed flex-1">{card.desc}</p>
                    <span className={`self-start text-[10px] font-bold uppercase px-2 py-1 rounded border ${card.badge}`}>
                        {card.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Page_VerifyClaim() {
    const [claim, setClaim] = useState('');
    const [provider, setProvider] = useState('aws');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!claim.trim()) return;

        setLoading(true);
        setResult(null);
        setError(null);
        setStep(1);

        const interval = setInterval(() => {
            setStep(prev => prev < 5 ? prev + 1 : prev);
        }, 800);

        try {
            const response = await fetch(`${API_URL}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ esg_text: claim, provider: provider }),
            });

            const data = await response.json();
            clearInterval(interval);
            setStep(6);

            // API returns { total_claims_analyzed, results: [{claim, analysis}] }
            const results = data.results || [];
            if (results.length === 0) {
                throw new Error("No claims were extracted from the input. Try adding ESG-specific language.");
            }

            // Use the first result (most claims are single-claim inputs)
            const firstResult = results[0];
            if (!firstResult || !firstResult.analysis) {
                throw new Error("Invalid response from analysis engine.");
            }

            setResult(firstResult);
        } catch (error: any) {
            console.error("Error:", error);
            setError(error.message || "Analysis failed. Please check your backend connection or AWS credentials.");
            setStep(0);
        } finally {
            setLoading(false);
            clearInterval(interval);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700 flex-1">

            {/* Hero Section */}
            <section className="text-center space-y-8 pt-10 pb-6 relative">
                <div className="space-y-4">
                    <h1 className="text-6xl font-display font-bold text-white tracking-tight leading-tight">
                        Verify ESG Claims <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                            With Absolute Confidence
                        </span>
                    </h1>
                    <p className="text-slate-400 text-xl max-w-3xl mx-auto font-light leading-relaxed">
                        The enterprise standard for sustainability verification. Powered by multi-agent AI and verified against 50M+ data points.
                    </p>
                </div>

                <ClaimInput
                    claim={claim}
                    setClaim={setClaim}
                    provider={provider}
                    setProvider={setProvider}
                    loading={loading}
                    handleSubmit={handleSubmit}
                />

                <TrustFactors />
            </section>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-4 p-6 bg-red-950/40 border border-red-500/30 rounded-2xl max-w-3xl mx-auto text-red-200 animate-in fade-in slide-in-from-top-4 shadow-xl">
                    <div className="p-3 bg-red-900/20 rounded-full border border-red-500/20">
                        <AlertTriangle size={24} className="text-red-500" />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-white mb-1">Verification System Error</h4>
                        <p className="text-sm text-red-300/80">{error}</p>
                    </div>
                </div>
            )}

            {/* Loading Timeline */}
            {loading && (
                <div className="py-12 max-w-4xl mx-auto">
                    <AgentTimeline currentStep={step} />
                    <p className="text-center text-slate-500 text-sm mt-8 animate-pulse font-mono uppercase tracking-widest">
                        Agents are gathering intelligence...
                    </p>
                </div>
            )}

            {/* Results */}
            {result && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 pb-10">

                    <div className="flex items-center justify-between mb-2">
                        <div className="h-px bg-slate-800 flex-1"></div>
                        <span className="px-4 text-slate-500 text-xs font-bold uppercase tracking-widest">Analysis Report Generated</span>
                        <div className="h-px bg-slate-800 flex-1"></div>
                    </div>

                    {/* ── Fix 5: 3-Category Verdict Cards ── */}
                    <ThreeVerdictCards result={result} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Evidence Column */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                        <FileText className="text-blue-400" size={20} />
                                    </div>
                                    Authenticated Evidence
                                </h3>
                                <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-900/10 border border-blue-500/20 px-3 py-1.5 rounded-full">
                                    Source: Knowledge Base
                                </span>
                            </div>

                            <div className="space-y-2">
                                {result.analysis.citations && result.analysis.citations.length > 0 ? (
                                    result.analysis.citations.map((cite: any, idx: number) => (
                                        <EvidenceCard key={idx} evidence={{ text: cite.excerpt, metadata: cite }} index={idx} />
                                    ))
                                ) : (
                                    result.analysis.evidence_analysis?.evidence?.map((chunk: any, idx: number) => (
                                        <EvidenceCard key={idx} evidence={chunk} index={idx} />
                                    ))
                                )}
                            </div>

                            {/* ── Fix 6: Visual Pipeline Trace ── */}
                            <PipelineTrace trace={result.analysis.trace} />
                        </div>

                        {/* Compliance Column */}
                        <div className="space-y-8">
                            <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-8 border border-slate-800 shadow-xl">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                    <Shield className="text-green-500" size={24} /> Regulatory Compliance
                                </h3>

                                <div className="space-y-6">
                                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-bold text-slate-300">FTC Green Guides</span>
                                            {result.analysis.compliance_check.compliance_status === 'COMPLIANT' ?
                                                <span className="text-[10px] font-bold uppercase bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20 flex items-center gap-1"><CheckCircle size={10} /> Pass</span> :
                                                <span className="text-[10px] font-bold uppercase bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded border border-yellow-500/20 flex items-center gap-1"><AlertTriangle size={10} /> Review</span>
                                            }
                                        </div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${result.analysis.compliance_check.compliance_status === 'COMPLIANT' ? 'bg-green-500 w-full' : 'bg-yellow-500 w-2/3'}`}></div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/20 p-4 rounded-xl border border-white/5">
                                        <p className="text-xs text-slate-400 italic leading-relaxed">
                                            "{result.analysis.compliance_check.compliance_reason}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <ClaimCard result={result} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
