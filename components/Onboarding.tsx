
import React, { useState } from 'react';
import { User } from '../types';
import { REGIONS, GENDERS, RIDING_STYLES, PREFERRED_TERRAINS, EXPERIENCE_LEVELS } from '../constants';
import Logo from './Logo';

interface OnboardingProps {
  onComplete: (user: User) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    birthYear: '',
    gender: 'Maschio',
    region: 'Lombardia',
    bio: '',
    preferredRiding: 'Turistica',
    preferredTerrain: 'Tutte Curve',
    experienceLevel: 'Intermedio',
    avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/200`,
    bike: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || 'Anonimo',
      avatar: formData.avatar || 'https://picsum.photos/id/1/200/200',
      ...formData
    } as User;
    onComplete(newUser);
  };

  const inputClass = "w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-4 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder:text-slate-600";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase mb-2 tracking-widest";

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-xl w-full bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden p-8 md:p-12">
        <div className="flex flex-col items-center mb-10">
          <Logo className="w-16 h-16 mb-4" />
          <h2 className="text-3xl font-bold brand-font text-white italic">
            BENVENUTO IN <span className="text-orange-500">CREW</span>
          </h2>
          <div className="w-full bg-slate-800 h-1 mt-6 rounded-full overflow-hidden">
            <div 
              className="bg-orange-500 h-full transition-all duration-500 ease-out" 
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
          <p className="text-slate-500 text-xs mt-3 uppercase font-bold tracking-widest">Passaggio {step} di 3</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <label className={labelClass}>Nickname</label>
                <input 
                  required
                  type="text" 
                  placeholder="Esempio: Biker99"
                  className={inputClass}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Anno di Nascita</label>
                  <input 
                    required
                    type="number" 
                    min="1940" 
                    max="2010"
                    placeholder="1990"
                    className={inputClass}
                    value={formData.birthYear}
                    onChange={e => setFormData({ ...formData, birthYear: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Genere</label>
                  <select 
                    className={inputClass}
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  >
                    {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>La tua moto (opzionale)</label>
                <input 
                  type="text" 
                  placeholder="Esempio: Honda Africa Twin"
                  className={inputClass}
                  value={formData.bike}
                  onChange={e => setFormData({ ...formData, bike: e.target.value })}
                />
              </div>
              <button 
                type="button" 
                onClick={nextStep}
                disabled={!formData.name || !formData.birthYear}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-xl shadow-orange-500/20 active:scale-95"
              >
                CONTINUA
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <label className={labelClass}>Regione di Residenza</label>
                <select 
                  className={inputClass}
                  value={formData.region}
                  onChange={e => setFormData({ ...formData, region: e.target.value })}
                >
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Bio: Raccontaci di te</label>
                <textarea 
                  rows={4}
                  placeholder="Cosa ami delle due ruote? Quali sono i tuoi giri ideali?"
                  className={inputClass}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
                >
                  INDIETRO
                </button>
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-orange-500/20 active:scale-95"
                >
                  CONTINUA
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <label className={labelClass}>Stile di Guida Preferito</label>
                <select 
                  className={inputClass}
                  value={formData.preferredRiding}
                  onChange={e => setFormData({ ...formData, preferredRiding: e.target.value })}
                >
                  {RIDING_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Terreno Preferito</label>
                <select 
                  className={inputClass}
                  value={formData.preferredTerrain}
                  onChange={e => setFormData({ ...formData, preferredTerrain: e.target.value })}
                >
                  {PREFERRED_TERRAINS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Livello di Esperienza</label>
                <select 
                  className={inputClass}
                  value={formData.experienceLevel}
                  onChange={e => setFormData({ ...formData, experienceLevel: e.target.value })}
                >
                  {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
                >
                  INDIETRO
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-orange-500/30 active:scale-95"
                >
                  INIZIA A CORRERE
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
