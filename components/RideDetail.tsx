
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

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(ride.id, newComment);
      setNewComment('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-700">
        
        {/* Left: Info & Map */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
          <div className="flex justify-between items-start">
            <button 
              onClick={onClose}
              className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <span className="px-4 py-1 bg-orange-500 rounded-full text-sm font-bold uppercase tracking-wider">
              {ride.pace}
            </span>
          </div>

          <div>
            <h2 className="text-4xl font-bold mb-2 text-white">{ride.title}</h2>
            <div className="flex items-center text-slate-400 space-x-4">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-1 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(ride.departureTime).toLocaleString('it-IT')}
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-1 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {ride.departurePoint}
              </span>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl overflow-hidden h-64 relative border border-slate-700">
            <img 
              src={`https://picsum.photos/id/12/800/600`} 
              className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700" 
              alt="Map"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-slate-900/80 p-4 rounded-lg border border-orange-500/50 backdrop-blur-md">
                <p className="text-orange-400 font-bold flex items-center">
                  <svg className="w-5 h-5 mr-2 animate-bounce" fill="currentColor" viewBox="0 0 20 20"><path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/></svg>
                  {ride.location} ({ride.province})
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-orange-500 uppercase tracking-tighter">Descrizione del Giro</h3>
            <p className="text-slate-300 leading-relaxed text-lg italic border-l-2 border-orange-500 pl-4 bg-slate-800/50 p-4 rounded-r-lg">
              "{ride.description}"
            </p>
          </div>

          <div className="space-y-4">
             <h3 className="text-xl font-bold text-orange-500 uppercase tracking-tighter">Partecipanti ({ride.participants.length})</h3>
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {ride.participants.map(p => (
                  <div key={p.id} className="flex items-center p-2 bg-slate-800/40 rounded-lg border border-slate-700/50">
                    <img src={p.avatar} className="w-10 h-10 rounded-full mr-3 border border-orange-500/30" />
                    <div>
                      <p className="text-sm font-bold text-white">{p.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase truncate">{p.bike || 'Moto Ignota'}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right: Comments */}
        <div className="w-full md:w-80 bg-slate-950/50 border-l border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-700 bg-slate-900">
            <h3 className="text-lg font-bold text-white uppercase">Discussione</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {ride.comments.length === 0 ? (
              <p className="text-slate-600 text-sm italic text-center mt-10">...</p>
            ) : (
              ride.comments.map(comment => (
                <div key={comment.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-400">{comment.userName}</span>
                    <span className="text-[10px] text-slate-600">
                      {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-lg text-sm text-slate-300">
                    {comment.text}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-slate-900 border-t border-slate-700">
            <button 
              onClick={() => onJoin(ride.id)}
              className="w-full mb-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95"
            >
              PARTECIPA AL GIRO
            </button>
            <form onSubmit={handleCommentSubmit} className="relative">
              <input 
                type="text" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Scrivi un commento..." 
                className="w-full bg-slate-800 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12 border border-slate-700"
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 p-1.5 text-orange-500 hover:text-orange-400 transition-colors"
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
