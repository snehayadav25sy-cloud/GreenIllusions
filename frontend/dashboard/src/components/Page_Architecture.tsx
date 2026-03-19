import React from 'react';

const PIPELINE_STEPS = [
    { label: "User Claim Input", color: "bg-slate-700", dot: "bg-slate-400" },
    { label: "Claims Extraction Agent", color: "bg-blue-900/40", dot: "bg-blue-400" },
    { label: "Evidence Retrieval (RAG)", color: "bg-cyan-900/40", dot: "bg-cyan-400" },
    { label: "Language Deception Check", color: "bg-yellow-900/40", dot: "bg-yellow-400" },
    { label: "Compliance Agent", color: "bg-orange-900/40", dot: "bg-orange-400" },
    { label: "Verdict Agent", color: "bg-purple-900/40", dot: "bg-purple-400" },
    { label: "Final Result", color: "bg-green-900/40", dot: "bg-green-400" },
];

const AGENT_DESCRIPTIONS: Record<string, string> = {
    "User Claim Input": "ESG claim text submitted by the user for verification.",
    "Claims Extraction Agent": "Parses the raw text into discrete, verifiable ESG claims.",
    "Evidence Retrieval (RAG)": "Searches the local knowledge base for supporting evidence chunks.",
    "Language Deception Check": "Detects vague, misleading, or greenwashing language patterns.",
    "Compliance Agent": "Checks the claim against FTC Green Guides & regulatory standards.",
    "Verdict Agent": "Synthesises all signals into a final verdict with confidence score.",
    "Final Result": "Structured JSON result returned to the dashboard.",
};

const Page_Architecture = () => {
    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div>
                <h2 className="text-4xl font-display font-bold text-white mb-2">System Architecture</h2>
                <p className="text-slate-400">Multi-Agent RAG Pipeline — how every ESG claim is verified end-to-end.</p>
            </div>

            {/* Pipeline Flow */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-8">Verification Pipeline</h3>

                <div className="flex flex-col gap-0">
                    {PIPELINE_STEPS.map((step, i) => (
                        <div key={i} className="flex items-stretch gap-6">
                            {/* Connector column */}
                            <div className="flex flex-col items-center w-8 shrink-0">
                                <div className={`w-4 h-4 rounded-full border-2 border-slate-700 ${step.dot} shadow-lg shrink-0 mt-5`}></div>
                                {i < PIPELINE_STEPS.length - 1 && (
                                    <div className="w-0.5 flex-1 bg-gradient-to-b from-slate-600 to-slate-800 my-1"></div>
                                )}
                            </div>

                            {/* Card */}
                            <div className={`flex-1 mb-3 p-5 rounded-2xl border border-slate-800 ${step.color} flex items-center justify-between group hover:border-slate-600 transition-all`}>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-[10px] font-bold text-slate-500 font-mono">STEP {String(i + 1).padStart(2, '0')}</span>
                                    </div>
                                    <h4 className="text-white font-bold text-lg">{step.label}</h4>
                                    <p className="text-slate-400 text-sm mt-1">{AGENT_DESCRIPTIONS[step.label]}</p>
                                </div>
                                {i < PIPELINE_STEPS.length - 1 && (
                                    <div className="text-slate-600 text-2xl font-light ml-4 shrink-0">↓</div>
                                )}
                                {i === PIPELINE_STEPS.length - 1 && (
                                    <div className="text-green-400 text-2xl ml-4 shrink-0">✓</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tech Stack */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Backend", value: "FastAPI + Uvicorn", color: "text-blue-400" },
                    { label: "AI Engine", value: "IBM WatsonX / AWS Bedrock", color: "text-purple-400" },
                    { label: "RAG Store", value: "Local FAISS Index", color: "text-cyan-400" },
                    { label: "Frontend", value: "React + TypeScript", color: "text-green-400" },
                ].map((item, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
                        <div className={`text-sm font-bold mb-1 ${item.color}`}>{item.label}</div>
                        <div className="text-white font-medium text-sm">{item.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Page_Architecture;
