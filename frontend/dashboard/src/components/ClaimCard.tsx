import React from 'react';

interface ClaimCardProps {
  result: any;
}

const ClaimCard = ({ result }: ClaimCardProps) => {
  if (!result) return null;

  return (
    <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 animate-in fade-in slide-in-from-right-8 duration-700">
      <h3 className="text-lg font-bold text-white mb-4">Claim Metadata</h3>
      <div className="space-y-4">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Normalized Claim</div>
          <p className="text-sm text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed italic">
            "{result.claim}"
          </p>
        </div>
        <div className="flex gap-4 pt-2">
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Date</div>
            <div className="text-sm text-white font-mono">{new Date().toLocaleDateString()}</div>
          </div>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">ID</div>
            <div className="text-sm text-white font-mono">#REQ-{Math.floor(Math.random() * 10000)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimCard;
