import React from 'react';
import { Target, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ConvergenceMeter({ consensus, currentRound, maxRounds, turns = [] }) {
  const score = consensus ? consensus.overall_consensus_score : null;

  // Compute live average confidence from the latest round if consensus is not ready yet
  const latestRoundTurns = turns.filter(t => t.round_number === currentRound);
  const liveAvgConfidence = latestRoundTurns.length
    ? Math.round(latestRoundTurns.reduce((acc, t) => acc + t.confidence_score, 0) / latestRoundTurns.length)
    : null;

  const displayScore = score !== null ? score : (liveAvgConfidence !== null ? liveAvgConfidence : 50);

  const getColor = (s) => {
    if (s >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (s >= 65) return 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10';
    if (s >= 50) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const getLabel = (s) => {
    if (s >= 85) return 'High Consensus';
    if (s >= 70) return 'Substantial Convergence';
    if (s >= 55) return 'Moderate Deliberation';
    return 'Polarized / Divergent';
  };

  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-4 sm:p-5 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-sm sm:text-base text-slate-100">Consensus Convergence</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Round {currentRound + 1} of {maxRounds}
        </span>
      </div>

      <div className="flex items-center space-x-4 mt-2">
        {/* Score Ring / Pill */}
        <div className={`px-4 py-2.5 rounded-xl border flex flex-col items-center justify-center ${getColor(displayScore)}`}>
          <span className="text-2xl sm:text-3xl font-black tracking-tight">{displayScore}%</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider mt-0.5">
            {score !== null ? 'Final Score' : 'Convergence Index'}
          </span>
        </div>

        {/* Progress Bar & Status */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-300">{getLabel(displayScore)}</span>
            <span className="text-slate-400 text-[11px]">
              {score !== null ? 'Deliberation Complete' : 'Iterating arguments...'}
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700/50">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                displayScore >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                displayScore >= 65 ? 'bg-gradient-to-r from-indigo-500 to-cyan-400' :
                displayScore >= 50 ? 'bg-gradient-to-r from-amber-500 to-orange-400' :
                'bg-gradient-to-r from-rose-500 to-red-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, displayScore))}%` }}
            ></div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            {consensus
              ? consensus.convergence_summary || 'Panel has converged upon an actionable synthesis.'
              : 'Models are cross-critiquing premises and recalibrating confidence to eliminate cognitive bias.'}
          </p>
        </div>
      </div>
    </div>
  );
}
