import React, { useState } from 'react';
import { MessageSquare, ShieldAlert, Check, ChevronDown, ChevronUp, Quote, AlertCircle, ArrowRight } from 'lucide-react';

export default function LiveTranscript({ turns = [], agents = [] }) {
  const [selectedRound, setSelectedRound] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [expandedTurns, setExpandedTurns] = useState({});

  const toggleExpand = (idx) => {
    setExpandedTurns(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const rounds = Array.from(new Set(turns.map(t => t.round_number))).sort((a, b) => a - b);

  const filteredTurns = turns.filter(turn => {
    if (selectedRound !== 'all' && turn.round_number !== parseInt(selectedRound)) return false;
    if (selectedAgent !== 'all' && turn.agent_id !== selectedAgent) return false;
    return true;
  });

  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-4 sm:p-6 shadow-xl backdrop-blur-sm">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80 mb-6">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-base text-slate-100">Deliberation Transcript</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
            {filteredTurns.length} Turns
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Round Filter */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedRound('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedRound === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Rounds
            </button>
            {rounds.map(r => (
              <button
                key={r}
                onClick={() => setSelectedRound(r.toString())}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  selectedRound === r.toString() ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                R{r}
              </button>
            ))}
          </div>

          {/* Agent Filter */}
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Agents</option>
            {agents.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Turns Stream */}
      {filteredTurns.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-sm">
          No deliberation turns match the selected filter.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTurns.map((turn, idx) => {
            const isExpanded = !!expandedTurns[idx];

            return (
              <div
                key={`${turn.agent_id}-${turn.round_number}-${idx}`}
                className="rounded-xl border border-slate-800/90 bg-slate-950/70 p-4 sm:p-5 transition-all hover:border-slate-700/80 shadow-md"
              >
                {/* Turn Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: turn.avatar_color || '#6366f1' }}
                    ></span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-100">{turn.agent_name}</span>
                        <span className="text-[11px] text-slate-400">({turn.role_title})</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono font-semibold tracking-wider text-indigo-400">
                        {turn.round_number === 0 ? 'Phase 1: Blind Thesis' : `Round ${turn.round_number}: Cross-Critique`}
                      </span>
                    </div>
                  </div>

                  {/* Confidence Badge */}
                  <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                    <span className="text-slate-400 text-[11px]">Confidence:</span>
                    <span className="font-bold text-indigo-400">{turn.confidence_score}%</span>
                  </div>
                </div>

                {/* Thesis Card */}
                <div className="rounded-lg bg-indigo-950/20 border border-indigo-500/20 p-3 sm:p-3.5 mb-3 flex items-start space-x-2.5">
                  <Quote className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-medium text-indigo-100 leading-relaxed italic">
                    "{turn.thesis}"
                  </p>
                </div>

                {/* Key Arguments */}
                {turn.key_arguments && turn.key_arguments.length > 0 && (
                  <div className="mb-3">
                    <h5 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Core Supporting Pillars:
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {turn.key_arguments.map((arg, aIdx) => (
                        <li key={aIdx} className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0"></span>
                          <span className="leading-relaxed">{arg}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Critiques Section */}
                {turn.critiques && turn.critiques.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2.5">
                    <h5 className="text-[11px] font-semibold uppercase tracking-wider text-rose-400 flex items-center space-x-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Rebuttals & Fallacy Flags:</span>
                    </h5>
                    {turn.critiques.map((c, cIdx) => (
                      <div key={cIdx} className="rounded-lg bg-rose-950/15 border border-rose-500/20 p-3 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                          <span className="font-semibold text-rose-300">
                            Critique vs. {c.target_agent_name}:
                          </span>
                          {c.fallacies_identified && c.fallacies_identified.map((f, fIdx) => (
                            <span key={fIdx} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              {f}
                            </span>
                          ))}
                        </div>
                        <p className="text-slate-300 leading-relaxed mb-1">{c.critique_summary}</p>
                        <p className="text-slate-400 italic text-[11px]">{c.rebuttal_text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Concessions Section */}
                {turn.concessions && turn.concessions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80">
                    <h5 className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center space-x-1 mb-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Concessions & Calibrations:</span>
                    </h5>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {turn.concessions.map((conc, concIdx) => (
                        <li key={concIdx} className="flex items-start space-x-2 text-emerald-200/90">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                          <span>{conc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Expand Full Reasoning */}
                {turn.full_reasoning && (
                  <div className="mt-3 pt-2">
                    <button
                      onClick={() => toggleExpand(idx)}
                      className="flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      <span>{isExpanded ? 'Hide Full Reasoning' : 'View Full Deliberation Reasoning'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    {isExpanded && (
                      <p className="mt-2 text-xs text-slate-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800 leading-relaxed whitespace-pre-line font-sans">
                        {turn.full_reasoning}
                      </p>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
