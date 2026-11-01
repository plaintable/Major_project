import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Users, Layers, Play } from 'lucide-react';

export default function NewDebateModal({ isOpen, onClose, onStart, presets = [], personas = [] }) {
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [maxRounds, setMaxRounds] = useState(2);
  const [selectedAgentIds, setSelectedAgentIds] = useState(['pragmatist', 'skeptic', 'first_principles', 'visionary']);
  const [agentProviders, setAgentProviders] = useState({});

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setTopic(preset.topic);
    setContext(preset.context || '');
    setMaxRounds(preset.recommended_rounds || 2);
    if (preset.suggested_agents && preset.suggested_agents.length) {
      setSelectedAgentIds(preset.suggested_agents);
    }
  };

  const toggleAgent = (id) => {
    if (selectedAgentIds.includes(id)) {
      if (selectedAgentIds.length > 2) {
        setSelectedAgentIds(selectedAgentIds.filter(a => a !== id));
      }
    } else {
      setSelectedAgentIds([...selectedAgentIds, id]);
    }
  };

  const handleProviderChange = (agentId, provider) => {
    setAgentProviders(prev => ({ ...prev, [agentId]: provider }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const chosenAgents = personas
      .filter(p => selectedAgentIds.includes(p.id))
      .map(p => ({
        ...p,
        provider: agentProviders[p.id] || p.provider || 'simulator'
      }));

    onStart({
      topic: topic.trim(),
      context: context.trim(),
      max_rounds: parseInt(maxRounds),
      agents: chosenAgents
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Configure Deliberative Debate</h3>
              <p className="text-xs text-slate-400">Launch a multi-agent investigation and consensus trial</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          
          {/* Preset Topics Carousel */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Or Select from Curated Dilemmas:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
              {presets.map((preset) => (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className="text-left p-2.5 rounded-xl border border-slate-800 hover:border-indigo-500/50 bg-slate-950/60 hover:bg-slate-950 transition-all text-xs group"
                >
                  <span className="font-semibold text-slate-200 group-hover:text-indigo-300 block truncate">
                    {preset.title}
                  </span>
                  <span className="text-[10px] text-slate-500">{preset.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Topic Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Debate Question / Strategic Dilemma:
            </label>
            <textarea
              required
              rows={2}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Should our engineering team migrate our monolithic database to microservices?"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Context Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Supporting Context & Constraints (Optional):
            </label>
            <textarea
              rows={2}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Add key numbers, SLAs, tech stack, constraints, or organizational details..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Number of Rounds */}
          <div className="flex items-center justify-between bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-200 block">Cross-Examination Depth</span>
              <span className="text-[11px] text-slate-400">
                Number of critique and rebuttal rounds before consensus synthesis
              </span>
            </div>
            <div className="flex items-center space-x-1.5">
              {[1, 2, 3].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setMaxRounds(r)}
                  className={`w-9 h-8 rounded-lg text-xs font-bold transition-all ${
                    maxRounds === r
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {r}R
                </button>
              ))}
            </div>
          </div>

          {/* Participating Agents & Providers */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Participating Model Personas ({selectedAgentIds.length} Selected):</span>
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {personas.map((agent) => {
                const isSelected = selectedAgentIds.includes(agent.id);
                return (
                  <div
                    key={agent.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs ${
                      isSelected
                        ? 'bg-slate-950 border-indigo-500/40'
                        : 'bg-slate-950/40 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleAgent(agent.id)}
                        className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: agent.avatar_color || '#6366f1' }}
                      ></span>
                      <div>
                        <span className="font-semibold text-slate-200">{agent.name}</span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-xs">{agent.role_title}</span>
                      </div>
                    </div>

                    {/* Provider selector */}
                    {isSelected && (
                      <select
                        value={agentProviders[agent.id] || agent.provider || 'simulator'}
                        onChange={(e) => handleProviderChange(agent.id, e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
                      >
                        <option value="simulator">Simulation Engine (No Key)</option>
                        <option value="gemini">Google Gemini 2.0</option>
                        <option value="openai">OpenAI GPT-4o</option>
                        <option value="anthropic">Claude 3.5 Sonnet</option>
                        <option value="groq">Groq (Llama-3.3)</option>
                        <option value="deepseek">DeepSeek R1/V3</option>
                        <option value="ollama">Local Ollama</option>
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!topic.trim()}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Deliberation</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
