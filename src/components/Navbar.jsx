import React from 'react';
import { Scale, PlusCircle, History, Settings, Sparkles, ShieldCheck } from 'lucide-react';

export default function Navbar({ onNewDebate, onOpenHistory, onOpenSettings, isDebating, activeTopic }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
                ConsensusAI
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Multi-LLM
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Deliberative Multi-Agent Decision Platform</p>
          </div>
        </div>

        {/* Center: Active Topic Banner if debating */}
        {activeTopic && (
          <div className="hidden md:flex items-center space-x-2 max-w-md px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 truncate">
            <span className={`w-2 h-2 rounded-full ${isDebating ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
            <span className="truncate">{activeTopic}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenHistory}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700"
            title="Debate Archive & Past Sessions"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Archive</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700"
            title="Configure API Keys & Providers"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          <button
            onClick={onNewDebate}
            disabled={isDebating}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-md ${
              isDebating
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-indigo-500/20 hover:shadow-indigo-500/30'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Debate</span>
          </button>
        </div>

      </div>
    </header>
  );
}
