
import React, { useState, useMemo, useEffect } from 'react';
import RideCard from './components/RideCard';
import RideDetail from './components/RideDetail';
import RideFilters from './components/RideFilters';
import Onboarding from './components/Onboarding';
import CreateRideModal from './components/CreateRideModal';
import AIRouteAssistant from './components/AIRouteAssistant';
import Logo from './components/Logo';
import { MOCK_RIDES } from './constants';
import { Ride, GeoFilter, RidingPace, Comment, User } from './types';

type Tab = 'active' | 'my-rides' | 'community';

const App: React.FC = () => {
  // Caricamento iniziale sicuro da LocalStorage per l'utente
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('crew_user_profile');
    return saved ? JSON.parse(saved) : null;
  });

  // Caricamento iniziale sicuro da LocalStorage per i giri
  const [rides, setRides] = useState<Ride[]>(() => {
    const saved = localStorage.getItem('crew_rides_db');
    return saved ? JSON.parse(saved) : MOCK_RIDES;
  });

  const [isInitializing, setIsInitializing] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('active');

  // Effetto per segnalare la fine dell'inizializzazione
  useEffect(() => {
    setIsInitializing(false);
  }, []);

  // Sincronizzazione automatica dei giri su LocalStorage ad ogni modifica
  useEffect(() => {
    localStorage.setItem('crew_rides_db', JSON.stringify(rides));
  }, [rides]);

  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const [geoFilter, setGeoFilter] = useState<GeoFilter>({
    region: 'Tutte',
    province: 'Tutte',
    location: 'Tutte'
  });
  const [paceFilter, setPaceFilter] = useState<RidingPace | 'Tutti'>('Tutti');

  const filteredRides = useMemo(() => {
    let list = rides;
    
    if (activeTab === 'my-rides' && user) {
      list = rides.filter(r => 
        r.organizer.id === user.id || r.participants.some(p => p.id === user.id)
      );
    }

    return list.filter(ride => {
      const matchRegion = geoFilter.region === 'Tutte' || ride.region === geoFilter.region;
      const matchProvince = geoFilter.province === 'Tutte' || ride.province === geoFilter.province;
      const matchLocation = geoFilter.location === 'Tutte' || ride.location === geoFilter.location;
      const matchPace = paceFilter === 'Tutti' || ride.pace === paceFilter;
      return matchRegion && matchProvince && matchLocation && matchPace;
    });
  }, [rides, geoFilter, paceFilter, activeTab, user]);

  const allCommunityMembers = useMemo(() => {
    const membersMap = new Map<string, User>();
    rides.forEach(r => {
      membersMap.set(r.organizer.id, r.organizer);
      r.participants.forEach(p => membersMap.set(p.id, p));
    });
    if (user) membersMap.set(user.id, user);
    return Array.from(membersMap.values());
  }, [rides, user]);

  const selectedRide = useMemo(() => 
    rides.find(r => r.id === selectedRideId) || null,
  [rides, selectedRideId]);

  const handleOnboardingComplete = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('crew_user_profile', JSON.stringify(newUser));
  };

  const handleAddComment = (rideId: string, text: string) => {
    if (!user) return;
    setRides(prev => prev.map(ride => {
      if (ride.id === rideId) {
        const newComment: Comment = {
          id: Math.random().toString(36).substr(2, 9),
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          text,
          timestamp: new Date().toISOString()
        };
        return { ...ride, comments: [...ride.comments, newComment] };
      }
      return ride;
    }));
  };

  const handleJoinRide = (rideId: string) => {
    if (!user) return;
    setRides(prev => prev.map(ride => {
      if (ride.id === rideId) {
        const isAlreadyParticipant = ride.participants.some(p => p.id === user.id);
        if (isAlreadyParticipant) return ride;
        return { ...ride, participants: [...ride.participants, user] };
      }
      return ride;
    }));
  };

  const handleSaveRide = (newRide: Ride) => {
    setRides(prev => [newRide, ...prev]);
    setGeoFilter({ region: 'Tutte', province: 'Tutte', location: 'Tutte' });
    setPaceFilter('Tutti');
    setIsCreateModalOpen(false);
    setSelectedRideId(newRide.id);
  };

  if (isInitializing) return null;

  if (!user) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-28 md:pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('active')}>
            <Logo className="w-10 h-10" />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tighter brand-font leading-none">
                CREW
              </h1>
              <span className="text-[10px] text-slate-500 font-medium tracking-widest hidden sm:block">
                Connect-Ride-Enjoy-World
              </span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-bold uppercase tracking-widest text-slate-400">
            <button onClick={() => setActiveTab('active')} className={`${activeTab === 'active' ? 'text-orange-500 border-b-2 border-orange-500' : 'hover:text-white'} transition-all pb-1`}>Giri Attivi</button>
            <button onClick={() => setActiveTab('my-rides')} className={`${activeTab === 'my-rides' ? 'text-orange-500 border-b-2 border-orange-500' : 'hover:text-white'} transition-all pb-1`}>I Miei Giri</button>
            <button onClick={() => setActiveTab('community')} className={`${activeTab === 'community' ? 'text-orange-500 border-b-2 border-orange-500' : 'hover:text-white'} transition-all pb-1`}>Community</button>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-white uppercase">{user.name}</p>
              <p className="text-[10px] text-orange-500 font-medium italic">{user.bike || 'Moto Biker'}</p>
            </div>
            <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-slate-700 shadow-xl" alt="Avatar" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        {activeTab === 'community' ? (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="mb-8 md:mb-12 text-center md:text-left">
              <h2 className="text-4xl font-bold tracking-tight text-white mb-2 italic brand-font">La <span className="text-orange-500">Community</span></h2>
              <p className="text-slate-500">Scopri chi altro sta correndo con te.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allCommunityMembers.map(member => (
                <div key={member.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-orange-500/50 transition-all group hover:shadow-2xl hover:shadow-orange-500/5">
                  <div className="flex items-center space-x-4 mb-4">
                    <img src={member.avatar} className="w-16 h-16 rounded-2xl border-2 border-slate-800 group-hover:border-orange-500/50 transition-all shadow-lg" alt={member.name} />
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-orange-500 transition-colors">{member.name}</h3>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{member.region}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-slate-600">
                      <span>Moto</span>
                      <span className="text-orange-500">{member.bike || '-'}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase text-slate-600">
                      <span>Esperienza</span>
                      <span className="text-white">{member.experienceLevel || 'Intermedio'}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 italic line-clamp-2">"{member.bio || 'Appassionato di due ruote.'}"</p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-3 space-y-6">
              <div className="hidden lg:block">
                <RideFilters 
                  filter={geoFilter}
                  onFilterChange={(update) => setGeoFilter(prev => ({ ...prev, ...update }))}
                  selectedPace={paceFilter}
                  onPaceChange={setPaceFilter}
                />
              </div>
              
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full py-4 bg-white hover:bg-slate-200 text-slate-900 font-bold rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-xl hover:shadow-white/20 group"
              >
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                </svg>
                <span>{activeTab === 'active' ? 'PROPONI UN GIRO' : 'CREA NUOVO'}</span>
              </button>
            </aside>

            {/* Ride Grid */}
            <section className="lg:col-span-9">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold tracking-tight text-white italic brand-font">
                  {activeTab === 'active' ? 'Giri Attivi' : 'I Miei Giri'} 
                  <span className="text-slate-500 ml-2 font-light text-xl">({filteredRides.length})</span>
                </h2>
                
                {/* Visual indicator of active filters for mobile */}
                {geoFilter.region !== 'Tutte' && (
                  <div className="lg:hidden flex items-center space-x-2 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-orange-500">{geoFilter.region}</span>
                    <button onClick={() => setGeoFilter({region: 'Tutte', province: 'Tutte', location: 'Tutte'})}>
                       <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                  </div>
                )}
              </div>

              {filteredRides.length === 0 ? (
                <div className="bg-slate-900/50 rounded-3xl p-12 md:p-20 text-center border-2 border-dashed border-slate-800">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Nessun giro trovato</h3>
                  <p className="text-slate-500 max-w-xs mx-auto text-sm">Prova a cambiare i filtri di ricerca o proponi tu il prossimo itinerario!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredRides.map(ride => (
                    <RideCard 
                      key={ride.id} 
                      ride={ride} 
                      onClick={(id) => setSelectedRideId(id)} 
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Informativa sul salvataggio locale */}
      <footer className="max-w-7xl mx-auto px-4 py-4 text-center border-t border-slate-900 text-[10px] text-slate-700 font-medium uppercase tracking-widest mb-20 md:mb-4">
        I dati sono salvati localmente sul tuo browser per questa anteprima.
      </footer>

      {/* Mobile Bottom Navigation - Z-INDEX CORRETTO PER MOBILE */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-6 py-3 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <button onClick={() => setActiveTab('active')} className={`flex flex-col items-center space-y-1 ${activeTab === 'active' ? 'text-orange-500' : 'text-slate-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A2 2 0 013 15.382V6.618a2 2 0 011.553-1.944l6-1.5a2 2 0 01.894 0l6 1.5a2 2 0 011.553 1.944v8.764a2 2 0 01-1.553 1.944L11 20z" /></svg>
          <span className="text-[10px] font-bold uppercase">Giri</span>
        </button>
        <button onClick={() => setActiveTab('my-rides')} className={`flex flex-col items-center space-y-1 ${activeTab === 'my-rides' ? 'text-orange-500' : 'text-slate-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          <span className="text-[10px] font-bold uppercase">I Miei</span>
        </button>
        <button onClick={() => setIsAIModalOpen(true)} className="flex flex-col items-center -mt-10">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-full shadow-2xl flex items-center justify-center border-4 border-slate-950 ring-2 ring-orange-500/20 active:scale-90 transition-transform">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="text-[10px] font-bold uppercase mt-1 text-orange-500">AI</span>
        </button>
        <button onClick={() => setActiveTab('community')} className={`flex flex-col items-center space-y-1 ${activeTab === 'community' ? 'text-orange-500' : 'text-slate-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          <span className="text-[10px] font-bold uppercase">Crew</span>
        </button>
        <button 
          onClick={() => { if(confirm("Resettare il profilo?")) { localStorage.clear(); window.location.reload(); } }}
          className="flex flex-col items-center space-y-1 text-slate-500"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="text-[10px] font-bold uppercase">Logout</span>
        </button>
      </div>

      {/* Desktop AI Assistant Button (Floating) */}
      <button 
        onClick={() => setIsAIModalOpen(true)}
        className="hidden lg:flex fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full shadow-[0_10px_40px_rgba(249,115,22,0.4)] items-center justify-center hover:scale-110 transition-all active:scale-95 z-40 group"
      >
        <svg className="w-9 h-9 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="absolute right-full mr-4 bg-slate-900 text-white text-[10px] font-bold uppercase px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-slate-700 pointer-events-none shadow-2xl">
          Chiedi un percorso all'AI
        </span>
      </button>

      {/* Detail Overlay */}
      {selectedRide && (
        <RideDetail 
          ride={selectedRide} 
          onClose={() => setSelectedRideId(null)} 
          onAddComment={handleAddComment}
          onJoin={handleJoinRide}
        />
      )}

      {/* Create Ride Modal */}
      {isCreateModalOpen && (
        <CreateRideModal 
          currentUser={user}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleSaveRide}
        />
      )}

      {/* AI Assistant Modal */}
      {isAIModalOpen && (
        <AIRouteAssistant 
          user={user}
          onClose={() => setIsAIModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
