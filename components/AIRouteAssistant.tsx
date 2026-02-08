
import React, { useState } from 'react';
import { User } from '../types';
import { getRouteSuggestions } from '../services/gemini';
import Logo from './Logo';

interface AIRouteAssistantProps {
  user: User;
  onClose: () => void;
}

const AIRouteAssistant: React.FC<AIRouteAssistantProps> = ({ user, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResponse(null);
    try {
      // Create a context-rich query for Gemini
      const context = `Sono un motociclista con esperienza ${user.experienceLevel}. 
        Guido una ${user.bike || 'moto'}. 
        Il mio stile preferito è ${user.preferredRiding} su terreni ${user.preferredTerrain}. 
        Abito in ${user.region}. 
        Domanda: ${prompt}`;
      
      const result = await getRouteSuggestions(context, user.preferredRiding as any);
      setResponse(result);
    } catch (err) {
      setResponse("Scusa, ho avuto un problema tecnico. Riprova tra poco!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-orange-500/30 animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-white brand-font italic">CREW <span className="text-orange-500">AI Assistant</span></h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {!response && !isLoading && (
            <div className="text-center py-10 space-y-4">
              <Logo className="w-16 h-16 mx-auto opacity-20 grayscale" />
              <p className="text-slate-400 max-w-sm mx-auto">
                Ciao <span className="text-orange-500 font-bold">{user.name}</span>! Chiedimi un consiglio su un itinerario o un passo di montagna. Analizzerò il tuo profilo per darti la risposta perfetta.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {["Giro in Toscana", "Passi alpini", "Curve Liguria"].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setPrompt(tag)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full text-xs font-bold transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
              <p className="text-orange-500 font-bold animate-pulse uppercase tracking-widest text-xs">Sto calcolando la rotta perfetta...</p>
            </div>
          )}

          {response && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 prose prose-invert max-w-none">
                <div className="flex items-center space-x-2 mb-4 text-orange-500 uppercase text-xs font-bold tracking-widest">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"/></svg>
                  <span>Suggerimento AI</span>
                </div>
                <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {response}
                </div>
              </div>
              <button 
                onClick={() => {setResponse(null); setPrompt('');}}
                className="mt-6 text-orange-500 text-xs font-bold uppercase hover:underline"
              >
                Fai un'altra domanda
              </button>
            </div>
          )}
        </div>

        {/* Input Area */}
        {!response && !isLoading && (
          <div className="p-6 border-t border-slate-800 bg-slate-900/50">
            <form onSubmit={handleAsk} className="relative">
              <input 
                autoFocus
                type="text" 
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Dove vuoi andare oggi?"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all pr-16"
              />
              <button 
                disabled={!prompt.trim()}
                type="submit"
                className="absolute right-3 top-3 p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:grayscale"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRouteAssistant;
