import React from 'react';

const Header = ({ darkMode, setDarkMode }: any) => (
    <header className="bg-slate-950/50 backdrop-blur-xl sticky top-0 z-40 border-b border-white/5 px-10 py-5 flex justify-between items-center w-full">
        <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Trust Verification Dashboard</h2>
            <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-xs text-slate-400 font-medium">System Operational</p>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-full shadow-inner">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                <span className="text-xs text-blue-400 font-bold tracking-widest">DEMO MODE</span>
            </div>

            <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all hover:scale-110"
                title="Toggle Theme"
            >
                {darkMode ? '🌙' : '☀️'}
            </button>

            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-500 to-blue-600 p-[2px] shadow-lg shadow-green-500/20">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-xs font-bold text-white">
                    GI
                </div>
            </div>
        </div>
    </header>
);

export default Header;
