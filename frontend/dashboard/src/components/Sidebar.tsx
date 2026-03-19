import React from 'react';
import { LayoutDashboard, FileText, Database, Activity, Shield, FileCheck, Server, Layers, LogOut } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onLogout: () => void;
}

const Sidebar = ({ activePage, setActivePage, onLogout }: SidebarProps) => {
  const menuGroups = [
    {
      title: "MAIN",
      items: [
        { id: 'verify_claim', label: 'Verify Claim', icon: <FileCheck size={20} /> },
        { id: 'dashboard', label: 'Verification Dashboard', icon: <LayoutDashboard size={20} /> }
      ]
    },
    {
      title: "TRANSPARENCY",
      items: [
        { id: 'evidence_library', label: 'Evidence Library', icon: <Database size={20} /> },
        { id: 'agent_activity', label: 'Agent Activity', icon: <Activity size={20} /> }
      ]
    },
    {
      title: "GOVERNANCE",
      items: [
        { id: 'audit_logs', label: 'Audit Logs', icon: <FileText size={20} /> },
        { id: 'trust_risk', label: 'Trust & Risk', icon: <Shield size={20} /> }
      ]
    },
    {
      title: "SYSTEM",
      items: [
        { id: 'architecture', label: 'Architecture', icon: <Layers size={20} /> },
        { id: 'infrastructure', label: 'Infrastructure', icon: <Server size={20} /> }
      ]
    }
  ];

  return (
    <div className="w-72 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-slate-900 h-screen fixed left-0 top-0 flex flex-col z-50 overflow-hidden">

      {/* Animated Abstract Background */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,_rgba(34,197,94,0.3),_rgba(15,23,42,0)_50%)] animate-sidebar-bg pointer-events-none"></div>

      {/* LOGO SECTION */}
      <div className="p-8 pb-4 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* SVG Logo Container */}
            <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_12s_linear_infinite] drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">
              <defs>
                <linearGradient id="globe-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" /> {/* Green-500 */}
                  <stop offset="100%" stopColor="#15803d" /> {/* Green-700 */}
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="none" stroke="url(#globe-gradient)" strokeWidth="2" strokeOpacity="0.3" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="url(#globe-gradient)" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="4 4" />
              <path d="M50 5 A45 45 0 0 1 95 50" fill="none" stroke="url(#globe-gradient)" strokeWidth="3" strokeLinecap="round" />
              <path d="M50 95 A45 45 0 0 1 5 50" fill="none" stroke="url(#globe-gradient)" strokeWidth="3" strokeLinecap="round" />

              {/* Leaf Shape */}
              <path d="M50 25 Q70 25 80 50 Q70 75 50 75 Q30 75 20 50 Q30 25 50 25 Z" fill="url(#globe-gradient)" fillOpacity="0.2" stroke="url(#globe-gradient)" strokeWidth="2" />
              <path d="M50 25 L50 75" stroke="url(#globe-gradient)" strokeWidth="2" />
              <path d="M50 40 L70 30" stroke="url(#globe-gradient)" strokeWidth="2" />
              <path d="M50 60 L30 70" stroke="url(#globe-gradient)" strokeWidth="2" />
            </svg>
            {/* Glowing Core */}
            <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
          </div>

          <div>
            <h1 className="text-xl font-display font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent leading-none tracking-widest">
              GREEN<br />ILLUSIONS
            </h1>
            <div className="text-[9px] tracking-[0.2em] text-green-500 font-bold uppercase mt-1 opacity-80">
              TrustOS V2.1
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION SECTIONS */}
      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-8">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-3">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden
                    ${activePage === item.id
                      ? 'bg-slate-800 text-white shadow-lg shadow-black/20'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`}
                >
                  {activePage === item.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-full"></div>
                  )}
                  <span className={`transition-colors ${activePage === item.id ? 'text-green-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>

                  {/* Subtle hover glow */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* USER PROFILE / LOGOUT */}
      <div className="p-4 border-t border-slate-900 bg-slate-950">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-red-950/30 hover:border-red-500/20 border border-transparent cursor-pointer transition-all group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-500 to-blue-500 border border-slate-700 shadow-lg"></div>
          <div className="flex-1 text-left">
            <div className="text-xs font-bold text-white group-hover:text-red-200">Admin User</div>
            <div className="text-[10px] text-slate-500 group-hover:text-red-300/50">Sign Out</div>
          </div>
          <LogOut size={16} className="text-slate-600 group-hover:text-red-400 transition-colors transform group-hover:rotate-180" />
        </button>
      </div>

    </div>
  );
};

export default Sidebar;
