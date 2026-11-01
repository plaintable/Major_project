import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, Check, Server } from 'lucide-react';
import { getStoredApiKeys, saveStoredApiKeys } from '../services/api';

export default function SettingsModal({ isOpen, onClose }) {
  const [keys, setKeys] = useState({
    gemini: '',
    openai: '',
    anthropic: '',
    groq: '',
    deepseek: '',
    ollama_url: 'http://localhost:11434'
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredApiKeys();
      setKeys(prev => ({ ...prev, ...stored }));
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (provider, value) => {
    setKeys(prev => ({ ...prev, [provider]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveStoredApiKeys(keys);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">API Keys & Provider Configuration</h3>
              <p className="text-xs text-slate-400">Keys are stored locally in your browser session</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4">
          
          <div className="rounded-xl bg-indigo-950/20 border border-indigo-500/20 p-3 text-xs text-indigo-300 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> API keys are optional. When set to <em>Simulation Engine</em>, the system runs with realistic multi-agent cognitive simulation out-of-the-box!
            </span>
          </div>

          {/* Gemini */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={keys.gemini || ''}
              onChange={(e) => handleChange('gemini', e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* OpenAI */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              OpenAI API Key
            </label>
            <input
              type="password"
              value={keys.openai || ''}
              onChange={(e) => handleChange('openai', e.target.value)}
              placeholder="sk-proj-..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Anthropic */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Anthropic Claude API Key
            </label>
            <input
              type="password"
              value={keys.anthropic || ''}
              onChange={(e) => handleChange('anthropic', e.target.value)}
              placeholder="sk-ant-..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Groq */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Groq API Key (Llama 3.3)
            </label>
            <input
              type="password"
              value={keys.groq || ''}
              onChange={(e) => handleChange('groq', e.target.value)}
              placeholder="gsk_..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Ollama Local URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1.5">
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              <span>Local Ollama Endpoint</span>
            </label>
            <input
              type="text"
              value={keys.ollama_url || 'http://localhost:11434'}
              onChange={(e) => handleChange('ollama_url', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Save Button */}
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
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
            >
              {saved ? <Check className="w-4 h-4 text-emerald-400" /> : null}
              <span>{saved ? 'Saved!' : 'Save Configuration'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
