
import React, { useState } from 'react';
import { REGIONS, PROVINCES, LOCATIONS } from '../constants';
import { RidingPace, Ride, User } from '../types';

interface CreateRideModalProps {
  onClose: () => void;
  onSave: (ride: Ride) => void;
  currentUser: User;
}

const CreateRideModal: React.FC<CreateRideModalProps> = ({ onClose, onSave, currentUser }) => {
  const [formData, setFormData] = useState({
    title: '',
    region: '',
    province: '',
    location: '',
    departurePoint: '',
    departureTime: '',
    description: '',
    pace: RidingPace.ALLEGRO,
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];
    
    if (!formData.title.trim()) newErrors.push("Titolo mancante");
    if (!formData.region) newErrors.push("Regione non selezionata");
    if (!formData.province) newErrors.push("Provincia non selezionata");
    if (!formData.location) newErrors.push("Località non selezionata");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const newRide: Ride = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      country: 'Italia',
      region: formData.region,
      province: formData.province,
      location: formData.location,
      departurePoint: formData.departurePoint || 'Punto di ritrovo da definire',
      departureTime: formData.departureTime || new Date().toISOString(),
      description: formData.description || 'Nessuna descrizione fornita.',
      pace: formData.pace,
      organizer: currentUser,
      participants: [currentUser],
      comments: [],
      // Usiamo un'immagine randomica coerente per il mock
      imageUrl: `https://picsum.photos/seed/${formData.title}/800/400`,
      mapCoords: { lat: 45.0, lng: 9.0 }
    };

    onSave(newRide);
  };

  const labelClass = "block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest";
  const inputClass = "w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all disabled:opacity-50";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-700 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <h2 className="text-2xl font-bold text-white brand-font italic">Proponi un nuovo <span className="text-orange-500">Giro</span></h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl">
              <p className="text-red-500 text-xs font-bold uppercase mb-2">Attenzione:</p>
              <ul className="text-red-400 text-sm list-disc list-inside">
                {errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className={labelClass}>Titolo del Giro *</label>
              <input 
                type="text" 
                placeholder="Esempio: Curve al tramonto sul Garda"
                className={inputClass}
                value={formData.title}
                onChange={e => {
                  setFormData({...formData, title: e.target.value});
                  if (errors.length) setErrors([]);
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Regione *</label>
                <select 
                  className={inputClass}
                  value={formData.region}
                  onChange={e => {
                    setFormData({...formData, region: e.target.value, province: '', location: ''});
                    if (errors.length) setErrors([]);
                  }}
                >
                  <option value="">Seleziona Regione</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Provincia *</label>
                <select 
                  disabled={!formData.region}
                  className={inputClass}
                  value={formData.province}
                  onChange={e => {
                    setFormData({...formData, province: e.target.value, location: ''});
                    if (errors.length) setErrors([]);
                  }}
                >
                  <option value="">Seleziona Provincia</option>
                  {(PROVINCES[formData.region] || []).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Località / Passo *</label>
                <select 
                  disabled={!formData.province}
                  className={inputClass}
                  value={formData.location}
                  onChange={e => {
                    setFormData({...formData, location: e.target.value});
                    if (errors.length) setErrors([]);
                  }}
                >
                  <option value="">Seleziona Località</option>
                  {(LOCATIONS[formData.province] || []).map(l => <option key={l} value={l}>{l}</option>)}
                  <option value="Altro">Altro...</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Ritmo di Guida</label>
                <select 
                  className={inputClass}
                  value={formData.pace}
                  onChange={e => setFormData({...formData, pace: e.target.value as RidingPace})}
                >
                  {Object.values(RidingPace).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Punto di Ritrovo</label>
                <input 
                  type="text" 
                  placeholder="Esempio: Benzinaio Eni, Via Roma"
                  className={inputClass}
                  value={formData.departurePoint}
                  onChange={e => setFormData({...formData, departurePoint: e.target.value})}
                />
              </div>
              <div>
                <label className={labelClass}>Data e Ora Partenza</label>
                <input 
                  type="datetime-local" 
                  className={inputClass}
                  value={formData.departureTime}
                  onChange={e => setFormData({...formData, departureTime: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Descrizione del Giro</label>
              <textarea 
                rows={4}
                placeholder="Dettagli sul percorso, soste previste, pranzo..."
                className={inputClass}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-6 border-t border-slate-800 bg-slate-900 flex gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
          >
            ANNULLA
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-orange-500/30 active:scale-95"
          >
            PUBBLICA GIRO
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRideModal;
