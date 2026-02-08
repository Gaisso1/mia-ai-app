
import React, { useState, useMemo, useEffect } from 'react';
import RideCard from './components/RideCard';
import RideDetail from './components/RideDetail';
import RideFilters from './components/RideFilters';
import Onboarding from './components/Onboarding';
import CreateRideModal from './components/CreateRideModal';
import Logo from './components/Logo';
import { MOCK_RIDES } from './constants';
import { Ride, GeoFilter, RidingPace, Comment, User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Check for stored user on load
  useEffect(() => {
    const savedUser = localStorage.getItem('crew_user_profile');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsInitializing(false);
  }, []);

  const [rides, setRides] = useState<Ride[]>(MOCK_RIDES);
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const [geoFilter, setGeoFilter] = useState<GeoFilter>({
    region: 'Tutte',
    province: 'Tutte',
    location: 'Tutte'
  });
  const [paceFilter, setPaceFilter] = useState<RidingPace | 'Tutti'>('Tutti');

  const filteredRides = useMemo(() => {
    return rides.filter(ride => {
      const matchRegion = geoFilter.region === 'Tutte' || ride.region === geoFilter.region;
      const matchProvince = geoFilter.province === 'Tutte' || ride.province === geoFilter.province;
      const matchLocation = geoFilter.location === 'Tutte' || ride.location === geoFilter.location;
      const matchPace = paceFilter === 'Tutti' || ride.pace === paceFilter;
      return matchRegion && matchProvince && matchLocation && matchPace;
    });
  }, [rides, geoFilter, paceFilter]);

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
        if (ride.participants.some(p => p.id === user.id)) {
          return ride;
        }
        return { ...ride, participants: [...ride.participants, user] };
      }
      return ride;
    }));
  };

  const handleSaveRide = (newRide: Ride) => {
    // Aggiungiamo il nuovo giro in cima alla lista
    setRides(prev => [newRide, ...prev]);
    
    // Resettiamo i filtri per assicurarci che l'utente veda il nuovo giro
    setGeoFilter({
      region: 'Tutte',
      province: 'Tutte',
      location: 'Tutte'
    });
    setPaceFilter('Tutti');
    
    // Chiudiamo la modale
    setIsCreateModalOpen(false);
    
    // Opzionale: apriamo direttamente il dettaglio del giro creato
    setSelectedRideId(newRide.id);
  };

  if (isInitializing) return null;

  if (!user) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Logo className="w-12 h-12" />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold tracking-tighter brand-font leading-none">
                CREW
              </h1>
              <span className="text-[10px] text-slate-500 font-medium tracking-widest hidden sm:block">
                Connect-Ride-Enjoy-World
              </span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-bold uppercase tracking-widest text-slate-400">
            <a href="#" className="text-orange-500 border-b-2 border-orange-500 pb-1">Giri Attivi</a>
            <a href="#" className="hover:text-white transition-colors">I Miei Giri</a>
            <a href="#" className="hover:text-white transition-colors">Community</a>
          </nav>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-white uppercase">{user.name}</p>
                <p className="text-[10px] text-orange-500 font-medium italic">{user.bike || 'Moto Ignota'}</p>
              </div>
              <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-slate-700 shadow-xl shadow-orange-500/5" alt="Avatar" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3">
            <RideFilters 
              filter={geoFilter}
              onFilterChange={(update) => setGeoFilter(prev => ({ ...prev, ...update }))}
              selectedPace={paceFilter}
              onPaceChange={setPaceFilter}
            />
            
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full mt-6 py-4 bg-white hover:bg-slate-200 text-slate-900 font-bold rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-xl hover:shadow-white/10 group"
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
              </svg>
              <span>PROPONI UN GIRO</span>
            </button>
          </aside>

          {/* Ride Grid */}
          <section className="lg:col-span-9">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Giri trovati <span className="text-slate-500 ml-2 font-light">({filteredRides.length})</span>
              </h2>
            </div>

            {filteredRides.length === 0 ? (
              <div className="bg-slate-900/50 rounded-3xl p-20 text-center border-2 border-dashed border-slate-800">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Nessun giro trovato</h3>
                <p className="text-slate-500 max-w-xs mx-auto">Prova a cambiare i filtri di ricerca o proponi tu il prossimo itinerario!</p>
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
      </main>

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

      {/* Floating AI Assistant */}
      <button 
        title="Chiedi un percorso all'AI"
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-40 group"
      >
        <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="absolute right-full mr-4 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-slate-700">
          Chiedi un percorso all'AI
        </span>
      </button>
    </div>
  );
};

export default App;
