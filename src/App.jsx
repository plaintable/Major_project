import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AgentPanel from './components/AgentPanel';
import ConvergenceMeter from './components/ConvergenceMeter';
import LiveTranscript from './components/LiveTranscript';
import CritiqueMatrix from './components/CritiqueMatrix';
import ConsensusReportView from './components/ConsensusReportView';
import NewDebateModal from './components/NewDebateModal';
import SettingsModal from './components/SettingsModal';
import HistoryDrawer from './components/HistoryDrawer';
import {
  fetchPresets,
  fetchPersonas,
  fetchDebates,
  fetchDebate,
  deleteDebate,
  startDebate,
  connectDebateStream
} from './services/api';
import { Scale, Sparkles, MessageSquare, GitPullRequest, Award, ArrowRight, Play, CheckCircle } from 'lucide-react';

export default function App() {
  const [presets, setPresets] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [historyList, setHistoryList] = useState([]);
  
  const [currentSession, setCurrentSession] = useState(null);
  const [isDebating, setIsDebating] = useState(false);
  const [activeThinkingAgent, setActiveThinkingAgent] = useState(null);
  const [activeTab, setActiveTab] = useState('transcript'); // 'transcript' | 'matrix' | 'consensus'
  
  // Modals
  const [isNewDebateOpen, setIsNewDebateOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [presetsData, personasData, debatesData] = await Promise.all([
        fetchPresets(),
        fetchPersonas(),
        fetchDebates()
      ]);
      setPresets(presetsData);
      setPersonas(personasData);
      setHistoryList(debatesData);

      // If past debates exist, load the latest one
      if (debatesData && debatesData.length > 0) {
        const latest = await fetchDebate(debatesData[0].id);
        setCurrentSession(latest);
        if (latest.consensus) {
          setActiveTab('consensus');
        }
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  const handleStartDebate = async (requestData) => {
    setIsNewDebateOpen(false);
    setIsDebating(true);
    setActiveThinkingAgent(null);

    // Initial temporary session for instant UI feedback
    const tempSession = {
      id: 'pending',
      topic: requestData.topic,
      context: requestData.context,
      max_rounds: requestData.max_rounds,
      agents: requestData.agents,
      turns: [],
      consensus: null,
      status: 'running',
      current_round: 0
    };
    setCurrentSession(tempSession);
    setActiveTab('transcript');

    try {
      const { session_id } = await startDebate(requestData);
      tempSession.id = session_id;
      setCurrentSession({ ...tempSession });

      // Connect to Server-Sent Events stream
      connectDebateStream(
        session_id,
        (event) => {
          if (event.type === 'debate_started') {
            setCurrentSession(prev => ({ ...prev, id: event.session_id }));
          } else if (event.type === 'round_started') {
            setCurrentSession(prev => ({ ...prev, current_round: event.round_number }));
          } else if (event.type === 'agent_thinking') {
            setActiveThinkingAgent(event.agent_name);
          } else if (event.type === 'agent_spoke') {
            setActiveThinkingAgent(null);
            setCurrentSession(prev => {
              if (!prev) return prev;
              const exists = prev.turns.some(
                t => t.agent_id === event.turn.agent_id && t.round_number === event.turn.round_number
              );
              if (exists) return prev;
              return { ...prev, turns: [...prev.turns, event.turn] };
            });
          } else if (event.type === 'synthesizing_consensus') {
            setActiveThinkingAgent('Chief Moderator (Synthesizing)');
          } else if (event.type === 'consensus_reached') {
            setActiveThinkingAgent(null);
            setIsDebating(false);
            setCurrentSession(event.session);
            setActiveTab('consensus');
            // Refresh history
            fetchDebates().then(setHistoryList).catch(console.error);
          }
        },
        (error) => {
          console.error('Debate streaming error:', error);
          setIsDebating(false);
          setActiveThinkingAgent(null);
        },
        () => {
          setIsDebating(false);
          setActiveThinkingAgent(null);
        }
      );
    } catch (err) {
      console.error('Failed to start debate:', err);
      setIsDebating(false);
      setActiveThinkingAgent(null);
      alert(`Error starting debate: ${err.message}`);
    }
  };

  const handleSelectDebate = async (id) => {
    try {
      const session = await fetchDebate(id);
      setCurrentSession(session);
      setActiveTab(session.consensus ? 'consensus' : 'transcript');
    } catch (err) {
      console.error('Failed to load debate:', err);
    }
  };

  const handleDeleteDebate = async (id) => {
    try {
      await deleteDebate(id);
      setHistoryList(prev => prev.filter(d => d.id !== id));
      if (currentSession && currentSession.id === id) {
        setCurrentSession(null);
      }
    } catch (err) {
      console.error('Failed to delete debate:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        onNewDebate={() => setIsNewDebateOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isDebating={isDebating}
        activeTopic={currentSession?.topic}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* If no active session, show Hero Banner & Quick Starter Presets */}
        {!currentSession ? (
          <div className="py-12 sm:py-20 max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Model Adversarial Deliberation</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Smarter Decisions Through{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                Structured Multi-LLM Debate
              </span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Eliminate hallucinations, single-model bias, and overconfidence. Deploy a panel of specialized AI agents that independently analyze your dilemma, cross-examine premises, spot fallacies, and converge on an actionable consensus.
            </p>

            <div>
              <button
                onClick={() => setIsNewDebateOpen(true)}
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Launch First Deliberation</span>
              </button>
            </div>

            {/* Quick Starters */}
            <div className="pt-10 border-t border-slate-900">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-4">
                Explore Pre-Engineered Dilemmas
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                {presets.slice(0, 3).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setIsNewDebateOpen(true);
                    }}
                    className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-900 hover:border-indigo-500/40 transition-all text-xs group"
                  >
                    <span className="text-[10px] uppercase font-mono font-semibold text-indigo-400 block mb-1">
                      {p.category}
                    </span>
                    <h4 className="font-bold text-slate-200 group-hover:text-indigo-300 line-clamp-2 leading-snug">
                      {p.title}
                    </h4>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Active Debate Arena */
          <div className="space-y-6">
            
            {/* Topic & Context Card */}
            <div className="bg-slate-900/40 rounded-2xl border border-slate-800/70 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wider">
                  Deliberation Topic
                </span>
                {currentSession.context && (
                  <span className="text-[11px] text-slate-400 italic">
                    Context provided
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white leading-snug">
                "{currentSession.topic}"
              </h2>
              {currentSession.context && (
                <p className="mt-2 text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 leading-relaxed">
                  {currentSession.context}
                </p>
              )}
            </div>

            {/* Deliberation Models Panel */}
            <AgentPanel
              agents={currentSession.agents}
              activeThinkingAgent={activeThinkingAgent}
              turns={currentSession.turns}
            />

            {/* Convergence Meter */}
            <ConvergenceMeter
              consensus={currentSession.consensus}
              currentRound={currentSession.current_round || 0}
              maxRounds={currentSession.max_rounds}
              turns={currentSession.turns}
            />

            {/* Navigation Tabs for Views */}
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-1">
              <button
                onClick={() => setActiveTab('transcript')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'transcript'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Transcript & Arguments ({currentSession.turns.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('matrix')}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'matrix'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <GitPullRequest className="w-4 h-4" />
                <span>Cross-Exam Matrix</span>
              </button>

              {currentSession.consensus && (
                <button
                  onClick={() => setActiveTab('consensus')}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'consensus'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-emerald-400 hover:bg-emerald-500/10'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Consensus Verdict</span>
                </button>
              )}
            </div>

            {/* Active View Container */}
            {activeTab === 'transcript' && (
              <LiveTranscript
                turns={currentSession.turns}
                agents={currentSession.agents}
              />
            )}

            {activeTab === 'matrix' && (
              <CritiqueMatrix
                turns={currentSession.turns}
                agents={currentSession.agents}
              />
            )}

            {activeTab === 'consensus' && (
              <ConsensusReportView
                consensus={currentSession.consensus}
                topic={currentSession.topic}
                context={currentSession.context}
                agents={currentSession.agents}
                turns={currentSession.turns}
              />
            )}

          </div>
        )}

      </main>

      {/* Modals & Drawers */}
      <NewDebateModal
        isOpen={isNewDebateOpen}
        onClose={() => setIsNewDebateOpen(false)}
        onStart={handleStartDebate}
        presets={presets}
        personas={personas}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        debates={historyList}
        onSelectDebate={handleSelectDebate}
        onDeleteDebate={handleDeleteDebate}
        selectedId={currentSession?.id}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>ConsensusAI — Multi-LLM Deliberative Decision Engine</p>
      </footer>
    </div>
  );
}
