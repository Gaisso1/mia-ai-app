
import React from 'react';
import { Ride, RidingPace } from '../types';

interface RideCardProps {
  ride: Ride;
  onClick: (id: string) => void;
}

const RideCard: React.FC<RideCardProps> = ({ ride, onClick }) => {
  const getPaceColor = (pace: RidingPace) => {
    switch (pace) {
      case RidingPace.SPORTIVO: return 'bg-red-600';
      case RidingPace.ALLEGRO: return 'bg-orange-500';
      case RidingPace.TRANQUILLO: return 'bg-green-600';
      default: return 'bg-blue-600';
    }
  };

  return (
    <div 
      onClick={() => onClick(ride.id)}
      className="group relative bg-slate-800 rounded-xl overflow-hidden cursor-pointer transform transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/20"
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={ride.imageUrl} 
          alt={ride.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${getPaceColor(ride.pace)}`}>
            {ride.pace}
          </span>
        </div>
      </div>
      <div className="p-5 border-t border-slate-700">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white truncate group-hover:text-orange-400 transition-colors">
            {ride.title}
          </h3>
        </div>
        <p className="text-slate-400 text-sm flex items-center mb-3">
          <svg className="w-4 h-4 mr-1 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {ride.region} • {ride.province} • {ride.location}
        </p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex -space-x-2">
            {ride.participants.slice(0, 3).map((p) => (
              <img 
                key={p.id} 
                src={p.avatar} 
                className="w-8 h-8 rounded-full border-2 border-slate-800" 
                title={p.name} 
              />
            ))}
            {ride.participants.length > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                +{ride.participants.length - 3}
              </div>
            )}
          </div>
          <div className="text-xs text-slate-500 italic">
            Partenza: {new Date(ride.departureTime).toLocaleDateString('it-IT')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideCard;
