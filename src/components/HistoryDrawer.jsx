import React from 'react';
import { X, History, Trash2, ArrowUpRight, Award, Calendar } from 'lucide-react';

export default function HistoryDrawer({ isOpen, onClose, debates = [], onSelectDebate, onDeleteDebate, selectedId }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <History className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-base text-white">Debate Archive</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {debates.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-xs">
                No past debates recorded yet. Start a new debate to build your consensus archive!
              </div>
            ) : (
              debates.map((d) => {
                const isSelected = selectedId === d.id;
                const formattedDate = new Date(d.created_at).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={d.id}
                    className={`rounded-xl border p-4 transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-indigo-500/80 shadow-md'
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{formattedDate}</span>
                      </span>

                      {d.consensus_score !== null && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                          {d.consensus_score}% Score
                        </span>
                      )}
                    </div>

                    <h4 className="font-semibold text-xs text-slate-200 line-clamp-2 mb-3 leading-snug">
                      {d.topic}
                    </h4>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/70 text-[11px]">
                      <button
                        onClick={() => {
                          onSelectDebate(d.id);
                          onClose();
                        }}
                        className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        <span>Open Deliberation</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDebate(d.id);
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
