import React from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const Page_TrustRisk = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Trust & Risk Assessment</h2>
                <p className="text-slate-400">AI Governance metrics and risk mitigation strategies.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Confidence Distribution */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Shield className="text-green-500" /> Confidence Distribution
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-slate-400">
                                <span>High Confidence (&gt;90%)</span>
                                <span>85%</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[85%]"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-slate-400">
                                <span>Medium Confidence (70-90%)</span>
                                <span>12%</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-500 w-[12%]"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-slate-400">
                                <span>Low Confidence (&lt;70%)</span>
                                <span>3%</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500 w-[3%]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Risk Indicators */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <AlertTriangle className="text-orange-500" /> Risk Indicators
                    </h3>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16} />
                            <div>
                                <div className="text-sm font-bold text-red-200">Hallucination Risk</div>
                                <div className="text-xs text-red-300/70">Low probability (0.4%) detected in recent batches.</div>
                            </div>
                        </li>
                        <li className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={16} />
                            <div>
                                <div className="text-sm font-bold text-green-200">Bias Mitigation</div>
                                <div className="text-xs text-green-300/70">Active filters applied for corporate greenwashing patterns.</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Page_TrustRisk;
