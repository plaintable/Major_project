import React from 'react';
import { Bot, Cpu, Sparkles, Brain, CheckCircle2, Loader2, ArrowUpRight } from 'lucide-react';

export default function AgentPanel({ agents = [], activeThinkingAgent, turns = [] }) {
  // Get latest confidence for each agent
  const getLatestConfidence = (agentId) => {
    const agentTurns = turns.filter(t => t.agent_id === agentId);
    if (!agentTurns.length) return null;
    return agentTurns[agentTurns.length - 1].confidence_score;
  };

  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-4 sm:p-5 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-indigo-400" />
          <h2 className="font-bold text-sm sm:text-base text-slate-100">Deliberation Panel</h2>
        </div>
        <span className="text-xs text-slate-400 font-medium px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700/60">
          {agents.length} Models Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {agents.map((agent) => {
          const isThinking = activeThinkingAgent === agent.name;
          const conf = getLatestConfidence(agent.id);
          const hasSpoken = turns.some(t => t.agent_id === agent.id);

          return (
            <div
              key={agent.id}
              className={`relative rounded-xl p-3.5 sm:p-4 border transition-all duration-300 ${
                isThinking
                  ? 'bg-slate-800/90 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-[1.02]'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Agent Status Pill */}
              <div className="flex items-center justify-between mb-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: agent.avatar_color || '#6366f1' }}
                ></span>

                {isThinking ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 animate-pulse">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    <span>Deliberating...</span>
                  </span>
                ) : hasSpoken ? (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Analyzed</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-slate-500 px-2 py-0.5 rounded-full bg-slate-800/50">
                    Waiting
                  </span>
                )}
              </div>

              {/* Agent Name & Title */}
              <h3 className="font-semibold text-sm text-slate-100 truncate">{agent.name}</h3>
              <p className="text-xs text-slate-400 truncate mt-0.5">{agent.role_title}</p>

              {/* Provider & Model badge */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2.5 border-t border-slate-800/70">
                <span className="capitalize px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                  {agent.provider}
                </span>

                {conf !== null ? (
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] text-slate-400">Confidence:</span>
                    <span className="font-bold text-slate-200">{conf}%</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-500">Uncalibrated</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
