import React, { useState } from 'react';

// Import Layout Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';

// Import Page Components
import Page_VerifyClaim from './components/Page_VerifyClaim';
import Page_VerificationDashboard from './components/Page_VerificationDashboard';
import Page_EvidenceLibrary from './components/Page_EvidenceLibrary';
import Page_AgentActivity from './components/Page_AgentActivity';
import Page_AuditLogs from './components/Page_AuditLogs';
import Page_TrustRisk from './components/Page_TrustRisk';
import Page_Architecture from './components/Page_Architecture';
import Page_Infrastructure from './components/Page_Infrastructure';

import BackgroundParticles from './components/BackgroundParticles';
import { Layers, ArrowRight } from 'lucide-react'; // Assuming these are imported from lucide-react

export default function App() {
  const [activePage, setActivePage] = useState('verify_claim');
  const [darkMode, setDarkMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setLoginError('');
    if (!email || !password) {
      setLoginError('Please enter your Gmail address and password.');
      return;
    }
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setLoginError('Please use a valid Gmail address (@gmail.com).');
      return;
    }
    if (password.length < 6) {
      setLoginError('Password must be at least 6 characters.');
      return;
    }
    setIsLoading(true);
    // Simulate auth
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1000);
  };

  // Router for rendering the active page
  const renderPage = () => {
    switch (activePage) {
      case 'verify_claim':
        return <Page_VerifyClaim />;
      case 'dashboard':
        return <Page_VerificationDashboard />;
      case 'evidence_library':
        return <Page_EvidenceLibrary />;
      case 'agent_activity':
        return <Page_AgentActivity />;
      case 'audit_logs':
        return <Page_AuditLogs />;
      case 'trust_risk':
        return <Page_TrustRisk />;
      case 'architecture':
        return <Page_Architecture />;
      case 'infrastructure':
        return <Page_Infrastructure />;
      default:
        return <Page_VerificationDashboard />;
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans">
        <BackgroundParticles />

        {/* Background Decor */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(34,197,94,0.1),_rgba(15,23,42,1)_70%)]"></div>

        <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="flex flex-col items-center text-center space-y-6">

            <div className="relative w-24 h-24 mb-4">
              <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse"></div>
              <Layers className="relative z-10 w-full h-full text-green-500 animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-slate-950 rounded-full flex items-center justify-center border border-slate-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-display font-bold text-white tracking-tight">Green Illusions</h1>
              <p className="text-slate-500 text-sm font-mono mt-2 tracking-widest uppercase">TrustOS Access Control</p>
            </div>

            <div className="w-full space-y-4">
              <div className="space-y-2 text-left">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Enterprise ID</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setLoginError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="admin@greenillusions.com"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/50 rounded-xl px-4 py-3 text-slate-200 font-mono text-sm transition-all placeholder:text-slate-600"
                />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Security Token</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLoginError(''); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="••••••••••••••••"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/50 rounded-xl px-4 py-3 text-slate-200 font-mono text-sm transition-all placeholder:text-slate-600"
                />
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="flex items-center gap-2 bg-red-950/40 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                  <span>⚠</span>
                  <span>{loginError}</span>
                </div>
              )}

              <p className="text-[10px] text-slate-600 text-left">
                Use your <span className="text-slate-500 font-mono">@gmail.com</span> address to sign in.
              </p>
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-900 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-green-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify Credentials</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="text-[10px] text-slate-600 max-w-xs mx-auto pt-4 border-t border-slate-800/50 w-full">
              Protected by Quantum-Resistant Encryption (AES-256-GCM)
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen font-sans ${darkMode ? 'bg-slate-950 text-slate-200 selection:bg-green-500/30' : 'bg-gray-50 text-gray-900'}`}>

      {/* GLOBAL PARTICLES BACKGROUND */}
      <BackgroundParticles />

      {/* Background Decor (Persistent across pages) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Sidebar Navigation */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={() => setIsAuthenticated(false)} />

      {/* Main Content Area */}
      <div className="flex-1 ml-72 flex flex-col z-10 relative">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="flex-1 px-12 py-10 max-w-7xl mx-auto w-full flex flex-col min-h-[calc(100vh-80px)]">
          {renderPage()}

          {/* Global Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
