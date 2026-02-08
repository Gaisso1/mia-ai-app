
import React from 'react';
import { REGIONS, PROVINCES, LOCATIONS } from '../constants';
import { RidingPace, GeoFilter } from '../types';

interface RideFiltersProps {
  filter: GeoFilter;
  onFilterChange: (filter: Partial<GeoFilter>) => void;
  selectedPace: RidingPace | 'Tutti';
  onPaceChange: (pace: RidingPace | 'Tutti') => void;
}

const RideFilters: React.FC<RideFiltersProps> = ({ filter, onFilterChange, selectedPace, onPaceChange }) => {
  return (
    <div className="space-y-8 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
      <h2 className="text-2xl font-bold text-white accent-border pl-4">Cerca Giri</h2>
      
      {/* Geo Filters */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Regione</label>
          <select 
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
            value={filter.region}
            onChange={(e) => onFilterChange({ region: e.target.value, province: 'Tutte', location: 'Tutte' })}
          >
            <option value="Tutte">Tutte le Regioni</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Provincia</label>
          <select 
            disabled={filter.region === 'Tutte'}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none disabled:opacity-50"
            value={filter.province}
            onChange={(e) => onFilterChange({ province: e.target.value, location: 'Tutte' })}
          >
            <option value="Tutte">Tutte le Province</option>
            {(PROVINCES[filter.region] || []).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Località / Passo</label>
          <select 
            disabled={filter.province === 'Tutte'}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none disabled:opacity-50"
            value={filter.location}
            onChange={(e) => onFilterChange({ location: e.target.value })}
          >
            <option value="Tutte">Tutte le Località</option>
            {(LOCATIONS[filter.province] || []).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Pace Filter */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ritmo di Guida</label>
        <div className="flex flex-wrap gap-2">
          {(['Tutti', ...Object.values(RidingPace)] as const).map(p => (
            <button
              key={p}
              onClick={() => onPaceChange(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                selectedPace === p 
                ? 'bg-orange-500 border-orange-500 text-white' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RideFilters;
