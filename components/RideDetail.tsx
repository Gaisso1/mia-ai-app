
import React, { useState } from 'react';
import { Ride, Comment, RidingPace } from '../types';

interface RideDetailProps {
  ride: Ride;
  onClose: () => void;
  onAddComment: (rideId: string, text: string) => void;
  onJoin: (rideId: string) => void;
}

const RideDetail: React.FC<RideDetailProps> = ({ ride, onClose, onAddComment, onJoin }) => {
  const [newComment, setNewComment] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(ride.id, newComment);
      setNewComment('');
    }
  };

  const handleShare = () => {
    // Genera un link con i dati del giro codificati in base64
    const rideData = btoa(JSON.stringify(ride));
    const shareUrl = `${window.location.origin}${window.location.pathname}?shareRide=${rideData}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      alert("Link del giro copiato! Invialo ai tuoi amici su WhatsApp per invitarli.");
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-700 animate-in zoom-in-95 duration-300">
        
        {/* Left: Info & Map */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <button 
              onClick={onClose}
              className="p-3 bg-slate-800 rounded-2xl hover:bg-slate-700 text-slate-400 transition-colors active:scale-90"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold uppercase text-orange-500 transition-all active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                <span>{copied ? 'COPIATO!' : 'CONDIVIDI'}</span>
              </button>
              <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-lg ${
                ride.pace === RidingPace.SPORTIVO ? 'bg-red-600' : ride.pace === RidingPace.ALLEGRO ? 'bg-orange-500' : 'bg-green-600'
              }`}>
                {ride.pace}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-3 text-white italic brand-font leading-tight">{ride.title}</h2>
            <div className="flex flex-wrap gap-4 text-slate-400">
              <span className="flex items-center bg-slate-800 px-3 py-1.5 rounded-lg text-sm">
                <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {new Date(ride.departureTime).toLocaleString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="flex items-center bg-slate-800 px-3 py-1.5 rounded-lg text-sm">
                <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                {ride.departurePoint}
              </span>
            </div>
          </div>

          <div className="bg-slate-800 rounded-3xl overflow-hidden h-60 md:h-80 relative border border-slate-700 group shadow-inner">
            <img 
              src={`https://picsum.photos/seed/${ride.id}/1200/800`} 
              className="w-full h-full object-cover opacity-50 transition-all duration-1000 group-hover:scale-110 group-hover:opacity-80" 
              alt="Mappa Itinerario"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-orange-500/50 backdrop-blur-xl shadow-2xl">
                <p className="text-orange-500 font-black flex items-center text-lg uppercase tracking-tighter italic">
                  <svg className="w-6 h-6 mr-3 animate-bounce" fill="currentColor" viewBox="0 0 20 20"><path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/></svg>
                  {ride.location} • {ride.province}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black text-orange-500 uppercase tracking-widest flex items-center">
              <span className="w-8 h-[2px] bg-orange-500 mr-3"></span>
              Briefing Itinerario
            </h3>
            <p className="text-slate-300 leading-relaxed text-lg italic border-l-4 border-orange-500/50 pl-6 py-2">
              "{ride.description}"
            </p>
          </div>

          <div className="space-y-6 pt-4">
             <h3 className="text-sm font-black text-white uppercase tracking-widest">Team al via ({ride.participants.length})</h3>
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {ride.participants.map(p => (
                  <div key={p.id} className="flex items-center p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-orange-500/30 transition-all">
                    <img src={p.avatar} className="w-10 h-10 rounded-full mr-3 border-2 border-slate-700" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{p.name}</p>
                      <p className="text-[10px] text-orange-500 font-bold uppercase truncate">{p.bike || 'No Bike'}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right: Interaction Panel */}
        <div className="w-full md:w-96 bg-slate-950/40 border-l border-slate-800 flex flex-col">
          <div className="p-6 border-b border-slate-800 bg-slate-900/50">
            <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Radio Biker</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
            {ride.comments.length === 0 ? (
              <div className="text-center py-10 opacity-20">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <p className="text-xs font-bold uppercase">Nessuna comunicazione</p>
              </div>
            ) : (
              ride.comments.map(comment => (
                <div key={comment.id} className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-tighter">{comment.userName}</span>
                    <span className="text-[9px] text-slate-600 font-bold">
                      {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="bg-slate-800/80 p-4 rounded-2xl rounded-tl-none text-sm text-slate-300 border border-slate-700/50">
                    {comment.text}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 bg-slate-900/80 border-t border-slate-800">
            <button 
              onClick={() => onJoin(ride.id)}
              className="w-full mb-4 py-5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-500/20 active:scale-95"
            >
              SALTA IN SELLA
            </button>
            <form onSubmit={handleCommentSubmit} className="relative">
              <input 
                type="text" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Invia un messaggio..." 
                className="w-full bg-slate-800 text-white text-sm rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-14 border border-slate-700"
              />
              <button 
                type="submit"
                className="absolute right-3 top-3 p-2 text-orange-500 hover:bg-orange-500/10 rounded-xl transition-all"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideDetail;
