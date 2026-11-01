import React, { useState } from 'react';
import { Award, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert, Download, Copy, Check, FileText } from 'lucide-react';

export default function ConsensusReportView({ consensus, topic, context, agents = [], turns = [] }) {
  const [copied, setCopied] = useState(false);

  if (!consensus) return null;

  const handleCopyMarkdown = () => {
    let md = `# Formal Consensus Report: ${topic}\n\n`;
    if (context) md += `**Context:** ${context}\n\n`;
    md += `**Overall Consensus Score:** ${consensus.overall_consensus_score}%\n\n`;
    md += `## Executive Verdict\n${consensus.executive_verdict}\n\n`;
    
    md += `## Unanimous Agreements\n`;
    (consensus.unanimous_agreements || []).forEach(item => {
      md += `- ${item}\n`;
    });
    md += `\n`;

    md += `## Irreconcilable Divergent Trade-offs\n`;
    (consensus.divergent_points || []).forEach(item => {
      md += `- ${item}\n`;
    });
    md += `\n`;

    md += `## Actionable Next Steps\n`;
    (consensus.actionable_recommendations || []).forEach((item, idx) => {
      md += `${idx + 1}. ${item}\n`;
    });
    md += `\n`;

    if (consensus.minority_dissent) {
      md += `## Minority Dissent & Risk Warning\n${consensus.minority_dissent}\n\n`;
    }

    md += `## Deliberation Convergence\n${consensus.convergence_summary}\n`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      topic,
      context,
      consensus,
      turns
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `consensus-report-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-gradient-to-b from-indigo-950/40 via-slate-900/80 to-slate-950 rounded-2xl border-2 border-indigo-500/40 p-5 sm:p-7 shadow-2xl backdrop-blur-md">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-indigo-500/20 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-white">Synthesized Consensus Verdict</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {consensus.overall_consensus_score}% Consensus
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Objective Multi-Model Synthesis & Bayesian Convergence</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied MD!' : 'Copy Report'}</span>
          </button>
          <button
            onClick={handleDownloadJSON}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Executive Verdict Banner */}
      <div className="rounded-xl bg-indigo-900/30 border border-indigo-500/30 p-4 sm:p-5 mb-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
          Executive Ruling
        </span>
        <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
          {consensus.executive_verdict}
        </p>
      </div>

      {/* Grid: Agreements & Divergences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        
        {/* Unanimous Agreements */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 sm:p-5">
          <div className="flex items-center space-x-2 text-emerald-400 mb-3">
            <CheckCircle2 className="w-5 h-5" />
            <h4 className="font-bold text-sm text-slate-100">Unanimous Agreed Truths</h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {(consensus.unanimous_agreements || []).map((point, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Irreducible Divergences */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 sm:p-5">
          <div className="flex items-center space-x-2 text-amber-400 mb-3">
            <AlertTriangle className="w-5 h-5" />
            <h4 className="font-bold text-sm text-slate-100">Contested Trade-offs</h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {(consensus.divergent_points || []).map((point, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Actionable Next Steps */}
      <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 sm:p-5 mb-6">
        <h4 className="font-bold text-sm text-slate-100 mb-3 flex items-center space-x-2">
          <ArrowRight className="w-4 h-4 text-indigo-400" />
          <span>Recommended Actionable Steps</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(consensus.actionable_recommendations || []).map((rec, idx) => (
            <div key={idx} className="rounded-lg bg-slate-950/80 border border-slate-800/80 p-3 text-xs flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                {idx + 1}
              </span>
              <span className="text-slate-300 leading-relaxed">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Minority Dissent / Risk Warning */}
      {consensus.minority_dissent && (
        <div className="rounded-xl bg-rose-950/20 border border-rose-500/30 p-4 sm:p-5">
          <div className="flex items-center space-x-2 text-rose-400 mb-2">
            <ShieldAlert className="w-4 h-4" />
            <h4 className="font-bold text-xs uppercase tracking-wider">Minority Dissent & Contrarian Warning</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed italic">
            "{consensus.minority_dissent}"
          </p>
        </div>
      )}

    </div>
  );
}
