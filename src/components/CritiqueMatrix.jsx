import React from 'react';
import { GitPullRequest, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function CritiqueMatrix({ turns = [], agents = [] }) {
  // Collect all critiques from all turns
  const allCritiques = [];
  turns.forEach(t => {
    (t.critiques || []).forEach(c => {
      allCritiques.push({
        sourceAgentName: t.agent_name,
        sourceColor: t.avatar_color,
        round: t.round_number,
        ...c
      });
    });
  });

  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-4 sm:p-6 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <GitPullRequest className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-base text-slate-100">Cross-Examination & Fallacy Matrix</h3>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
          {allCritiques.length} Rebuttals Leveled
        </span>
      </div>

      {allCritiques.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs sm:text-sm">
          No peer critiques recorded yet. Critiques appear starting in Round 1.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {allCritiques.map((crit, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 hover:border-slate-700 transition-colors"
            >
              {/* Interaction Header */}
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center space-x-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: crit.sourceColor || '#6366f1' }}
                  ></span>
                  <span className="font-semibold text-slate-200">{crit.sourceAgentName}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-semibold text-rose-300">{crit.target_agent_name}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  R{crit.round}
                </span>
              </div>

              {/* Identified Fallacies */}
              {crit.fallacies_identified && crit.fallacies_identified.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {crit.fallacies_identified.map((fallacy, fIdx) => (
                    <span
                      key={fIdx}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30"
                    >
                      {fallacy}
                    </span>
                  ))}
                </div>
              )}

              {/* Critique Summary */}
              <p className="text-xs text-slate-300 leading-relaxed mb-2 font-medium">
                {crit.critique_summary}
              </p>

              {/* Rebuttal Text */}
              <p className="text-[11px] text-slate-400 leading-relaxed italic bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/60">
                "{crit.rebuttal_text}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
